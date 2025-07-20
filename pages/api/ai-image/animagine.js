/**
 * @swagger
 * /api/ai-image/animagine:
 *   get:
 *     tags: [AI Image]
 *     summary: Generate an image using Animagine XL
 *     description: Generate an image from a text prompt with advanced customization options.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         description: The text prompt to generate the image from.
 *         schema:
 *           type: string
 *       - in: query
 *         name: negative_prompt
 *         schema:
 *           type: string
 *         description: The negative prompt to avoid certain elements.
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *         description: The width of the image. Defaults to 1024.
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *         description: The height of the image. Defaults to 1024.
 *       - in: query
 *         name: guidance_scale
 *         schema:
 *           type: number
 *         description: The guidance scale. Defaults to 5.
 *       - in: query
 *         name: numInference_steps
 *         schema:
 *           type: integer
 *         description: The number of inference steps. Defaults to 28.
 *       - in: query
 *         name: sampler
 *         schema:
 *           type: string
 *           enum: ['DPM++ 2M Karras', 'DPM++ SDE Karras', 'DPM++ 2M SDE Karras', 'Euler', 'Euler a', 'DDIM']
 *         description: The sampler to use. Defaults to 'Euler a'.
 *       - in: query
 *         name: aspect_ratio
 *         schema:
 *           type: string
 *           enum: ['1:1', '9:7', '7:9', '19:13', '13:19', '7:4', '4:7', '12:5', '5:12']
 *         description: The aspect ratio. Defaults to '1:1'.
 *       - in: query
 *         name: style_preset
 *         schema:
 *           type: string
 *           enum: ['(None)', 'Anim4gine', 'Painting', 'Pixel art', '1980s', '1990s', '2000s', 'Toon', 'Lineart', 'Art Nouveau', 'Western Comics', '3D', 'Realistic', 'Neonpunk']
 *         description: The style preset. Defaults to '(None)'.
 *       - in: query
 *         name: use_upscaler
 *         schema:
 *           type: boolean
 *         description: Whether to use the upscaler. Defaults to false.
 *       - in: query
 *         name: strength
 *         schema:
 *           type: number
 *         description: The strength of the upscaler. Defaults to 0.55.
 *       - in: query
 *         name: upscale_by
 *         schema:
 *           type: number
 *         description: The factor to upscale by. Defaults to 1.5.
 *       - in: query
 *         name: add_quality_tags
 *         schema:
 *           type: boolean
 *         description: Whether to add quality tags. Defaults to true.
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
import { animagine } from '../../../lib/ai/animagine.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, negative_prompt, width, height, guidance_scale, numInference_steps, sampler, aspect_ratio, style_preset, use_upscaler, strength, upscale_by, add_quality_tags } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const imageUrl = await animagine(prompt, {
        negative_prompt,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        guidance_scale: guidance_scale ? parseFloat(guidance_scale) : undefined,
        numInference_steps: numInference_steps ? parseInt(numInference_steps) : undefined,
        sampler,
        aspect_ratio,
        style_preset,
        use_upscaler: use_upscaler ? (use_upscaler === 'true') : undefined,
        strength: strength ? parseFloat(strength) : undefined,
        upscale_by: upscale_by ? parseFloat(upscale_by) : undefined,
        add_quality_tags: add_quality_tags ? (add_quality_tags === 'true') : undefined
    });

    if (!imageUrl) {
        return res.status(500).json({ message: 'Failed to generate image, no result URL returned.' });
    }

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