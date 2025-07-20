import axios from 'axios'
import * as cheerio from 'cheerio'
 
async function getSnappinToken() {
  const { headers, data } = await axios.get('https://snappin.app/');
  const cookies = headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
  const $ = cheerio.load(data);
  const csrfToken = $('meta[name="csrf-token"]').attr('content');
  return { csrfToken, cookies };
}

export async function snappinDownload(pinterestUrl) {
  try {
    const { csrfToken, cookies } = await getSnappinToken();
 
    const postRes = await axios.post(
      'https://snappin.app/',
      { url: pinterestUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
          Cookie: cookies,
          Referer: 'https://snappin.app',
          Origin: 'https://snappin.app',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );
 
    const $ = cheerio.load(postRes.data);
    const thumb = $('img').attr('src');
 
    const downloadLinks = $('a.button.is-success')
      .map((_, el) => $(el).attr('href'))
      .get();
 
    let videoUrl = null;
    let imageUrl = null;
 
    for (const link of downloadLinks) {
      const fullLink = link.startsWith('http') ? link : 'https://snappin.app' + link;
 
      try {
        const head = await axios.head(fullLink);
        const contentType = head?.headers?.['content-type'] || '';
 
        if (contentType.includes('video')) {
          videoUrl = fullLink;
        } else if (contentType.includes('image')) {
          imageUrl = fullLink;
        }
      } catch (headError) {
        // Ignore errors for individual link checks
      }
    }
 
    return {
      thumb,
      video: videoUrl,
      image: videoUrl ? null : imageUrl
    };
 
  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    }
    throw new Error(err.message);
  }
} 