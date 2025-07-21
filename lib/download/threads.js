import axios from 'axios';

export async function downloadFromThreads(threadsUrl) {
  const api = 'https://api.threadsphotodownloader.com/v2/media';
 
  try {
    if (!threadsUrl) {
        throw new Error('Threads URL is required.');
    }

    const response = await axios.get(api, {
      params: { url: threadsUrl },
      headers: {
        'Origin': 'https://sssthreads.pro',
        'Referer': 'https://sssthreads.pro/',
        'User-Agent': 'Mozilla/5.0',
      }
    });
 
    const { video_urls = [], image_urls = [] } = response.data;
 
    if (video_urls.length === 0 && image_urls.length === 0) {
      throw new Error('No media found at the provided Threads URL.');
    }
 
    return {
        videos: video_urls.map(item => item.download_url),
        images: image_urls
    };
 
  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    }
    throw new Error(err.message);
  }
} 