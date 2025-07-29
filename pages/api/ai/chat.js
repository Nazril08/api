import { chatai, listmodel } from '../../../lib/ai/chatai.js';

/**
 * @swagger
 * /api/ai/chat:
 *   get:
 *     summary: Chat with multiple AI models
 *     tags: [AI]
 *     parameters:
 *       - in: query
 *         name: question
 *         required: true
 *         schema:
 *           type: string
 *         description: The question or prompt for the AI
 *       - in: query
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - gpt-4.1-nano
 *             - gpt-4.1-mini
 *             - gpt-4.1
 *             - o4-mini
 *             - deepseek-r1
 *             - deepseek-v3
 *             - claude-3.7
 *             - gemini-2.0
 *             - grok-3-mini
 *             - qwen-qwq-32b
 *             - gpt-4o
 *             - o3
 *             - gpt-4o-mini
 *             - llama-3.3
 *         description: |
 *           The AI model to use:
 *           - gpt-4.1-nano: GPT-4.1 Nano - Fast and efficient
 *           - gpt-4.1-mini: GPT-4.1 Mini - Balanced performance
 *           - gpt-4.1: GPT-4.1 - Full capability
 *           - o4-mini: O4 Mini - Optimized for speed
 *           - deepseek-r1: DeepSeek R1 - Research focused
 *           - deepseek-v3: DeepSeek V3 - Latest version
 *           - claude-3.7: Claude 3.7 - Advanced reasoning
 *           - gemini-2.0: Gemini 2.0 - Google's latest
 *           - grok-3-mini: Grok 3 Mini - Compact version
 *           - qwen-qwq-32b: Qwen QWQ 32B - Large model
 *           - gpt-4o: GPT-4 Optimized
 *           - o3: O3 - General purpose
 *           - gpt-4o-mini: GPT-4 Optimized Mini
 *           - llama-3.3: LLaMA 3.3 - Meta's latest
 *       - in: query
 *         name: system_prompt
 *         schema:
 *           type: string
 *         description: Optional system prompt to guide the AI's behavior
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Error
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, model, system_prompt } = req.query;

    if (!question) {
      return res.status(400).json({ 
        error: 'Question is required',
        models: listmodel 
      });
    }

    const result = await chatai(question, model, system_prompt);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 