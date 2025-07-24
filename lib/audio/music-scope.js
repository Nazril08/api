import axios from 'axios';
import FormData from 'form-data';

export class MusicScope {
    constructor() {
        this.api_url = 'https://ziqiangao-musicscopegen.hf.space/gradio_api';
        this.file_url = 'https://ziqiangao-musicscopegen.hf.space/gradio_api/file=';
    }
    
    generateSession() {
        return Math.random().toString(36).substring(2);
    }
    
    async upload(buffer, filename) {
        try {
            const upload_id = this.generateSession();
            const form = new FormData();
            form.append('files', buffer, filename);
            const { data } = await axios.post(`${this.api_url}/upload?upload_id=${upload_id}`, form, {
                headers: {
                    ...form.getHeaders(),
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                }
            });
            
            return {
                orig_name: filename,
                path: data[0],
                url: `${this.file_url}${data[0]}`
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async process({ title = 'MusicScope', artist = 'Scrape by Rynn', audio, image } = {}) {
        try {
            if (!audio || !Buffer.isBuffer(audio)) throw new Error('Audio buffer is required');
            if (!image || !Buffer.isBuffer(image)) throw new Error('Image buffer is required');
            
            const audio_url = await this.upload(audio, `${Date.now()}_rynn.mp3`);
            const image_url = await this.upload(image, `${Date.now()}_rynn.jpg`);
            const session_hash = this.generateSession();
            const d = await axios.post(`${this.api_url}/queue/join?`, {
                data: [
                    {
                        path: audio_url.path,
                        url: audio_url.url,
                        orig_name: audio_url.orig_name,
                        size: audio.length,
                        mime_type: 'audio/mpeg',
                        meta: {
                            _type: 'gradio.FileData'
                        }
                    },
                    null,
                    'Output',
                    30,
                    1280,
                    720,
                    1024,
                    {
                        path: image_url.path,
                        url: image_url.url,
                        orig_name: image_url.orig_name,
                        size: image.length,
                        mime_type: 'image/jpeg',
                        meta: {
                            _type: 'gradio.FileData'
                        }
                    },
                    title,
                    artist
                ],
                event_data: null,
                fn_index: 0,
                trigger_id: 26,
                session_hash: session_hash
            }, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                }
            });
            
            const { data } = await axios.get(`${this.api_url}/queue/data?session_hash=${session_hash}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                }
            });
            
            let result;
            const lines = data.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const d = JSON.parse(line.substring(6));
                    if (d.msg === 'process_completed') result = d.output.data[0].video.url;
                }
            }
            
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
} 