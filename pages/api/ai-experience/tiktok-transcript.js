/**
 * @swagger
 * /api/ai-experience/tiktok-transcript:
 *   get:
 *     tags:
 *       - AI Experience
 *     summary: Get Transcript from a TikTok Video
 *     description: Retrieves the full text transcript, including timestamps, from a given TikTok video URL.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: The URL of the TikTok video.
 *         schema:
 *           type: string
 *           example: "https://vt.tiktok.com/ZSSd8quKg/"
 *     responses:
 *       '200':
 *         description: Successfully retrieved the transcript.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 result:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "This is the full transcript of the video..."
 *                     duration:
 *                       type: number
 *                       example: 59.9
 *                     language:
 *                       type: string
 *                       example: "en"
 *                     url:
 *                       type: string
 *                       example: "https://vt.tiktok.com/ZSSd8quKg/"
 *                     segments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           start:
 *                             type: number
 *                             example: 0.5
 *                           end:
 *                             type: number
 *                             example: 2.3
 *                           text:
 *                             type: string
 *                             example: "This is a segment."
 *       '400':
 *         description: Bad Request - The URL parameter is missing.
 *       '404':
 *         description: Not Found - No transcript was found for the given URL.
 *       '500':
 *         description: Internal Server Error.
 */
import { TtTranscript } from '../../../lib/ai-experience/tiktok-transcript.js';

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Parameter 'url' is required."
      });
    }

    const result = await TtTranscript(url);
    return res.status(result.code || 500).json(result);

  } catch (error) {
    res.status(500).json({
        status: false,
        code: 500,
        message: error.message
    });
  }
} 