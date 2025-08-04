import { BgBye } from '../../../lib/image/bgbye.js';
import multiparty from 'multiparty';

/**
 * @swagger
 * /api/video/remove-background:
 *   post:
 *     summary: Remove Background from Videos
 *     description: Remove background from video files using AI technology with multiple method options
 *     tags: [Video]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file to remove background from (MP4, AVI, MOV, WebM, etc.)
 *               method:
 *                 type: string
 *                 enum: [bria, inspyrenet, u2net, tracer, basnet, deeplab, u2net_human_seg, ormbg, isnet-general-use, isnet-anime]
 *                 default: bria
 *                 description: |
 *                   Background removal method:
 *                   - bria: High-quality general purpose (recommended)
 *                   - inspyrenet: Good for detailed objects
 *                   - u2net: Fast and reliable
 *                   - tracer: Good for portraits
 *                   - basnet: Boundary-aware
 *                   - deeplab: Semantic segmentation
 *                   - u2net_human_seg: Optimized for humans
 *                   - ormbg: Object removal
 *                   - isnet-general-use: General purpose
 *                   - isnet-anime: Optimized for anime/cartoon
 *             required:
 *               - video
 *     responses:
 *       200:
 *         description: Background successfully removed from video
 *         content:
 *           video/webm:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Video with transparent background
 *       400:
 *         description: Bad request - Invalid file or parameters
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
 *                   example: "Invalid video format. Please provide a valid video file."
 *       408:
 *         description: Processing timeout
 *       413:
 *         description: File too large
 *       500:
 *         description: Internal server error
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            success: false,
            error: `Method ${req.method} Not Allowed`
        });
    }

    try {
        const bgBye = new BgBye();
        
        // Parse multipart form data
        const form = new multiparty.Form({
            maxFilesSize: 200 * 1024 * 1024, // 200MB max file size for videos
        });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        // Validate video file
        if (!files.video || !files.video[0]) {
            return res.status(400).json({
                success: false,
                error: 'Video file is required'
            });
        }

        const videoFile = files.video[0];
        const method = fields.method ? fields.method[0] : 'bria';

        // Validate method
        const availableMethods = bgBye.getMethods();
        if (!availableMethods.includes(method)) {
            return res.status(400).json({
                success: false,
                error: `Invalid method. Available methods: ${availableMethods.join(', ')}`
            });
        }

        // Read file buffer
        const fs = await import('fs');
        const videoBuffer = fs.readFileSync(videoFile.path);

        // Clean up temp file
        fs.unlinkSync(videoFile.path);

        // Validate file size (additional check)
        if (videoBuffer.length > 200 * 1024 * 1024) {
            return res.status(413).json({
                success: false,
                error: 'Video file too large. Maximum size is 200MB.'
            });
        }

        // Set timeout headers to inform client about expected processing time
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Process video (this may take a while)
        const result = await bgBye.removeVideoBackground(videoBuffer, { method });

        // Set response headers for video
        res.setHeader('Content-Type', 'video/webm');
        res.setHeader('Content-Disposition', 'attachment; filename="background-removed.webm"');
        res.setHeader('X-Processing-Method', method);
        res.setHeader('X-Video-ID', result.video_id);
        res.setHeader('X-Success', 'true');

        // Send the processed video
        return res.status(200).send(Buffer.from(result.data));

    } catch (error) {
        console.error('Video Background Removal Error:', error.message);

        // Handle specific error types
        if (error.message.includes('timeout')) {
            return res.status(408).json({
                success: false,
                error: 'Video processing timeout. Please try with a shorter video or try again later.',
                suggestion: 'For best results, use videos under 30 seconds and ensure good internet connection.'
            });
        }

        if (error.message.includes('Invalid video format')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        if (error.message.includes('too large')) {
            return res.status(413).json({
                success: false,
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            error: error.message || 'An unexpected error occurred during video background removal'
        });
    }
}
