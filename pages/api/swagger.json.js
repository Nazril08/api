import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

export default function handler(req, res) {
  // Get the absolute path to the pages/api directory
  const apiDirectory = path.resolve(process.cwd(), 'pages', 'api');

  const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Yeyo Rest API',
          version: '1.0.0',
        },
        servers: [
            {
                url: `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`
            }
        ],
        tags: [
          {
            name: 'AI',
            description: 'Artificial Intelligence endpoints'
          },
          {
            name: 'Download',
            description: 'File and media downloaders'
          },
          {
            name: 'Image',
            description: 'Image processing endpoints'
          },
          
          {
            name: 'TTS',
            description: 'Text-to-Speech endpoints'
          }
        ]
      },
      // Use the absolute path for the glob pattern
      apis: [`${apiDirectory}/**/*.js`],
    };

  const spec = swaggerJsdoc(swaggerOptions);
  res.status(200).json(spec);
} 