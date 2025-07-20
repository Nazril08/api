/**
 * @swagger
 * /api/utilities/track-shipping:
 *   get:
 *     tags: [Utilities]
 *     summary: Track a shipping package
 *     description: Track a package using its tracking number (resi) and courier name.
 *     parameters:
 *       - in: query
 *         name: resi
 *         required: true
 *         description: The tracking number of the package.
 *         schema:
 *           type: string
 *       - in: query
 *         name: courier
 *         required: true
 *         description: The name of the courier (e.g., JNE, TIKI, SiCepat).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An object containing the tracking details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing parameters.
 *       404:
 *         description: Courier not found.
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
    const { resi, courier } = req.query;

    if (!resi || !courier) {
        return res.status(400).json({ message: 'Both "resi" and "courier" parameters are required.' });
    }

    const result = await loman.track(resi, courier);
    res.status(result.code).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, code: 500, result: { error: error.message || "An internal error occurred." } });
  }
} 