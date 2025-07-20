/**
 * @swagger
 * /api/utilities/calculate-shipping:
 *   get:
 *     tags: [Utilities]
 *     summary: Calculate shipping costs
 *     description: Calculate the shipping cost between two cities for a given weight.
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         description: The origin city.
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         required: true
 *         description: The destination city.
 *         schema:
 *           type: string
 *       - in: query
 *         name: weight
 *         required: true
 *         description: The weight of the package in kilograms.
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: An object containing the shipping cost details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing parameters.
 *       404:
 *         description: City not found.
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
    const { from, to, weight } = req.query;

    if (!from || !to || !weight) {
        return res.status(400).json({ message: '"from", "to", and "weight" parameters are required.' });
    }

    const result = await loman.calculateShippingByCity(from, to, weight);
    res.status(result.code).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, code: 500, result: { error: error.message || "An internal error occurred." } });
  }
} 