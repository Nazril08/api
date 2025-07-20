import axios from 'axios'
 
const FILTERS = ['Coklat', 'Hitam', 'Nerd', 'Piggy', 'Carbon', 'Botak']
 
export async function hitamkan(imageUrl, filter = 'Hitam') {
  try {
    const selected = FILTERS.find(f => f.toLowerCase() === filter.toLowerCase());
    if (!selected) {
        throw new Error(`Filter '${filter}' not available. Available filters: ${FILTERS.join(', ')}`);
    }

    const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Input = `data:image/jpeg;base64,${Buffer.from(imgRes.data).toString('base64')}`;
    
    const res = await axios.post('https://wpw.my.id/api/process-image', {
      imageData: base64Input,
      filter: selected.toLowerCase()
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://wpw.my.id',
        'Referer': 'https://wpw.my.id/',
      }
    });

    const dataUrl = res.data?.processedImageUrl;
    if (!dataUrl?.startsWith('data:image/')) {
        throw new Error('No result found from the API.');
    }

    const base64Output = dataUrl.split(',')[1];
    return Buffer.from(base64Output, 'base64');

  } catch (err) {
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    }
    throw new Error(err.message);
  }
} 