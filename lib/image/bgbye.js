import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

class BgBye {
    constructor() {
        this.url = 'https://bgbye2.fyrean.com';
        this.methods = ['bria', 'inspyrenet', 'u2net', 'tracer', 'basnet', 'deeplab', 'u2net_human_seg', 'ormbg', 'isnet-general-use', 'isnet-anime'];
    }
    
    async removeImageBackground(buffer, { method = 'bria' } = {}) {
        try {
            if (!buffer || !Buffer.isBuffer(buffer)) {
                throw new Error('Image buffer is required');
            }
            
            if (!this.methods.includes(method)) {
                throw new Error(`Invalid method. Available methods: ${this.methods.join(', ')}`);
            }
            
            const fileType = await fileTypeFromBuffer(buffer);
            if (!fileType || !fileType.mime.startsWith('image/')) {
                throw new Error('Invalid image format. Please provide a valid image file.');
            }
            
            const form = new FormData();
            form.append('file', buffer, `${Date.now()}_image.jpg`);
            form.append('method', method);
            
            const { data } = await axios.post(`${this.url}/remove_background/`, form, {
                headers: {
                    ...form.getHeaders(),
                },
                responseType: 'arraybuffer',
                timeout: 60000 // 60 seconds timeout
            });
            
            return {
                success: true,
                data: data,
                method: method,
                message: 'Background removed successfully'
            };
            
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. The image might be too large or the server is busy.');
            }
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    
    async removeVideoBackground(buffer, { method = 'bria' } = {}) {
        try {
            if (!buffer || !Buffer.isBuffer(buffer)) {
                throw new Error('Video buffer is required');
            }
            
            if (!this.methods.includes(method)) {
                throw new Error(`Invalid method. Available methods: ${this.methods.join(', ')}`);
            }
            
            const fileType = await fileTypeFromBuffer(buffer);
            if (!fileType || !fileType.mime.startsWith('video/')) {
                throw new Error('Invalid video format. Please provide a valid video file.');
            }
            
            const form = new FormData();
            form.append('file', buffer, `${Date.now()}_video.mp4`);
            form.append('method', method);
            
            // Submit video for processing
            const { data: task } = await axios.post(`${this.url}/remove_background_video/`, form, {
                headers: {
                    ...form.getHeaders(),
                },
                timeout: 120000 // 2 minutes timeout for upload
            });
            
            if (!task || !task.video_id) {
                throw new Error('Failed to submit video for processing');
            }
            
            // Poll for completion with timeout
            const maxAttempts = 300; // Maximum 5 minutes (300 seconds)
            let attempts = 0;
            
            while (attempts < maxAttempts) {
                try {
                    const { data: status } = await axios.get(`${this.url}/status/${task.video_id}`);
                    
                    if (status && status.status !== 'processing') {
                        // Video processing completed, get the result
                        const { data: result } = await axios.get(`${this.url}/status/${task.video_id}`, { 
                            responseType: 'arraybuffer',
                            timeout: 60000
                        });
                        
                        return {
                            success: true,
                            data: result,
                            method: method,
                            video_id: task.video_id,
                            message: 'Video background removed successfully'
                        };
                    }
                    
                    // Wait 1 second before next poll
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts++;
                    
                } catch (pollError) {
                    if (attempts > 10) { // Allow some retries for network issues
                        throw new Error('Failed to check video processing status');
                    }
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            
            throw new Error('Video processing timeout. The video might be too large or complex.');
            
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. The video might be too large or the server is busy.');
            }
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    
    getMethods() {
        return this.methods;
    }
}

export { BgBye };
export default BgBye;
