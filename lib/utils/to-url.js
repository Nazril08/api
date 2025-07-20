import axios from 'axios';
import FormData from 'form-data';

export async function toUrl(buffer, fileName) {
    try {
        if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('File buffer is required');
        
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', buffer, fileName);
        
        const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });
        
        return data;
    } catch (error) {
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            throw new Error(`External API Error: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(error.message);
    }
} 