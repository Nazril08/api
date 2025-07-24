import axios from 'axios';

async function uploadAudio(mp3Url) {
  try {
    const audioRes = await axios.get(mp3Url, { responseType: 'arraybuffer' });
 
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
 
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="fileName"; filename="audio.mp3"\r\n`),
      Buffer.from(`Content-Type: audio/mpeg\r\n\r\n`),
      Buffer.from(audioRes.data),
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
 
    const res = await axios.post('https://aivocalremover.com/api/v2/FileUpload', multipartBody, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': multipartBody.length,
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
 
    const { data } = res;
    if (data?.error) throw new Error(data.message);
 
    return {
      key: data.key,
      file_name: data.file_name
    };
  } catch (err) {
    throw new Error('Upload gagal: ' + err.message);
  }
}
 
async function processAudio(file_name, key) {
  const params = new URLSearchParams({
    file_name,
    action: 'watermark_video',
    key,
    web: 'web'
  });
 
  try {
    const res = await axios.post('https://aivocalremover.com/api/v2/ProcessFile', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
 
    const { data } = res;
    if (data?.error) throw new Error(data.message);
 
    return {
      vocal: data.vocal_path,
      instrumental: data.instrumental_path
    };
  } catch (err) {
    throw new Error('Proses gagal: ' + err.message);
  }
}

export async function vocalRemover(url) {
  try {
    const { data } = await axios.get(`https://wrd.v2.mr-robot.co/api/demucs?url=${encodeURIComponent(url)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    return data;
  } catch (error) {
    console.error('Vocal remover error:', error);
    if (error.response) {
            console.error('Error Response Data:', error.response.data);
            throw new Error(`External API Error: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(error.message);
  }
} 