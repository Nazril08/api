import { BgBye } from '../../../lib/image/bgbye.js';
import multiparty from 'multiparty';

/**
 * @swagger
 * /api/image/remove-background-advanced:
 *   post:
 *     summary: Advanced Background Removal for Images
 *     description: Remove background from images using advanced AI models with multiple method options
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to remove background from (JPEG, PNG, WebP, etc.)
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
 *               - image
 *     responses:
 *       200:
 *         description: Background successfully removed
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Image with transparent background
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
 *                   example: "Invalid image format. Please provide a valid image file."
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
            maxFilesSize: 50 * 1024 * 1024, // 50MB max file size
        });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        // Validate image file
        if (!files.image || !files.image[0]) {
            return res.status(400).json({
                success: false,
                error: 'Image file is required'
            });
        }

        const imageFile = files.image[0];
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
        const imageBuffer = fs.readFileSync(imageFile.path);

        // Clean up temp file
        fs.unlinkSync(imageFile.path);

        // Process image
        const result = await bgBye.removeImageBackground(imageBuffer, { method });

        // Set response headers for image
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="background-removed.png"');
        res.setHeader('X-Processing-Method', method);
        res.setHeader('X-Success', 'true');

        // Send the processed image
        return res.status(200).send(Buffer.from(result.data));

    } catch (error) {
        console.error('Background Removal Error:', error.message);

        // Handle specific error types
        if (error.message.includes('timeout')) {
            return res.status(408).json({
                success: false,
                error: 'Processing timeout. Please try with a smaller image or try again later.'
            });
        }

        if (error.message.includes('Invalid image format')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            error: error.message || 'An unexpected error occurred during background removal'
        });
    }
}
