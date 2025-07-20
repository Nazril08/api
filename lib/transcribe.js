import axios from 'axios';
import FormData from 'form-data';

export async function transcribe(input) {
    try {
        let buffer;
        if (Buffer.isBuffer(input)) {
            buffer = input;
        } else if (typeof input === 'string') {
            const response = await axios.get(input, { responseType: 'arraybuffer' });
            buffer = response.data;
        } else {
            throw new Error('Invalid input: Must be a buffer or a URL string.');
        }
        
        if (!buffer) throw new Error('Failed to get audio buffer.');

        const form = new FormData();
        form.append('file', buffer, `${Date.now()}_rynn.mp3`);
        const { data } = await axios.post('https://audio-transcription-api.752web.workers.dev/api/transcribe', form, {
            headers: form.getHeaders()
        });
        
        return data.transcription;
    } catch (error) {
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            throw new Error(`External API Error: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(error.message);
    }
} 