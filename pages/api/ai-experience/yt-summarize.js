import { ytsummarizer } from '../../../lib/ai-experience/yt-summarize.js';

/**
 * @swagger
 * /api/ai-experience/yt-summarize:
 *   get:
 *     summary: YouTube Video Summarizer
 *     description: Generate AI-powered summary of YouTube video content based on subtitles and transcript
 *     tags: [AI Experience]
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           format: uri
 *         description: YouTube video URL (youtube.com or youtu.be)
 *         example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *       - in: query
 *         name: lang
 *         required: false
 *         schema:
 *           type: string
 *           enum: [id, en, es, fr, de, ja, ko, zh, pt, ru, ar, hi]
 *           default: id
 *         description: |
 *           Language for the summary output:
 *           - id: Indonesian (default)
 *           - en: English
 *           - es: Spanish
 *           - fr: French
 *           - de: German
 *           - ja: Japanese
 *           - ko: Korean
 *           - zh: Chinese
 *           - pt: Portuguese
 *           - ru: Russian
 *           - ar: Arabic
 *           - hi: Hindi
 *     responses:
 *       200:
 *         description: Successfully generated video summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Video title
 *                     summary:
 *                       type: string
 *                       description: AI-generated summary
 *                     duration:
 *                       type: string
 *                       description: Video duration
 *                     key_points:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Key points from the video
 *                 message:
 *                   type: string
 *                   example: "YouTube video successfully summarized"
 *       400:
 *         description: Bad request - Invalid URL or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid YouTube URL. Please provide a valid YouTube video URL."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred during summarization"
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`
    });
  }

  try {
    const { url, lang = 'id' } = req.query;

    // Validate required parameters
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'YouTube URL is required'
      });
    }

    // Validate URL format
    if (typeof url !== 'string' || !/youtube\.com|youtu\.be/.test(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube URL. Please provide a valid YouTube video URL.'
      });
    }

    // Validate language parameter
    const supportedLanguages = ['id', 'en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'pt', 'ru', 'ar', 'hi'];
    if (lang && !supportedLanguages.includes(lang)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language. Supported languages: ${supportedLanguages.join(', ')}`
      });
    }

    // Process the summarization
    const result = await ytsummarizer(url, { lang });

    // Return successful response
    return res.status(200).json(result);

  } catch (error) {
    console.error('YouTube Summarize Error:', error.message);
    
    // Handle specific error types
    if (error.message.includes('Invalid YouTube URL')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: error.message
      });
    }

    // General server error
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during summarization'
    });
  }
}
