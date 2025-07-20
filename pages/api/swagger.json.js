import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Yeyo Rest API',
        version: '1.0.0',
      },
    },
    apis: ['./pages/api/**/*.js'], // Important: point to the API routes
  };

const spec = swaggerJsdoc(swaggerOptions);

export default function handler(req, res) {
  res.status(200).json(spec);
} 