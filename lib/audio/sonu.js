import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const userHeaders = {
  'user-agent': 'NB Android/1.0.0',
  'content-type': 'application/json',
  'accept': 'application/json',
  'x-platform': 'android',
  'x-app-version': '1.0.0',
  'x-country': 'ID',
  'accept-language': 'id-ID',
  'x-client-timezone': 'Asia/Jakarta',
};

export async function generateMusic(title, lyrics, mood, genre, gender) {
  try {
    if (!title) throw new Error('Title is required');
    if (!lyrics) throw new Error('Lyrics are required');
    if (lyrics.length > 1500) throw new Error('Lyrics cannot exceed 1500 characters');

    const deviceId = uuidv4();
    const msgId = uuidv4();
    const time = Date.now().toString();
    const fcmToken = 'eqnTqlxMTSKQL5NQz6r5aP:APA91bHa3CvL5Nlcqx2yzqTDAeqxm_L_vIYxXqehkgmTsCXrV29eAak6_jqXv5v1mQrdw4BGMLXl_BFNrJ67Em0vmdr3hQPVAYF8kR7RDtTRHQ08F3jLRRI';

    const registerHeaders = {
      ...userHeaders,
      'x-device-id': deviceId,
      'x-request-id': msgId,
      'x-message-id': msgId,
      'x-request-time': time
    };

    // Register user
    const reg = await axios.put('https://musicai.apihub.today/api/v1/users', {
      deviceId,
      fcmToken
    }, { headers: registerHeaders });

    const userId = reg.data.id;

    // Create song
    const createHeaders = {
      ...registerHeaders,
      'x-client-id': userId
    };

    const body = {
      type: 'lyrics',
      name: title,
      lyrics
    };
    
    if (mood) body.mood = mood;
    if (genre) body.genre = genre;
    if (gender) body.gender = gender;

    const create = await axios.post('https://musicai.apihub.today/api/v1/song/create', body, { headers: createHeaders });
    const songId = create.data.id;

    // Check song status
    const checkHeaders = {
      ...userHeaders,
      'x-client-id': userId
    };

    let attempts = 0;
    const maxAttempts = 20; // Maximum 1 minute of waiting (20 attempts * 3 seconds)

    while (attempts < maxAttempts) {
      const check = await axios.get('https://musicai.apihub.today/api/v1/song/user', {
        params: {
          userId,
          isFavorite: false,
          page: 1,
          searchText: ''
        },
        headers: checkHeaders
      });

      const found = check.data.datas.find(song => song.id === songId);
      
      if (!found) {
        throw new Error('Song generation failed');
      }

      if (found.url) {
        return {
          url: found.url,
          name: found.name,
          status: found.status,
          thumbnail_url: found.thumbnail_url
        };
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    }

    throw new Error('Song generation timeout');
  } catch (error) {
    throw new Error(error.message);
  }
} 