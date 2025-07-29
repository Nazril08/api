import { generateMusic } from '../../../lib/audio/sonu.js';

/**
 * @swagger
 * /api/audio/sonu:
 *   post:
 *     summary: Generate music using Sonu Music AI
 *     tags: [Audio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - lyrics
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the song
 *               lyrics:
 *                 type: string
 *                 description: The lyrics of the song (max 1500 characters)
 *               mood:
 *                 type: string
 *                 description: The mood of the song (optional)
 *               genre:
 *                 type: string
 *                 description: The genre of the song (optional)
 *               gender:
 *                 type: string
 *                 description: The gender of the vocalist (optional)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the generated music
 *                 name:
 *                   type: string
 *                   description: Name of the song
 *                 status:
 *                   type: string
 *                   description: Status of the generation
 *                 thumbnail_url:
 *                   type: string
 *                   description: URL of the song thumbnail
 *       400:
 *         description: Bad request
 *       500:
 *         description: Error
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, lyrics, mood, genre, gender } = req.body;

    if (!title || !lyrics) {
      return res.status(400).json({ 
        error: 'Title and lyrics are required' 
      });
    }

    if (lyrics.length > 1500) {
      return res.status(400).json({ 
        error: 'Lyrics cannot exceed 1500 characters' 
      });
    }

    const result = await generateMusic(title, lyrics, mood, genre, gender);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 