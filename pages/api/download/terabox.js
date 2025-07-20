/**
 * @swagger
 * /api/download/terabox:
 *   get:
 *     tags: [Download]
 *     summary: Get a direct download link from a Terabox URL
 *     description: Provide a Terabox file URL to get a direct download link and file details.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The Terabox URL to process.
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: An object containing the file details and direct download link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file_name:
 *                   type: string
 *                 size:
 *                   type: string
 *                 size_bytes:
 *                   type: number
 *                 direct_link:
 *                   type: string
 *                 thumb:
 *                   type: string
 *       500:
 *         description: Error processing the URL.
 */
import { Terabox } from '../../../lib/terabox.js';

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

    const result = await Terabox(url);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 