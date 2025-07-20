import swaggerJsdoc from 'swagger-jsdoc';

export default function handler(req, res) {
  const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Yeyo Rest API',
          version: '1.0.0',
        },
        servers: [
            {
                // Infer server URL from request headers
                url: `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`
            }
        ]
      },
      apis: ['./pages/api/**/*.js'],
    };

  const spec = swaggerJsdoc(swaggerOptions);
  res.status(200).json(spec);
} 