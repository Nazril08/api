import { upscaler4K } from '../../../lib/image/upscaler4k.js';

/**
 * @swagger
 * /api/image/upscale-4k:
 *   get:
 *     summary: Upscale an image to 4K
 *     tags: [Image]
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: The URL of the image to upscale.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       500:
 *         description: Error
 */
export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    const result = await upscaler4K(url);
    res.status(200).json({ url: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 