/**
 * @swagger
 * /api/ai-image/hitamkan:
 *   get:
 *     tags: [AI Image]
 *     summary: Apply a 'hitamkan' filter to an image
 *     description: Provide an image URL and a filter type to apply a darkening/stylistic filter.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the image to process.
 *         schema:
 *           type: string
 *           format: uri
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [Coklat, Hitam, Nerd, Piggy, Carbon, Botak]
 *         description: The filter to apply. Defaults to 'Hitam'.
 *     responses:
 *       200:
 *         description: The processed image.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error processing the image.
 */
import { hitamkan } from '../../../lib/ai/hitamkan.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { url, filter } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL parameter is required.' });
    }

    const imageBuffer = await hitamkan(url, filter);
    
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(imageBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 