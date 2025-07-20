import axios from 'axios'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}
 
export async function upscale(imageUrl) {
  try {
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })
    const base64Image = `data:image/jpeg;base64,${Buffer.from(imageResponse.data).toString('base64')}`
 
    const upscaleResponse = await axios.post('https://www.upscale-image.com/api/upscale', {
      image: base64Image,
      model: 'fal-ai/esrgan',
      width: 1200,
      height: 1200
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.upscale-image.com',
        'Referer': 'https://www.upscale-image.com'
      }
    })
 
    const { upscaledImageUrl, width, height, fileSize } = upscaleResponse.data
 
    if (!upscaledImageUrl) throw new Error('No response from server!')
 
    return {
      url: upscaledImageUrl,
      width,
      height,
      fileSize: formatBytes(fileSize)
    }
 
  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    }
    throw new Error(err.message);
  }
} 