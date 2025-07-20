/**
 * @swagger
 * /api/download/snappin:
 *   get:
 *     tags: [Download]
 *     summary: Download media from a Pinterest URL
 *     description: Provide a Pinterest URL to get direct download links for the media (image or video).
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The Pinterest URL to process.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: An object containing the media details and direct download links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 thumb:
 *                   type: string
 *                 video:
 *                   type: string
 *                   nullable: true
 *                 image:
 *                   type: string
 *                   nullable: true
 *       500:
 *         description: Error processing the URL.
 */
import { snappinDownload } from '../../../lib/snappin.js';

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

    const result = await snappinDownload(url);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 