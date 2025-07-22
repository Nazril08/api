const validQualities = ['64', '128', '192', '256', '320'];

export async function ytMp3(url, quality) {
  if (!url || !quality) throw new Error('URL dan kualitas harus diisi.');
  if (!validQualities.includes(quality)) throw new Error(`Kualitas tidak valid! Pilih salah satu dari: ${validQualities.join(', ')} kbps`);

  const apiUrl = `https://api.fasturl.link/downup/ytmp3?url=${encodeURIComponent(url)}&quality=${quality}kbps&server=auto`;
  const res = await fetch(apiUrl);
  const json = await res.json();

  if (json.status != 200) throw new Error('Gagal mengambil data dari server.');

  const { title, metadata, author, media } = json.result;
  const { duration, thumbnail } = metadata;

  return {
    title,
    author,
    duration,
    thumbnail,
    media,
    url,
    quality
  };
} 