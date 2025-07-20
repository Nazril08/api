/**
 * @swagger
 * /api/image/remove-background:
 *   post:
 *     tags: [Image]
 *     summary: Remove the background from an image
 *     description: Upload an image to remove its background.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The image with the background removed.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error processing the image.
 */
import { removeBackground } from '../../../lib/image/remove-background.js';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      if (!files.file || files.file.length === 0) {
        return reject(new Error('No file uploaded.'));
      }
      const file = files.file[0];
      const buffer = fs.readFileSync(file.path);
      resolve(buffer);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const buffer = await parseForm(req);
    const resultBuffer = await removeBackground(buffer);

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(resultBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 