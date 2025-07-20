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
import { removeBackgroundMosyne } from '../../../api/image/mosyne/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await removeBackgroundMosyne(req.body);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 