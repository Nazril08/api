/**
 * @swagger
 * /api/ai-image/ai4chat:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate an image using AI4Chat
 *     description: Generate an image from a text prompt.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         description: The text prompt to generate the image from.
 *         schema:
 *           type: string
 *       - in: query
 *         name: ratio
 *         schema:
 *           type: string
 *           enum: ['1:1', '16:9', '2:3', '3:2', '4:5', '5:4', '9:16', '21:9', '9:21']
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
import { ai4chat } from '../../../lib/ai4chat.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, ratio } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageUrl = await ai4chat(prompt, ratio);

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