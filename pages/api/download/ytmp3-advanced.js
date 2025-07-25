 
/**
 * @swagger
 * /api/download/ytmp3-advanced:
 *   get:
 *     tags:
 *       - Download
 *     summary: YouTube to MP3 Downloader (Advanced)
 *     description: Downloads audio from a YouTube video as an MP3 file. Supports videos up to 6 hours long.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the YouTube video to download.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with download link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "Video Title"
 *                 download_url:
 *                   type: string
 *                   example: "https://example.com/download.mp3"
 *                 description:
 *                   type: string
 *                   example: "Support for videos up to 6 hours long."
 *       '400':
 *         description: Bad Request - URL parameter is missing.
 *       '500':
 *         description: Internal Server Error.
 */
import { ytmp3mobi } from '../../../lib/download/yt-downloader-advanced.js';

export default async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const result = await ytmp3mobi(url, 'mp3');
    res.status(200).json({
        title: result.title,
        download_url: result.downloadURL,
        description: "Support for videos up to 6 hours long."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 