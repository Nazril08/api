/**
 * @swagger
 * /api/ai-image/ai-freebox:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate an image using AIFreebox
 *     description: Generate an image from a text prompt with different models (slugs) and aspect ratios.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         description: The text prompt to generate the image from.
 *         schema:
 *           type: string
 *       - in: query
 *         name: aspectRatio
 *         schema:
 *           type: string
 *           enum: ['1:1', '2:3', '9:16', '16:9']
 *         description: The aspect ratio of the generated image. Defaults to '16:9'.
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *           enum: [ai-art-generator, ai-fantasy-map-creator, ai-youtube-thumbnail-generator, ai-old-cartoon-characters-generator]
 *         description: The model/generator to use. Defaults to 'ai-art-generator'.
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
import { AIFreeboxImage } from '../../../lib/ai/ai-freebox.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, aspectRatio, slug } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageUrl = await AIFreeboxImage(prompt, aspectRatio, slug);

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