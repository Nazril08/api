/**
 * @swagger
 * /api/ai-image/realistic:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate a realistic AI image
 *     description: Generate a realistic image from a text prompt with style and resolution options.
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
 *           enum: [photorealistic, cinematic, hyperreal, portrait]
 *         description: The style of the generated image. Defaults to 'photorealistic'.
 *       - in: query
 *         name: resolution
 *         schema:
 *           type: string
 *           enum: ['512x512', '768x768', '1024x1024', '1920x1080']
 *         description: The resolution of the generated image. Defaults to '768x768'.
 *       - in: query
 *         name: seed
 *         schema:
 *           type: integer
 *         description: The seed for the image generation. A random seed is used if not provided.
 *     responses:
 *       200:
 *         description: The generated image.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error generating the image.
 */
import { RealisticImage } from '../../../lib/realistic-image.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, style, resolution, seed } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageUrl = await RealisticImage({ 
        prompt, 
        style, 
        resolution, 
        seed: seed ? parseInt(seed) : undefined 
    });

    if (!imageUrl) {
        return res.status(500).json({ message: 'Failed to generate image, no result URL returned.' });
    }

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/png');
    res.status(200).send(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
}
 