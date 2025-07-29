import axios from 'axios';
import FormData from 'form-data';

function generateFileName(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let name = '';
  for (let i = 0; i < length; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return name + '.png';
}

export async function upscaler4K(urls) {
  try {
    const imageResponse = await axios.get(urls, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);
    const randomFilename = generateFileName();

    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: randomFilename,
      contentType: 'image/png'
    });

    const headers = {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
      'Accept': '*/*',
      'Referer': 'https://malaji71-4k-upscaler.hf.space/'
    };

    const response = await axios.post('https://malaji71-4k-upscaler.hf.space/api/upload', form, { headers });
    const outputFile = response.data.output_filename;
    return `https://malaji71-4k-upscaler.hf.space/api/preview/${outputFile}`;
  } catch (error) {
    throw new Error(error.message);
  }
} 