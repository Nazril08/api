/**
 * @swagger
 * /api/utilities/search-location:
 *   get:
 *     tags: [Utilities]
 *     summary: Search for a location
 *     description: Search for a location (city, district) to get its ID for shipping calculations.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: The name of the location to search for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An object containing a list of matching locations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing query.
 *       404:
 *         description: Location not found.
 *       500:
 *         description: Error processing the request.
 */
import { loman } from '../../../lib/utils/loman.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: '"query" parameter is required.' });
    }

    const result = await loman.searchLocation(query);
    res.status(result.code).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, code: 500, result: { error: error.message || "An internal error occurred." } });
  }
} 