import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/billing",
        destination: "https://billing.qa.sbs.lumsb.com:4443/openapi.json",
      },
      {
        source: "/api/proxy/sdb",
        destination:
          "https://subscriptions-api.qa.sbs.lumsb.com:4090/sdb-api/v3/api-docs",
      },
      {
        source: "/api/proxy/idm",
        destination: "http://idmapi.qa.idm.lumsb.com:4444/idm-api/v3/api-docs",
      },
      // 1. Specific API Service Proxies (based on your JSON paths)
      {
        source: "/catalogservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/catalogservice/:path*",
      },
      {
        source: "/subscriptionservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/subscriptionservice/:path*",
      },
      {
        source: "/queryservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/queryservice/:path*",
      },
      {
        source: "/adminservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/adminservice/:path*",
      },
      {
        source: "/registry/:path*",
        destination: "https://billing.qa.sbs.lumsb.com:4443/registry/:path*",
      },
      {
        source: "/cctoolservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/cctoolservice/:path*",
      },
      {
        source: "/provisioningservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/provisioningservice/:path*",
      },
      {
        source: "/listingservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/listingservice/:path*",
      },
      {
        source: "/coordinatorservice/:path*",
        destination:
          "https://billing.qa.sbs.lumsb.com:4443/coordinatorservice/:path*",
      },
      {
        source: "/enablev2api/:path*",
        destination: "https://billing.qa.sbs.lumsb.com:4443/enablev2api/:path*",
      },
    ];
  },
};

export default nextConfig;
