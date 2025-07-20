import axios from 'axios'

export async function GhibliGenerator(prompt, style = 'Spirited Away') {
  try {
    const allowedStyles = [
      'Spirited Away',
      "Howl's Castle",
      'Princess Mononoke',
      'Totoro'
    ]
    if (!allowedStyles.includes(style)) {
      throw new Error(`Style not available. Use one of: ${allowedStyles.join(', ')}`)
    }
 
    const response = await axios.post(
      'https://ghibliimagegenerator.net/api/generate-image',
      { prompt, style },
      {
        headers: {
          'content-type': 'application/json',
          'origin': 'https://ghibliimagegenerator.net',
          'referer': 'https://ghibliimagegenerator.net/generator',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0 Safari/537.36'
        }
      }
    )
 
    if (response.data?.imageData) {
      const base64Data = response.data.imageData.split(',')[1]
      const buffer = Buffer.from(base64Data, 'base64')
      return buffer;
    } else {
      throw new Error('No imageData in response');
    }
  } catch (error) {
    if (error.response) {
        console.error('Error Response Data:', error.response.data);
        throw new Error(`External API Error: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(error.message);
  }
} 