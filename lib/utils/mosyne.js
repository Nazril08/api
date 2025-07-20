import axios from 'axios'
import FormData from 'form-data'

export async function uploadUguu(buffer, filename = 'image.jpg') {
  const form = new FormData()
  form.append('files[]', buffer, { filename })

  const { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders()
  })

  const url = data?.files?.[0]?.url
  if (!url) throw new Error('Upload ke Uguu gagal.')
  return url
}

export async function removeBackgroundMosyne(buffer) {
  const imageUrl = await uploadUguu(buffer)
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'content-type': 'application/json',
    'origin': 'https://mosyne.ai',
    'referer': 'https://mosyne.ai/ai/remove-bg',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)'
  }

  const user_id = 'user_test'

  const { data: uploadRes } = await axios.post(
    'https://mosyne.ai/api/remove_background',
    { image: imageUrl, user_id },
    { headers }
  )

  const id = uploadRes.id
  if (!id) throw new Error('gagal dpet id.')

  const checkPayload = { id, type: 'remove_background', user_id }
  const delay = ms => new Promise(res => setTimeout(res, ms))

  for (let i = 0; i < 30; i++) {
    await delay(2000)

    const { data: statusRes } = await axios.post(
      'https://mosyne.ai/api/status',
      checkPayload,
      { headers }
    )

    if (statusRes.status === 'COMPLETED' && statusRes.image) {
      return statusRes.image
    }

    if (statusRes.status === 'FAILED') {
      throw new Error('proses gagal saat hapus kenangan.')
    }
  }

  throw new Error('timeout hapus kenangan.')
}

export async function upscaleMosyne(buffer) {
  const imageUrl = await uploadUguu(buffer)
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'content-type': 'application/json',
    'origin': 'https://mosyne.ai',
    'referer': 'https://mosyne.ai/ai/upscaling',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)'
  }

  const user_id = 'user_test'

  const { data: uploadRes } = await axios.post(
    'https://mosyne.ai/api/upscale',
    { image: imageUrl, user_id },
    { headers }
  )

  const id = uploadRes.id
  if (!id) throw new Error('aish gagal dpet id')

  const checkPayload = { id, type: 'upscale', user_id }
  const delay = ms => new Promise(res => setTimeout(res, ms))

  for (let i = 0; i < 30; i++) {
    await delay(2000)

    const { data: statusRes } = await axios.post(
      'https://mosyne.ai/api/status',
      checkPayload,
      { headers }
    )

    if (statusRes.status === 'COMPLETED' && statusRes.image) {
      return statusRes.image
    }

    if (statusRes.status === 'FAILED') {
      throw new Error('gagal.')
    }
  }

  throw new Error('terlalu lama menunggu dia.')
} 