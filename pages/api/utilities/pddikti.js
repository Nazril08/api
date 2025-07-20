/**
 * @swagger
 * /api/utilities/pddikti:
 *   get:
 *     tags: [Utilities]
 *     summary: Search for data on PDDIKTI
 *     description: Search for students, universities, or study programs in the PDDIKTI database.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: The search keyword (e.g., student name, university name).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An object containing the search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error processing the request.
 */
import { searchPddikti } from '../../../lib/utils/pddikti.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required.' });
    }

    const result = await searchPddikti(query);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 