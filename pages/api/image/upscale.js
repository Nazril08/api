/**
 * @swagger
 * /api/image/upscale:
 *   get:
 *     tags: [Image]
 *     summary: Upscale an image
 *     description: Provide an image URL to upscale it to a higher resolution.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the image to upscale.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: The upscaled image.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error upscaling the image.
 */
import { upscale } from '../../../lib/upscale.js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL parameter is required.' });
    }

    const result = await upscale(url);

    const response = await axios.get(result.url, {
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/png');
    res.status(200).send(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 