/**
 * @swagger
 * /api/download/threads:
 *   get:
 *     tags: [Download]
 *     summary: Download media from a Threads URL
 *     description: Provide a Threads post URL to get direct download links for videos and images.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The Threads post URL to process.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: An object containing arrays of video and image URLs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 videos:
 *                   type: array
 *                   items:
 *                     type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error processing the URL.
 */
import { downloadFromThreads } from '../../../lib/download/threads.js';

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

    const result = await downloadFromThreads(url);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 