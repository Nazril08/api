import { chatai } from '../../../lib/chatai.js';

/**
 * @swagger
 * /api/ai/chatai:
 *   post:
 *     tags: [AI]
 *     summary: Chat with an AI model
 *     description: Send a question to a specified AI model via query parameters and get a response.
 *     parameters:
 *       - in: query
 *         name: question
 *         required: true
 *         schema:
 *           type: string
 *         description: The question for the AI.
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *           enum: ['gpt-4.1-nano', 'gpt-4.1-mini', 'gpt-4.1', 'o4-mini', 'deepseek-r1', 'deepseek-v3', 'claude-3.7', 'gemini-2.0', 'grok-3-mini', 'qwen-qwq-32b', 'gpt-4o', 'o3', 'gpt-4o-mini', 'llama-3.3']
 *         description: (Optional) The AI model to use.
 *       - in: query
 *         name: system_prompt
 *         schema:
 *           type: string
 *         description: (Optional) A system prompt to guide the AI's behavior.
 *     responses:
 *       200:
 *         description: Successful response from the AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 think:
 *                   type: string
 *                   description: The 'thinking' part of the AI's response, if any.
 *                 response:
 *                   type: string
 *                   description: The main response from the AI.
 *       400:
 *         description: Bad Request, usually due to a missing question or invalid model.
 *       500:
 *         description: Internal Server Error.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Parameters are now taken exclusively from the query string
    const { question, system_prompt, model } = req.query;

    const result = await chatai(question, { system_prompt, model });
    res.status(200).json(result);
  } catch (error) {
    // Determine status code based on error message
    const isBadRequest = /question is required/i.test(error.message) || /available models/i.test(error.message);
    res.status(isBadRequest ? 400 : 500).json({ message: error.message });
  }
} 