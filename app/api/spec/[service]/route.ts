import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import http from 'http';

// Service URL mappings
const serviceUrls: Record<string, string> = {
  billing: 'https://billing.qa.sbs.lumsb.com:4443/openapi.json',
  sdb: 'https://subscriptions-api.qa.sbs.lumsb.com:4090/sdb-api/v3/api-docs',
  idm: 'http://idmapi.qa.idm.lumsb.com:4444/idm-api/v3/api-docs',
};

// Helper function to make requests with SSL verification disabled
function fetchWithoutSSL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      rejectUnauthorized: false,
    };

    const client = isHttps ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;
  const targetUrl = serviceUrls[service.toLowerCase()];

  if (!targetUrl) {
    return NextResponse.json(
      { error: `Unknown service: ${service}` },
      { status: 404 }
    );
  }

  try {
    console.log(`[Proxy] Fetching spec for: ${service} from ${targetUrl}`);
    
    const responseText = await fetchWithoutSSL(targetUrl);
    const data = JSON.parse(responseText);

    // FIX: Downgrade OpenAPI 3.1.x to 3.0.3 for swagger-ui-react compatibility
    if (data.openapi && data.openapi.startsWith('3.1')) {
      console.log(`[Proxy] Downgrading OpenAPI version from ${data.openapi} to 3.0.3`);
      data.openapi = '3.0.3';
    }

    console.log(`[Proxy] Successfully fetched spec for: ${service}`);

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error(`[Proxy] Error for ${service}:`, error.message);
    return NextResponse.json(
      { error: `Proxy failed: ${error.message}` },
      { status: 500 }
    );
  }
}
