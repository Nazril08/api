import { ytMp3 } from '../../../lib/download/yt-mp3.js';

/**
 * @swagger
 * /api/download/yt-mp3:
 *   get:
 *     tags: [Download]
 *     summary: Download YouTube video as MP3
 *     description: Convert a YouTube video to MP3 with the selected quality.
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
 *           enum: ["64", "128", "192", "256", "320"]
 *         description: MP3 quality in kbps.
 *     responses:
 *       200:
 *         description: MP3 download info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 thumbnail:
 *                   type: string
 *                 media:
 *                   type: string
 *                 url:
 *                   type: string
 *                 quality:
 *                   type: string
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
    const result = await ytMp3(url, quality);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
} 