/**
 * @swagger
 * /api/ai-image/art:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate AI Art
 *     description: Generate an image from a text prompt using AI.
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
 *           enum: [Anime, Realistic]
 *         description: The style of the generated image. Defaults to 'Anime'.
 *       - in: query
 *         name: negativePrompt
 *         schema:
 *           type: string
 *         description: The negative prompt to avoid certain elements in the image.
 *       - in: query
 *         name: scale
 *         schema:
 *           type: number
 *         description: The scale of the generated image. Defaults to 7.
 *     responses:
 *       200:
 *         description: The URL of the generated image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       500:
 *         description: Error generating the image.
 */
import { aiart } from '../../../lib/ai/aiart.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, style, negativePrompt, scale } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageUrl = await aiart(prompt, { 
        style, 
        negativePrompt, 
        scale: scale ? parseFloat(scale) : undefined 
    });

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.status(200).send(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 