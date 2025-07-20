/**
 * @swagger
 * /api/voice/transcribe:
 *   get:
 *     tags: [Voice]
 *     summary: Transcribe an audio file from a URL
 *     description: Provide a URL to an audio file to transcribe it into text.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the audio file to transcribe.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: The transcribed text.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transcription:
 *                   type: string
 *       400:
 *         description: Bad request, e.g., no URL provided.
 *       500:
 *         description: Error processing the audio.
 */
import { transcribe } from '../../../lib/transcribe.js';

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

    const transcription = await transcribe(url);

    res.status(200).json({ transcription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 