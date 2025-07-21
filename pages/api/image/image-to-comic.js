/**
 * @swagger
 * /api/image/image-to-comic:
 *   get:
 *     tags: [Image]
 *     summary: Convert an image to comic style
 *     description: Provide an image URL to convert it into a comic-style image. The response is the generated comic image itself.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the image to convert.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: The generated comic-style image.
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error processing the image.
 */
import { Image2Comic } from '../../../lib/image/image-to-comic.js';
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
    const result = await Image2Comic(url);
    if (!result.hasil) {
      return res.status(500).json({ message: 'Failed to generate comic image.' });
    }
    // Fetch the comic image
    const imageResponse = await axios.get(result.hasil, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
    res.status(200).send(imageResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 