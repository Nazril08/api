import { youtubeDownloader } from '../../../lib/download/youtube-v2.js';

/**
 * @swagger
 * /api/download/yt-mp3-v2:
 *   get:
 *     tags: [Download]
 *     summary: Download YouTube Audio as MP3 (v2)
 *     description: Convert a YouTube video to MP3 with the selected quality using the v2 endpoint.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The YouTube video URL.
 *       - in: query
 *         name: quality
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["64k", "128k", "192k", "256k", "320k"]
 *         description: MP3 quality.
 *     responses:
 *       200:
 *         description: MP3 download info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { url, quality } = req.query;

  try {
    if (!url || !quality) {
      return res.status(400).json({ message: 'Parameter url dan quality wajib diisi.' });
    }
    const result = await youtubeDownloader(url, 'audio', quality);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
} 