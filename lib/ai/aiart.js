import ws from 'ws';

export async function aiart(prompt, options = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                style = 'Anime',
                negativePrompt = '(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres , username, blurry, trademark, watermark, title, multiple view, Reference sheet, curvy, plump, fat, strabismus, clothing cutout, side slit,worst hand, (ugly face:1.2), extra leg, extra arm, bad foot, text, name',
                scale = 7
            } = options;
            
            const _style = ['Anime', 'Realistic'];
            
            if (!prompt) throw new Error('Prompt is required');
            if (!_style.includes(style)) throw new Error(`Available styles: ${_style.join(', ')}`);
            
            const session_hash = Math.random().toString(36).substring(2);
            const socket = new ws('wss://app.yimeta.ai/ai-art-generator/queue/join');
            
            socket.on('message', (data) => {
                const d = JSON.parse(data.toString('utf8'));
                switch (d.msg) {
                    case 'send_hash':
                        socket.send(JSON.stringify({
                            fn_index: 31,
                            session_hash,
                        }));
                        break;
                    
                    case 'send_data':
                        socket.send(JSON.stringify({
                            fn_index: 31,
                            session_hash,
                            data: [style, prompt, negativePrompt, scale, ''],
                        }));
                        break;
                    
                    case 'estimation':
                    case 'process_starts':
                        break;
                    
                    case 'process_completed':
                        socket.close();
                        resolve(d.output.data[0][0].name);
                        break;
                    
                    default:
                        console.log(`Unexpected message type: ${data.toString('utf8')}`);
                        break;
                }
            });

            socket.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
} 