import axios from 'axios'
 
export async function Terabox(link) {
  try {
    if (!/^https:\/\/(1024)?terabox\.com\/s\//.test(link)) {
      throw new Error('Invalid link! Must be from terabox.com or 1024terabox.com');
    }
 
    const res = await axios.post('https://teraboxdownloader.online/api.php',
      { url: link },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://teraboxdownloader.online',
          'Referer': 'https://teraboxdownloader.online/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': '*/*'
        }
      }
    )
 
    const data = res.data;
    if (!data?.direct_link) {
      throw new Error('No download link found.');
    }
 
    return {
      file_name: data.file_name,
      size: data.size,
      size_bytes: data.sizebytes,
      direct_link: data.direct_link,
      thumb: data.thumb
    }
 
  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    }
    throw new Error(err.message);
  }
} 