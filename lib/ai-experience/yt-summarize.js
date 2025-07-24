import axios from 'axios';

export async function summarizeYoutubeVideo(url) {
  const ytRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w\-]{11}/;
  if (!url || !ytRegex.test(url)) {
    throw new Error('A valid YouTube URL is required.');
  }

  try {
    const { data } = await axios.post('https://docsbot.ai/api/tools/youtube-prompter', {
      videoUrl: url,
      type: 'summary'
    }, { 
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      } 
    });

    if (!data?.summary || !data?.title) {
      throw new Error('Failed to retrieve summary from the external service.');
    }

    return {
      title: data.title,
      channel: data.metadata?.channelName || null,
      duration: data.metadata?.duration || null,
      summary: data.summary.trim(),
      keyPoints: data.keyPoints || []
    };
  } catch (error) {
    if (error.response) {
        console.error('Error Response Data:', error.response.data);
        throw new Error(`External API Error: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(error.message || 'An unexpected error occurred during summarization.');
  }
} 