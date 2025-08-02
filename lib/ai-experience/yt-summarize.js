import axios from 'axios';

function generateRandomDeviceHash() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getRandomOSName() {
    const osNames = [
        'HONOR', 'Samsung', 'Xiaomi', 'OnePlus', 'Huawei', 
        'OPPO', 'Vivo', 'Realme', 'Google', 'LG',
        'Sony', 'Motorola', 'Nokia', 'TCL', 'ASUS'
    ];
    return osNames[Math.floor(Math.random() * osNames.length)];
}

function getRandomOSVersion() {
    const versions = ['8', '9', '10', '11', '12', '13', '14'];
    return versions[Math.floor(Math.random() * versions.length)];
}

function getRandomPlatform() {
    const platforms = [1, 2, 3];
    return platforms[Math.floor(Math.random() * platforms.length)];
}

export async function ytsummarizer(url, { lang = 'id' } = {}) {
    try {
        if (!/youtube.com|youtu.be/.test(url)) {
            throw new Error('Invalid YouTube URL. Please provide a valid YouTube video URL.');
        }
        
        const randomDeviceHash = generateRandomDeviceHash();
        const randomOSName = getRandomOSName();
        const randomOSVersion = getRandomOSVersion();
        const randomPlatform = getRandomPlatform();
        
        // Step 1: Login anonymously to get API token
        const { data: loginResponse } = await axios.post('https://gw.aoscdn.com/base/passport/v2/login/anonymous', {
            brand_id: 29,
            type: 27,
            platform: randomPlatform,
            cli_os: 'web',
            device_hash: randomDeviceHash,
            os_name: randomOSName,
            os_version: randomOSVersion,
            product_id: 343,
            language: 'en'
        }, {
            headers: {
                'content-type': 'application/json'
            }
        });
        
        if (!loginResponse.data || !loginResponse.data.api_token) {
            throw new Error('Failed to obtain authentication token');
        }
        
        // Step 2: Submit YouTube URL for processing
        const { data: taskResponse } = await axios.post('https://gw.aoscdn.com/app/gitmind/v3/utils/youtube-subtitles/overviews?language=en&product_id=343', {
            url: url,
            language: lang,
            deduct_status: 0
        }, {
            headers: {
                authorization: `Bearer ${loginResponse.data.api_token}`,
                'content-type': 'application/json'
            }
        });
        
        if (!taskResponse.data || !taskResponse.data.task_id) {
            throw new Error('Failed to create summarization task');
        }
        
        // Step 3: Poll for completion (with timeout)
        const maxAttempts = 60; // Maximum 60 seconds
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            const { data: statusResponse } = await axios.get(`https://gw.aoscdn.com/app/gitmind/v3/utils/youtube-subtitles/overviews/${taskResponse.data.task_id}?language=en&product_id=343`, {
                headers: {
                    authorization: `Bearer ${loginResponse.data.api_token}`,
                    'content-type': 'application/json'
                }
            });
            
            if (statusResponse.data && statusResponse.data.sum_status === 1) {
                return {
                    success: true,
                    data: statusResponse.data,
                    message: 'YouTube video successfully summarized'
                };
            }
            
            // Wait 1 second before next check
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        
        throw new Error('Summarization timeout. Please try again later.');
        
    } catch (error) {
        if (error.response) {
            // API error response
            throw new Error(`API Error: ${error.response.data?.message || error.response.statusText}`);
        }
        throw new Error(error.message || 'An unexpected error occurred during summarization');
    }
}
