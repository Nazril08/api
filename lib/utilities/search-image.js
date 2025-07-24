import axios from 'axios';
import FormData from 'form-data';

async function uploadThumbnail(base64Image) {
    try {
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('time', '1h');
        form.append('fileToUpload', Buffer.from(base64Image, 'base64'), {
            filename: 'thumb.jpg',
            contentType: 'image/jpeg'
        });

        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });

        return response.data;
    } catch (error) {
        console.error('Catbox upload failed:', error.message);
        return 'Upload ke catbox gagal';
    }
}

export async function searchImageByUrl(url) {
    if (!url) {
        throw new Error("URL parameter is required.");
    }

    const apiUrl = `https://picdetective.com/api/search?url=${encodeURIComponent(url)}&search_type=exact_matches`;
    
    const headers = {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': 'https://picdetective.com/search',
    };
    
    try {
        const response = await axios.get(apiUrl, { headers });
        const results = response.data.exact_matches || [];
        
        const updatedResults = await Promise.all(results.map(async (item) => {
            if (item.thumbnail && item.thumbnail.startsWith('data:image')) {
                const base64Data = item.thumbnail.split(',')[1];
                item.thumbnail = await uploadThumbnail(base64Data);
            }
            return item;
        }));
        
        return updatedResults;
        
    } catch (error) {
        console.error('PicDetective search error:', error.message);
        throw new Error('Failed to fetch image search results.');
    }
} 