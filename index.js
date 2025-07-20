import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { removeBackgroundMosyne, upscaleMosyne } from './api/image/mosyne/utils.js';

const app = express();
const port = process.env.PORT || 3000;

const serverUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${port}`;

// Inject custom CSS
const customCss = fs.readFileSync(path.resolve(process.cwd(), 'public/css/swagger-material.css'), 'utf8');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Yeyo Rest API',
      version: '1.0.0',
    },
    servers: [{ url: serverUrl }],
    tags: [
        {
            name: 'General',
            description: 'General endpoints'
          },
      {
        name: 'Image',
        description: 'Image processing endpoints'
      },
    ]
  },
  apis: ['./index.js'], // Path to the API docs
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCss: customCss
}));

// Middleware to handle raw body for image processing
app.use('/api/image', (req, res, next) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    req.body = Buffer.concat(chunks);
    next();
  });
});


/**
 * @swagger
 * /:
 *   get:
 *     tags: [General]
 *     summary: Welcome message and API documentation link.
 *     responses:
 *       200:
 *         description: Displays a welcome message and a link to the API docs.
 */
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Yeyo Rest API</h1>
    <p>Use the following endpoints to process your images:</p>
    <ul>
      <li><code>POST /api/image/mosyne/remove-background</code> - Remove background from an image.</li>
      <li><code>POST /api/image/mosyne/upscale</code> - Upscale an image.</li>
    </ul>
    <p>For more detailed information, please visit the <a href="/api/docs">API Documentation</a>.</p>
  `);
});

/**
 * @swagger
 * /api/image/mosyne/remove-background:
 *   post:
 *     tags: [Image]
 *     summary: Remove background from an image
 *     description: Upload an image to remove its background.
 *     requestBody:
 *       required: true
 *       content:
 *         image/*:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Successful response with the URL of the processed image.
 *       500:
 *         description: Error processing the image.
 */
app.post('/api/image/mosyne/remove-background', async (req, res) => {
  try {
    const result = await removeBackgroundMosyne(req.body);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/image/mosyne/upscale:
 *   post:
 *     tags: [Image]
 *     summary: Upscale an image
 *     description: Upload an image to upscale it.
 *     requestBody:
 *       required: true
 *       content:
 *         image/*:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Successful response with the URL of the upscaled image.
 *       500:
 *         description: Error processing the image.
 */
app.post('/api/image/mosyne/upscale', async (req, res) => {
  try {
    const result = await upscaleMosyne(req.body);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the app for Vercel
export default app; 