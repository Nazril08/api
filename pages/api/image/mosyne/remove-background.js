/**
 * @swagger
 * /api/image/mosyne/remove-background:
 *   post:
 *     tags: [Image]
 *     summary: Remove background from an image
 *     description: Upload an image to remove its background.
 *     parameters:
 *       - in: query
 *         name: output
 *         schema:
 *           type: string
 *           enum: [image, json]
 *         description: The desired output format. Defaults to 'image'.
 *     requestBody:
 *       required: true
 *       content:
 *         image/*:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: The processed image as a binary file (default) or a JSON object with the URL.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: "https://example.com/image.png"
 *       500:
 *         description: Error processing the image.
 */
import { removeBackgroundMosyne } from '../../../../lib/mosyne.js';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * @swagger
 * /api/image/mosyne/remove-background:
 *   post:
 *     summary: Remove background from an image
 *     description: Upload an image to remove its background.
 *     parameters:
 *       - in: query
 *         name: output
 *         schema:
 *           type: string
 *           enum: [image, json]
 *         description: The desired output format. Defaults to 'image'.
 *     requestBody:
 *       required: true
 *       content:
 *         image/*:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: The processed image as a binary file (default) or a JSON object with the URL.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: "https://example.com/image.png"
 *       500:
 *         description: Error processing the image.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { output = 'image' } = req.query;
    const buffer = await streamToBuffer(req);
    const imageUrl = await removeBackgroundMosyne(buffer);

    if (output === 'json') {
      return res.status(200).json({ result: imageUrl });
    }

    // Fetch the resulting image from the URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    // Forward the image data back to the client
    res.setHeader('Content-Type', imageResponse.headers['content-type']);
    res.status(200).send(imageResponse.data);
  } catch (error) {
    console.error(error); // Log the full error on the server for debugging
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 