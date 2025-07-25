 
/**
 * @swagger
 * /api/download/ytmp4-advanced:
 *   get:
 *     tags:
 *       - Download
 *     summary: YouTube to MP4 Downloader (Advanced)
 *     description: Downloads a YouTube video as an MP4 file. Supports videos up to 6 hours long.
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
 *                   example: "https://example.com/download.mp4"
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

    const result = await ytmp3mobi(url, 'mp4');
    res.status(200).json({
        title: result.title,
        download_url: result.downloadURL,
        description: "Support for videos up to 6 hours long."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 