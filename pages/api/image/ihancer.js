/**
 * @swagger
 * /api/image/ihancer:
 *   post:
 *     tags: [Image]
 *     summary: Enhance an image
 *     description: Upload an image to enhance its quality.
 *     parameters:
 *       - in: query
 *         name: method
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4]
 *         description: The enhancement method to use. Defaults to 1.
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: The desired output size. Defaults to 'low'.
 *     requestBody:
 *       required: true
 *       content:
 *         image/*:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: The processed image as a binary file.
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error processing the image.
 */
import { ihancer } from '../../../lib/image/ihancer.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { method, size } = req.query;
    const buffer = await streamToBuffer(req);
    const enhancedImage = await ihancer(buffer, { 
        method: method ? parseInt(method) : undefined, 
        size 
    });

    res.setHeader('Content-Type', 'image/jpeg');
    res.status(200).send(enhancedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 