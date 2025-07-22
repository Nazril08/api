import { genshinRvc, characters } from '../../../lib/tts/genshin-impact.js';
import multiparty from 'multiparty';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/tts/genshin-impact:
 *   get:
 *     tags: [TTS]
 *     summary: Genshin Impact Text-to-Speech
 *     description: >
 *       Generates audio from text using a Genshin Impact character's voice.
 *       **Max 200 characters.**
 *     parameters:
 *       - in: query
 *         name: char
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["lumine", "paimon", "venti", "eula", "mona", "hutao", "ayaka", "yae", "raiden", "kuki", "nahida", "nilou", "furina", "navia", "aether", "diluc", "xiao", "zhongli", "kazuha", "wanderer", "kaveh", "neuvillette", "wriothesley"]
 *         description: The character to use for a voice.
 *       - in: query
 *         name: text
 *         required: true
 *         schema:
 *           type: string
 *           maxLength: 200
 *         description: The text to convert to speech (max 200 characters).
 *     responses:
 *       200:
 *         description: The generated audio file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: The URL of the generated audio file.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *   post:
 *     tags: [TTS]
 *     summary: Genshin Impact Voice Changer (RVC)
 *     description: >
 *       Converts your voice audio to a Genshin Impact character's voice.
 *       **Max 20 seconds (recommended under 15 seconds).**
 *     parameters:
 *       - in: query
 *         name: char
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["lumine", "paimon", "venti", "eula", "mona", "hutao", "ayaka", "yae", "raiden", "kuki", "nahida", "nilou", "furina", "navia", "aether", "diluc", "xiao", "zhongli", "kazuha", "wanderer", "kaveh", "neuvillette", "wriothesley"]
 *         description: The target character's voice.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: The audio file to process (max 20s).
 *     responses:
 *       200:
 *         description: The converted audio file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: The URL of the converted audio file.
 *       400:
 *         description: Bad Request, no audio file uploaded or invalid character.
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Handle Text-to-Speech
    try {
      const { char, text } = req.query;
      if (!char || !text) {
        return res.status(400).json({ message: 'Parameters "char" and "text" are required.' });
      }
      if (text.length > 200) {
        return res.status(400).json({ message: 'Text cannot exceed 200 characters.' });
      }

      const result = await genshinRvc({ character: char, text, useTTS: true });
      res.status(200).json({ url: result.url });

    } catch (error) {
      res.status(500).json({ message: error.message || 'An internal error occurred.' });
    }

  } else if (req.method === 'POST') {
    // Handle Voice Changer
    await new Promise((resolve) => {
      const form = new multiparty.Form();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ message: 'Error parsing form data.' });
          return resolve();
        }

        const audioFile = files.audio?.[0];
        const character = req.query.char;

        if (!audioFile || !character) {
          res.status(400).json({ message: 'Audio file and "char" query parameter are required.' });
          return resolve();
        }
        
        try {
          const audioBuffer = fs.readFileSync(audioFile.path);
          const result = await genshinRvc({ character, audio_buffer: audioBuffer, useTTS: false });
          res.status(200).json({ url: result.url });
        } catch (error) {
          res.status(500).json({ message: error.message || 'An error occurred during processing.' });
        } finally {
          if (audioFile) fs.unlinkSync(audioFile.path);
          resolve();
        }
      });
    });

  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 