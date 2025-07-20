import venicechat from '../../../lib/venice.js';

/**
 * @swagger
 * /api/ai/venice:
 *   get:
 *     summary: Chat with Venice AI
 *     description: Uncensored AI. Venice offers the most advanced, accurate, and uncensored models for a truly unrestricted AI experience
 *     tags: [AI]
 *     parameters:
 *       - in: query
 *         name: question
 *         required: true
 *         description: The question for Venice AI
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question } = req.query;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const result = await venicechat(question);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 