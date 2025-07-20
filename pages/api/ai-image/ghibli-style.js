/**
 * @swagger
 * /api/ai-image/ghibli-style:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate a Ghibli-style image
 *     description: Generate an image in the style of Studio Ghibli from a text prompt.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         description: The text prompt to generate the image from.
 *         schema:
 *           type: string
 *       - in: query
 *         name: style
 *         schema:
 *           type: string
 *           enum: ['Spirited Away', "Howl's Castle", 'Princess Mononoke', 'Totoro']
 *         description: The Ghibli movie style to use. Defaults to 'Spirited Away'.
 *     responses:
 *       200:
 *         description: The generated Ghibli-style image.
 *         content:
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error generating the image.
 */
import { GhibliGenerator } from '../../../lib/ghibli-image.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, style } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageBuffer = await GhibliGenerator(prompt, style);

    if (!imageBuffer) {
        return res.status(500).json({ message: 'Failed to generate image, no result returned.' });
    }

    res.setHeader('Content-Type', 'image/webp');
    res.status(200).send(imageBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 