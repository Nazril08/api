/**
 * @swagger
 * /api/download/facebook:
 *   get:
 *     tags: [Download]
 *     summary: Download a video from a Facebook URL
 *     description: Provide a Facebook video URL to get direct download links for SD, HD, and audio versions.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The Facebook video URL to process.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: An object containing direct download links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sd:
 *                   type: string
 *                   nullable: true
 *                 hd:
 *                   type: string
 *                   nullable: true
 *                 audio:
 *                   type: string
 *                   nullable: true
 *       500:
 *         description: Error processing the URL.
 */
import { fbvdl } from '../../../lib/download/facebook.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL parameter is required.' });
    }

    const result = await fbvdl(url);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 