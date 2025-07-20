import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

export default async function handler(req, res) {
  const apiDirectory = path.resolve(process.cwd(), 'pages', 'api');
  const apiFiles = await glob(`${apiDirectory}/**/*.js`);

  let totalEndpoints = 0;
  for (const file of apiFiles) {
      if (file.endsWith('swagger.json.js')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.match(/@swagger/g);
      if (matches) {
          totalEndpoints += matches.length;
      }
  }

  const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Yeyo Rest API',
          version: '1.0.0',
          description: `Total Endpoints: ${totalEndpoints}`,
        },
        servers: [
            {
                url: `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`
            }
        ],
        tags: [
          {
            name: 'Upload',
            description: 'File upload endpoints'
          },
          {
            name: 'AI',
            description: 'Artificial Intelligence endpoints'
          },
          {
            name: 'AI Image',
            description: 'AI Image generation endpoints'
          },
          {
            name: 'Download',
            description: 'File and media downloaders'
          },
          {
            name: 'Voice',
            description: 'Voice conversion endpoints'
          },
          {
            name: 'Video',
            description: 'Video generation endpoints'
          },
          {
            name: 'Utilities',
            description: 'Miscellaneous utility endpoints'
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