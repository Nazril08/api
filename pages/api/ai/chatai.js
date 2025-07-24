// Lokasi file: [API_PROJECT]/pages/api/ai/chatai.js

import { chatai } from '../../../lib/ai/chatai.js'; // Pastikan path ini benar di dalam proyek API Anda

/**
 * @swagger
 * /api/ai/chatai:
 *   post:
 *     tags: [AI]
 *     summary: Chat with an AI model
 *     description: Send a question to a specified AI model and get a response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question for the AI.
 *               model:
 *                 type: string
 *                 enum: ['gpt-4.1-nano', 'gpt-4.1-mini', 'gpt-4.1', 'o4-mini', 'deepseek-r1', 'deepseek-v3', 'claude-3.7', 'gemini-2.0', 'grok-3-mini', 'qwen-qwq-32b', 'gpt-4o', 'o3', 'gpt-4o-mini', 'llama-3.3']
 *                 description: (Optional) The AI model to use.
 *               system_prompt:
 *                 type: string
 *                 description: (Optional) A system prompt to guide the AI's behavior.
 *             required:
 *               - question
 *     responses:
 *       200:
 *         description: Successful response from the AI.
 *       400:
 *         description: Bad Request.
 *       500:
 *         description: Internal Server Error.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // For POST requests, data is typically in the request body.
    const { question, system_prompt, model } = req.body;
    
    // Call the chatai function with the correct parameters
    const result = await chatai(question, { system_prompt, model });
    
    return res.status(200).json(result);

  } catch (error) {
    const isBadRequest = /question is required/i.test(error.message) || /available models/i.test(error.message);
    
    return res.status(isBadRequest ? 400 : 500).json({ message: error.message });
  }
}