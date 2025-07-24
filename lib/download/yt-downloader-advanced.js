
/*
- Name : Ytmp4 & Ytmp3 Advanced
- Deks : Gas Donglot Pideo 6 Jam
- Follow Bang : https://whatsapp.com/channel/0029Vb6D8o67YSd1UzflqU1d
- Source Scrape : https://whatsapp.com/channel/0029Vb5EZCjIiRotHCI1213L/369 ( Wolep )
*/
export let ytmp3mobi = async (youtubeUrl, format = "mp3") => {
    const regYoutubeId = /https:\/\/(www.youtube.com\/watch\?v=|youtu.be\/|youtube.com\/shorts\/|youtube.com\/watch\?v=)([^&|^?]+)/
    const videoId = youtubeUrl.match(regYoutubeId)?.[2]
    if (!videoId) throw Error("cant extract youtube video id from given link. please check your youtube link")

    const availableFormat = ["mp3", "mp4"]
    const formatIndex = availableFormat.findIndex(v => v == format.toLowerCase())
    if (formatIndex == -1) throw Error(`${format} is invalid format, available format : ${availableFormat.join(", ")}. pick one!`)

    const urlParam = {
        v: videoId,
        f: format,
        _: Math.random()
    }

    const headers = { "Referer": "https://id.ytmp3.mobi/" }

    const fetchJson = async (url, fetchDescription) => {
        const res = await fetch(url, { headers })
        if (!res.ok) throw Error(`fetch failed on ${fetchDescription} | ${res.status} ${res.statusText}`)
        return await res.json()
    }

    const { convertURL } = await fetchJson("https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=" + Math.random(), "get convertURL")
    const { progressURL, downloadURL } = await fetchJson(`${convertURL}&${new URLSearchParams(urlParam).toString()}`, "get progressURL and downloadURL")

    let { error, progress, title } = {}
    while (progress != 3) {
        ({ error, progress, title } = await fetchJson(progressURL, "fetch progressURL"))
        if (error) throw Error(`error found in json object after fetch progressURL, here the value of error key : ${error}`)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Menunggu 1 detik sebelum mencoba lagi
    }

    return { title, downloadURL }
} 