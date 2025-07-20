/**
 * @swagger
 * /api/voice/rvc:
 *   get:
 *     tags: [Voice]
 *     summary: Convert voice using RVC models from a URL
 *     description: Provide a URL to an audio file to convert its voice using various HoloID RVC models.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the audio file to process.
 *         schema:
 *           type: string
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *           enum: [moona, lofi, risu, ollie, anya, reine, zeta, kaela, kobo]
 *         description: The RVC model to use for voice conversion. Defaults to 'moona'.
 *       - in: query
 *         name: transpose
 *         schema:
 *           type: integer
 *         description: The transpose value for the voice conversion. Defaults to 0.
 *     responses:
 *       200:
 *         description: The converted audio file.
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error processing the audio.
 */
import { RVCHoloID } from '../../../lib/voice/rvc.js';
import axios from 'axios';

const rvc = new RVCHoloID();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { url, model, transpose } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL parameter is required' });
    }

    const audioUrl = await rvc.process(url, {
        model,
        transpose: transpose ? parseInt(transpose) : undefined
    });
    
    if (!audioUrl) {
        return res.status(500).json({ message: 'Failed to process audio, no result URL returned.' });
    }

    const response = await axios.get(audioUrl, {
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 