import { aio } from '../../../lib/download/aio.js';

/**
 * @swagger
 * /api/download/aio:
 *   get:
 *     tags: [Download]
 *     summary: All-in-One Downloader
 *     description: Fetches download links for various social media URLs (e.g., Spotify, YouTube, Instagram).
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           format: uri
 *         description: The URL of the content to download.
 *         example: "https://open.spotify.com/track/3rPtS4nfpy7PsARctAWpzd"
 *     responses:
 *       200:
 *         description: Successful response with download links and media details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               # You can add more specific properties here based on expected API response
 *       400:
 *         description: Bad Request, usually due to a missing or invalid URL.
 *       500:
 *         description: Internal Server Error.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { url } = req.query;
    const result = await aio(url);
    res.status(200).json(result);
  } catch (error) {
    const isBadRequest = /url is required/i.test(error.message) || /valid url/i.test(error.message);
    res.status(isBadRequest ? 400 : 500).json({ message: error.message });
  }
} 