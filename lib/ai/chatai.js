import axios from 'axios';

//untuk list model ai yang ada
const listmodel = [
  'gpt-4.1-nano',
  'gpt-4.1-mini',
  'gpt-4.1',
  'o4-mini',
  'deepseek-r1',
  'deepseek-v3',
  'claude-3.7',
  'gemini-2.0',
  'grok-3-mini',
  'qwen-qwq-32b',
  'gpt-4o',
  'o3',
  'gpt-4o-mini',
  'llama-3.3'
];

export async function chatai(q, model, system_prompt) {
  if (!listmodel.includes(model)) {
    return {
      error: `Model tidak tersedia, gunakan salah satu dari model berikut: ${listmodel.join(', ')}`,
      models: listmodel
    };
  }
  
  const h = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://ai-interface.anisaofc.my.id/'
  };
  
  const data = {
    question: q,
    model: model,
    system_prompt: system_prompt
  };
  
  try {
    const res = await axios.post(
      'https://ai-interface.anisaofc.my.id/api/chat', 
      data, 
      {
        headers: h,
        timeout: 10000
      }
    );
    return res.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || e.message || 'Request AI gagal');
  }
}

export { listmodel }; 