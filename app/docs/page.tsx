import SwaggerDocs from '../component/swaggerUI';

const DocsPage = () => {
  return (
    <SwaggerDocs url="/api/proxy/openapi.json" />
  );
};

export default DocsPage;