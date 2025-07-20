import { ttstokoh } from "../../../lib/tts/ttstokoh.js";

/**
 * @swagger
 * /api/tts/tokoh:
 *   get:
 *     tags: [TTS]
 *     summary: Generate a URL for a Text-to-Speech audio file.
 *     description: Creates an audio file from text, spoken in the voice of a selected Indonesian public figure, and returns the URL to the audio.
 *     parameters:
 *       - in: query
 *         name: text
 *         required: true
 *         schema:
 *           type: string
 *         description: The text to be converted to speech.
 *         example: "halo, apa kabar semua?"
 *       - in: query
 *         name: tokoh
 *         schema:
 *           type: string
 *           enum: [jokowi, megawati, prabowo]
 *           default: jokowi
 *         description: The public figure's voice to use.
 *     responses:
 *       200:
 *         description: A JSON object containing the URL to the generated audio file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 audio_url:
 *                   type: string
 *                   format: uri
 *                   example: "https://.../audio.mp3"
 *       400:
 *         description: Bad Request, usually due to missing text or an invalid 'tokoh'.
 *       500:
 *         description: Internal Server Error.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { text, tokoh } = req.query;
    const audioUrl = await ttstokoh(text, tokoh);

    if (!audioUrl) {
      throw new Error("Could not retrieve audio URL from the service.");
    }

    res.status(200).json({ audio_url: audioUrl });

  } catch (error) {
    const isBadRequest = /text is required/i.test(error.message) || /available tokoh/i.test(error.message);
    res.status(isBadRequest ? 400 : 500).json({ message: error.message });
  }
} 