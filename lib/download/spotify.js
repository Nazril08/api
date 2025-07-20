import axios from 'axios'
 
function msToMinutes(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
 
export async function spotifyDownload(url) {
  try {
    if (!url) throw new Error('URL parameter is required.');

    const metaResponse = await axios.post('https://spotiydownloader.com/api/metainfo', { url }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://spotiydownloader.com',
        'Referer': 'https://spotiydownloader.com/id',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const meta = metaResponse.data;
    if (!meta || !meta.success || !meta.id) {
      throw new Error('Failed to retrieve song information.');
    }

    const dlResponse = await axios.post('https://spotiydownloader.com/api/download', { id: meta.id }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://spotiydownloader.com',
        'Referer': 'https://spotiydownloader.com/id',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const result = dlResponse.data;
    if (!result || !result.success || !result.link) {
      throw new Error('Failed to get the download link.');
    }

    return {
      artist: meta.artists || meta.artist || 'Unknown',
      title: meta.title || 'Unknown',
      duration: meta.duration_ms ? msToMinutes(meta.duration_ms) : 'Unknown',
      image: meta.cover || null,
      download: result.link
    };
  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    }
    throw new Error(err.message);
  }
} 