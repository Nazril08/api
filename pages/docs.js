import Head from 'next/head';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const Docs = () => {
  return (
    <>
      <Head>
        <title>Yeyo Rest API - Documentation</title>
        <link rel="stylesheet" href="/css/swagger-material.css" />
      </Head>
      <SwaggerUI url="/api/swagger.json" />
    </>
  );
};

export default Docs; 