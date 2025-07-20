import axios from 'axios';

export async function animagineV2(prompt, aspect_ratio = '1:1') {
    try {
        const validRatios = ['1:1', '9:7', '7:9', '19:13', '13:19', '7:4', '4:7', '12:5', '5:12'];
        if (!validRatios.includes(aspect_ratio)) {
            throw new Error(`Invalid aspect ratio. Available ratios: ${validRatios.join(', ')}`);
        }

        const session_hash = Math.random().toString(36).substring(2);
        const joinUrl = 'https://asahina2k-animagine-xl-4-0.hf.space/queue/join?';
        const dataUrl = `https://asahina2k-animagine-xl-4-0.hf.space/queue/data?session_hash=${session_hash}`;

        const conf = {
            ratios: {
                '1:1': '1024 x 1024',
                '9:7': '1152 x 896',
                '7:9': '896 x 1152',
                '19:13': '1216 x 832',
                '13:19': '832 x 1216',
                '7:4': '1344 x 768',
                '4:7': '768 x 1344',
                '12:5': '1536 x 640',
                '5:12': '640 x 1536'
            },
        };

        const payload = {
            data: [
                prompt,
                'lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, worst score, average score, signature, watermark, username, blurry',
                Math.floor(Math.random() * 2147483648),
                1024,
                1024,
                5,
                28,
                'Euler a',
                conf.ratios[aspect_ratio],
                'Anim4gine',
                false,
                0.55,
                1.5,
                true
            ],
            event_data: null,
            fn_index: 5,
            trigger_id: 43,
            session_hash: session_hash
        };

        await axios.post(joinUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        let resultUrl = null;
        let attempts = 0;
        while (!resultUrl && attempts < 20) {
            const res = await axios.get(dataUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            const lines = res.data.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const d = JSON.parse(line.substring(6));
                    if (d.msg === 'process_completed') {
                        resultUrl = d.output.data[0][0].image.url;
                        break;
                    }
                }
            }
            if (resultUrl) break;
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        if (!resultUrl) {
            throw new Error('Could not get result from API within the time limit.');
        }

        return resultUrl;

    } catch (err) {
        if (err.response) {
            console.error('Error Response Data:', err.response.data);
            throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        }
        throw new Error(err.message);
    }
} 