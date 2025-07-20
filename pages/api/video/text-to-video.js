/**
 * @swagger
 * /api/video/text-to-video:
 *   get:
 *     tags: [Video]
 *     summary: Generate a video from text
 *     description: Generate a short video based on a text prompt.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         description: The text prompt to generate the video from.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A JSON object containing the URL of the generated video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://example.com/video.mp4"
 *       500:
 *         description: Error generating the video.
 */
import { txt2video } from '../../../lib/txt2video.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const videoUrl = await txt2video(prompt);

    if (!videoUrl) {
        return res.status(500).json({ message: 'Failed to generate video, no result URL returned.' });
    }

    res.status(200).json({ url: videoUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 