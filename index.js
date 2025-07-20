import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { removeBackgroundMosyne, upscaleMosyne } from './api/image/mosyne/utils.js';

const app = express();
const port = process.env.PORT || 3000;

const serverUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${port}`;

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
      }
    ]
  },
  apis: ['./index.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Endpoint that serves the swagger.json
app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

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
 *     summary: API Welcome Page
 *     responses:
 *       200:
 *         description: Displays a welcome message and a link to the API docs.
 */
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Yeyo Rest API</h1>
    <p>For API documentation, please visit <a href="/api-docs.html">/api-docs.html</a>.</p>
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
  } catch (error)
 {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the app for Vercel
export default app; 