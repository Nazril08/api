/**
 * @swagger
 * /api/utilities/vcc-generator:
 *   get:
 *     tags: [Utilities]
 *     summary: Generate virtual credit card numbers
 *     description: Generate multiple virtual credit card numbers for testing purposes.
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         description: The type of card to generate.
 *         schema:
 *           type: string
 *           enum: [american-express, mastercard, visa, jcb]
 *       - in: query
 *         name: num
 *         schema:
 *           type: integer
 *         description: The number of cards to generate. Defaults to 10.
 *     responses:
 *       200:
 *         description: An object containing the generated card details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error generating the cards.
 */
import { vccgenerator } from '../../../lib/utils/vcc-generator.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { type, num } = req.query;
    
    if (!type) {
      return res.status(400).json({ message: 'Type parameter is required' });
    }

    const cardDetails = await vccgenerator(type, num ? parseInt(num) : undefined);

    res.status(200).json(cardDetails);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 