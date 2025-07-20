/**
 * @swagger
 * /api/download/spotify:
 *   get:
 *     tags: [Download]
 *     summary: Download a song from a Spotify URL
 *     description: Provide a Spotify track URL to get a direct download link and song details.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The Spotify track URL to process.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: An object containing the song details and direct download link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 artist:
 *                   type: string
 *                 title:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 image:
 *                   type: string
 *                 download:
 *                   type: string
 *       500:
 *         description: Error processing the URL.
 */
import { spotifyDownload } from '../../../lib/spotify.js';

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

    const result = await spotifyDownload(url);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 