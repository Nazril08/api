import tiktok from "../../../lib/download/tiktok.js";

/**
 * @swagger
 * /api/download/tiktok:
 *   get:
 *     tags: [Download]
 *     summary: TikTok Downloader
 *     description: Fetches download links and media details for a given TikTok URL.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           format: uri
 *         description: The URL of the TikTok video.
 *         example: "https://vt.tiktok.com/ZSBhtXeVr/"
 *     responses:
 *       200:
 *         description: Successful response with download links and media details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               # Specific properties can be detailed here based on expected API response
 *       400:
 *         description: Bad Request, usually due to a missing or invalid TikTok URL.
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
    const result = await tiktok(url);
    res.status(200).json(result);
  } catch (error) {
    const isBadRequest = /invalid url/i.test(error.message) || /valid tiktok url/i.test(error.message);
    res.status(isBadRequest ? 400 : 500).json({ message: error.message });
  }
} 