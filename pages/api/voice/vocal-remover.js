/**
 * @swagger
 * /api/voice/vocal-remover:
 *   get:
 *     tags: [Voice]
 *     summary: Remove vocals from a song
 *     description: Provide a URL to an audio file to separate the vocals from the instrumental.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the audio file to process.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: An object containing the URLs for the vocal and instrumental tracks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vocal:
 *                   type: string
 *                 instrumental:
 *                   type: string
 *       500:
 *         description: Error processing the audio.
 */
import { vocalRemover } from '../../../lib/vocal-remover.js';

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

    const result = await vocalRemover(url);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 