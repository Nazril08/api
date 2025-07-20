import axios from 'axios'
 
export async function AIFreeboxImage(prompt, aspectRatio = '16:9', slug = 'ai-art-generator') {
  const validRatios = ['1:1', '2:3', '9:16', '16:9']
  const validSlugs = [
    'ai-art-generator',
    'ai-fantasy-map-creator',
    'ai-youtube-thumbnail-generator',
    'ai-old-cartoon-characters-generator'
  ]
 
  if (!validRatios.includes(aspectRatio)) {
    throw new Error(`Aspect ratio not available! Choose one of: ${validRatios.join(', ')}`)
  }
 
  if (!validSlugs.includes(slug)) {
    throw new Error(`Slug not available! Choose one of: ${validSlugs.join(', ')}`)
  }
 
  try {
    const response = await axios.post('https://aifreebox.com/api/image-generator', {
      userPrompt: prompt,
      aspectRatio,
      slug
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://aifreebox.com',
        'Referer': `https://aifreebox.com/image-generator/${slug}`,
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 Safari/537.36'
      }
    })
 
    const { data } = response
 
    if (data?.success && data.imageUrl) {
      return data.imageUrl
    } else {
      throw new Error('No response from server');
    }
  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    }
    throw new Error(err.message);
  }
} 