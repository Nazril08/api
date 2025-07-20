import axios from 'axios';
import FormData from 'form-data';

export async function ihancer(buffer, { method = 1, size = 'low' } = {}) {
    try {
        const _size = ['low', 'medium', 'high'];
        
        if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Image buffer is required');
        if (method < 1 || method > 4) throw new Error('Available methods: 1, 2, 3, 4');
        if (!_size.includes(size)) throw new Error(`Available sizes: ${_size.join(', ')}`);
        
        const form = new FormData();
        form.append('method', method.toString());
        form.append('is_pro_version', 'false');
        form.append('is_enhancing_more', 'false');
        form.append('max_image_size', size);
        form.append('file', buffer, `rynn_${Date.now()}.jpg`);
        const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
            headers: {
                ...form.getHeaders(),
                'accept-encoding': 'gzip',
                host: 'ihancer.com',
                'user-agent': 'Dart/3.5 (dart:io)'
            },
            responseType: 'arraybuffer'
        });
        
        return Buffer.from(data);
    } catch (error) {
        throw new Error(error.message);
    }
} 