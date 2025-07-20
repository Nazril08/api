/**
 * @swagger
 * /api/ai-image/deepimg:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate an image using Deepimg
 *     description: Generate an image from a text prompt with style and size options.
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
 *           enum: [default, ghibli, cyberpunk, anime, portrait, chibi, 'pixel art', 'oil painting', '3d']
 *         description: The style of the generated image. Defaults to 'default'.
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: ['1:1', '3:2', '2:3']
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
import { deepimg } from '../../../lib/deepimg.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, style, size } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageUrl = await deepimg(prompt, { style, size });

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