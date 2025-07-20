import axios from 'axios';
import UserAgent from 'user-agents';

export async function ai4chat(prompt, ratio = '1:1') {
    try {
        const _ratio = ['1:1', '16:9', '2:3', '3:2', '4:5', '5:4', '9:16', '21:9', '9:21'];
        
        if (!prompt) throw new Error('Prompt is required');
        if (!_ratio.includes(ratio)) throw new Error(`Available ratios: ${_ratio.join(', ')}`);
        
        const { data } = await axios.get('https://www.ai4chat.co/api/image/generate', {
            params: {
                prompt: prompt,
                aspect_ratio: ratio
            },
            headers: {
                accept: '*/*',
                'content-type': 'application/json',
                referer: 'https://www.ai4chat.co/image-pages/realistic-ai-image-generator',
                'user-agent': new UserAgent().toString()
            }
        });
        
        return data.image_link;
    } catch (error) {
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            throw new Error(`External API Error: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(error.message);
    }
} 