import { summarizeYoutubeVideo } from '../../../lib/ai-experience/yt-summarize.js';

/**
 * @swagger
 * /api/ai-experience/yt-summarize:
 *   get:
 *     tags: [AI Experience]
 *     summary: Summarize a YouTube video
 *     description: Provide a YouTube video URL to get a summary of its content.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL of the YouTube video to summarize.
 *     responses:
 *       200:
 *         description: Successful summary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: The summarized text of the video.
 *       400:
 *         description: Bad Request, usually due to a missing or invalid URL.
 *       500:
 *         description: Internal Server Error.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'YouTube URL is required' });
    }

    const result = await summarizeYoutubeVideo(url);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'An unexpected error occurred' });
  }
} 