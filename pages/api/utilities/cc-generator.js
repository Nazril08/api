/**
 * @swagger
 * /api/utilities/cc-generator:
 *   get:
 *     tags: [Utilities]
 *     summary: Generate a fake credit card number
 *     description: Generate a fake credit card number for testing purposes.
 *     parameters:
 *       - in: query
 *         name: bin
 *         required: true
 *         description: The type of card to generate.
 *         schema:
 *           type: string
 *           enum: [Visa, MasterCard, Amex, CUP, JCB, Diners, RuPay]
 *     responses:
 *       200:
 *         description: An object containing the generated card details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cardNumber:
 *                   type: string
 *                 expirationDate:
 *                   type: string
 *                 name:
 *                   type: string
 *                 cvv:
 *                   type: string
 *       500:
 *         description: Error generating the card.
 */
import { ccgenerator } from '../../../lib/cc-generator.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { bin } = req.query;
    
    if (!bin) {
      return res.status(400).json({ message: 'BIN parameter is required' });
    }

    const cardDetails = await ccgenerator(bin);

    res.status(200).json(cardDetails);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 