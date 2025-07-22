import { searchImageByUrl } from '../../../lib/utilities/search-image.js';

/**
 * @swagger
 * /api/utilities/search-image:
 *   get:
 *     tags: [Utilities]
 *     summary: Search for an image by URL
 *     description: Performs a reverse image search using an image URL and returns a list of matching results.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           format: uri
 *         description: The URL of the image to search for.
 *     responses:
 *       200:
 *         description: An array of search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad Request, URL parameter is missing.
 *       500:
 *         description: Internal Server Error.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { url } = req.query;

  try {
    if (!url) {
      return res.status(400).json({ message: 'Parameter url wajib diisi.' });
    }
    const result = await searchImageByUrl(url);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
} 