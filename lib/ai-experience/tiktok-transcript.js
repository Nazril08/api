/** 
 * Scrape TikTok Transcript
 * Author: SaaOfc's
*/
import axios from 'axios';

export const TtTranscript = async (videoUrl) => {
  try {
    const res = await axios.post(
      'https://www.short.ai/self-api/v2/project/get-tiktok-youtube-link',
      {
        link: videoUrl
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://www.short.ai',
          'Referer': 'https://www.short.ai/tiktok-script-generator',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
        }
      }
    );

    const data = res.data?.data?.data;
    if (!data) {
        return {
            status: false,
            code: 404,
            message: 'Transcript not found for the given URL.'
        };
    }

    return {
      status: true,
      code: 200,
      result: {
        text: data.text,
        duration: data.duration,
        language: data.language,
        url: res.data?.data?.url,
        segments: data.segments.map(s => ({
          start: s.start,
          end: s.end,
          text: s.text
        }))
      }
    };

  } catch (err) {
    console.error('TtTranscript Error:', err.response?.data || err.message);
    return { 
        status: false,
        code: err.response?.status || 500,
        message: 'Failed to retrieve transcript. The video may not have a transcript or the URL is invalid.' 
    };
  }
}; 