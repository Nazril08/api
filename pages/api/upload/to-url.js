/**
 * @swagger
 * /api/upload/to-url:
 *   post:
 *     tags: [Upload]
 *     summary: Upload a file to Catbox.moe
 *     description: Upload any file to get a direct URL.
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
 *         description: The direct URL to the uploaded file.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       500:
 *         description: Error uploading the file.
 */
import { toUrl } from '../../../lib/to-url.js';
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
      resolve({ buffer, originalFilename: file.originalFilename });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { buffer, originalFilename } = await parseForm(req);
    const url = await toUrl(buffer, originalFilename);

    res.status(200).send(url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An internal error occurred." });
  }
} 