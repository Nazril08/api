import axios from 'axios';

export async function ttstokoh(text, tokoh = 'jokowi') {
    try {
        const _tokoh = {
            jokowi: {
                speed: -30,
                model: 'id-ID-ArdiNeural-Male',
                tune: -3
            },
            megawati: {
                speed: -20,
                model: 'id-ID-GadisNeural-Female',
                tune: -3
            },
            prabowo: {
                speed: -30,
                model: 'id-ID-ArdiNeural-Male',
                tune: -3
            }
        };
        
        if (!text) throw new Error('Text is required');
        if (!Object.keys(_tokoh).includes(tokoh)) throw new Error(`Available tokoh: ${Object.keys(_tokoh).join(', ')}`);
        
        const session_hash = Math.random().toString(36).substring(2);
        
        // This is a fire-and-forget request to start the job
        await axios.post('https://deddy-tts-rvc-tokoh-indonesia.hf.space/queue/join?', {
            data: [
                tokoh,
                _tokoh[tokoh].speed,
                text,
                _tokoh[tokoh].model,
                _tokoh[tokoh].tune,
                'rmvpe',
                0.5,
                0.33
            ],
            event_data: null,
            fn_index: 0,
            trigger_id: 20,
            session_hash: session_hash
        });

        // Use a loop to poll for the result
        for (let i = 0; i < 20; i++) { // Poll for up to 20 seconds
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

            const { data } = await axios.get(`https://deddy-tts-rvc-tokoh-indonesia.hf.space/queue/data?session_hash=${session_hash}`);
            
            let result;
            const lines = data.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    try {
                        const d = JSON.parse(line.substring(6));
                        if (d.msg === 'process_completed') {
                            result = d.output.data[2].url;
                            return result; // Return immediately once found
                        }
                    } catch (e) {
                        // Ignore parsing errors for intermediate messages
                    }
                }
            }
        }
        
        throw new Error('TTS processing timed out.');

    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
} 