import { MusicScope } from '../../../lib/audio/music-scope.js';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/audio/music-scope:
 *   post:
 *     tags: [Audio]
 *     summary: Generate a music video visualization
 *     description: Upload an audio file and an image to generate a music video.
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
 *                 description: The audio file (e.g., mp3).
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The background image for the video (e.g., jpeg).
 *               title:
 *                 type: string
 *                 description: (Optional) The title of the music.
 *               artist:
 *                 type: string
 *                 description: (Optional) The artist of the music.
 *     responses:
 *       200:
 *         description: Successfully generated video URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 video_url:
 *                   type: string
 *                   description: The URL of the generated video.
 *       400:
 *         description: Bad Request, check your input files and parameters.
 *       500:
 *         description: Internal Server Error.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing form data.', error: err.message });
        return reject(err);
      }

      const audioFile = files.audio?.[0];
      const imageFile = files.image?.[0];

      try {
        const title = fields.title?.[0];
        const artist = fields.artist?.[0];

        if (!audioFile || !imageFile) {
          res.status(400).json({ message: 'Audio and image files are required.' });
          return resolve();
        }

        const audioBuffer = fs.readFileSync(audioFile.path);
        const imageBuffer = fs.readFileSync(imageFile.path);

        const musicScope = new MusicScope();
        const videoUrl = await musicScope.process({
          title,
          artist,
          audio: audioBuffer,
          image: imageBuffer,
        });

        if (!videoUrl) {
          throw new Error('Failed to generate video. The processing might have failed on the external service.');
        }

        res.status(200).json({ video_url: videoUrl });
        resolve();
      } catch (error) {
        res.status(500).json({ message: 'An error occurred during processing.', error: error.message });
        resolve(); // Resolve to not leave the request hanging
      } finally {
        // Clean up uploaded temporary files
        if (audioFile) fs.unlinkSync(audioFile.path);
        if (imageFile) fs.unlinkSync(imageFile.path);
      }
    });
  });
} 