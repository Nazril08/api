/**
 * @swagger
 * /api/ai-image/animagine-v2:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate an anime-style image using Animagine XL v2
 *     description: Generate an anime-style image from a text prompt and aspect ratio. This version uses polling to retrieve results.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         description: The text prompt to generate the image from.
 *         schema:
 *           type: string
 *       - in: query
 *         name: aspect_ratio
 *         schema:
 *           type: string
 *           enum: ['1:1', '9:7', '7:9', '19:13', '13:19', '7:4', '4:7', '12:5', '5:12']
 *         description: The aspect ratio of the generated image. Defaults to '1:1'.
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
import { animagineV2 } from '../../../lib/ai/animagine-v2.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, aspect_ratio } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageUrl = await animagineV2(prompt, aspect_ratio);

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