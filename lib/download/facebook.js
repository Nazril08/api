import axios from 'axios';

const fixUrl = (url) => url?.replace(/\\/g,"") || null;

export async function fbvdl(fbUrl) {
  try {
    if (typeof(fbUrl) !== "string" || !fbUrl) throw new Error (`URL is required`);

    const headers = {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
    };

    const response = await axios.get(fbUrl, { headers });
    const html = response.data;

    const m_sd = html.match(/"browser_native_sd_url":"(.+?)",/)?.[1];
    const m_hd = html.match(/"browser_native_hd_url":"(.+?)",/)?.[1];
    const m_a = html.match(/"mime_type":"audio\\\/mp4","codecs":"mp4a\.40\.5","base_url":"(.+?)",/)?.[1];

    const result = {
      sd: fixUrl(m_sd),
      hd: fixUrl(m_hd),
      audio: fixUrl(m_a)
    };
    
    if (!result.sd && !result.hd) {
        throw new Error('No video links found. The URL might be private, invalid, or a non-video post.');
    }

    return result;
  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${err.response.statusText}`);
    }
    throw new Error(err.message);
  }
} 