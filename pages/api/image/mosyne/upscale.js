/**
 * @swagger
 * /api/image/mosyne/upscale:
 *   post:
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
import { upscaleMosyne } from '../../../../lib/mosyne.js';

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
 * /api/image/mosyne/upscale:
 *   post:
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
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const buffer = await streamToBuffer(req);
    const result = await upscaleMosyne(buffer);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 