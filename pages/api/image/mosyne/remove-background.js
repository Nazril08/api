/**
 * @swagger
 * /api/image/mosyne/remove-background:
 *   post:
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
import { removeBackgroundMosyne } from '../../../../lib/mosyne.js';

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
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const buffer = await streamToBuffer(req);
    const result = await removeBackgroundMosyne(buffer);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error); // Log the full error on the server for debugging
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 