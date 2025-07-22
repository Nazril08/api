import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";

const char_female = {
  lumine: [5, 84], paimon: [10, 127], venti: [15, 173], eula: [25, 259], mona: [30, 302],
  hutao: [40, 391], ayaka: [65, 609], yae: [60, 566], raiden: [55, 523], kuki: [70, 652],
  nahida: [75, 698], nilou: [80, 741], furina: [95, 873], navia: [110, 1002],
};

const char_male = {
  aether: [0, 41], diluc: [20, 216], xiao: [45, 434], zhongli: [35, 348], kazuha: [50, 477],
  wanderer: [85, 784], kaveh: [90, 827], neuvillette: [100, 916], wriothesley: [105, 959],
};

export const characters = {
  male: Object.keys(char_male),
  female: Object.keys(char_female),
  all: [...Object.keys(char_female), ...Object.keys(char_male)],
};

export function genshinRvc(options = {}) {
  return new Promise(async (resolve, reject) => {
    const BASEURL = "https://arkandash-rvc-genshin-impact.hf.space";
    const session_hash = Math.random().toString(36).substring(2);

    let resolved = false; // Flag to prevent multiple resolves/rejects

    const {
      character = "hutao",
      useTTS = true,
      text = "test",
      transpose = 0,
      pitch = "pm",
      ratio = 0.7,
      median = 3,
      resample = 0,
      volume_envelope = 1,
      voice_protection = 0.5,
      audio_buffer = null,
    } = options;

    if (!characters.all.includes(character)) {
        return reject(new Error(`Character not found. Available characters: ${characters.all.join(", ")}`));
    }

    const charConfig = { ...char_female, ...char_male }[character];
    const charVoice = characters.female.includes(character) ? "id-ID-GadisNeural-Female" : "id-ID-ArdiNeural-Male";
    
    let audioPayload = null;
    if (!useTTS && Buffer.isBuffer(audio_buffer)) {
        const { ext, mime } = (await fileTypeFromBuffer(audio_buffer)) || { ext: "mp3", mime: "audio/mpeg" };
        const form = new FormData();
        form.append("files", audio_buffer, { filename: `audio.${ext}`, contentType: mime });
        
        try {
            const uploadResponse = await axios.post(`${BASEURL}/upload`, form, { headers: form.getHeaders() });
            const filePath = uploadResponse.data[0];
            audioPayload = {
                is_stream: false,
                mime_type: "",
                orig_name: filePath.split("/").pop(),
                path: filePath,
                size: audio_buffer.length,
                url: `${BASEURL}/file=/${filePath}`,
            };
        } catch(e) {
            return reject(new Error("Failed to upload audio buffer."));
        }
    }

    const payload = {
      data: [
        useTTS ? "TTS Audio" : "Upload audio", "", audioPayload, text, charVoice,
        transpose, pitch, ratio, median, resample, volume_envelope, voice_protection,
      ],
      event_data: null,
      fn_index: charConfig[0],
      session_hash,
      trigger_id: charConfig[1],
    };

    try {
        await axios.post(`${BASEURL}/queue/join?`, payload);

        const streamResponse = await axios.get(`${BASEURL}/queue/data?session_hash=${session_hash}`, {
            headers: { "content-type": "text/event-stream" },
            responseType: "stream",
        });

        const stream = streamResponse.data;
        
        const cleanup = () => {
            if (!stream.destroyed) {
                stream.destroy();
            }
        };

        stream.on("data", (chunk) => {
            if (resolved) return;
            const lines = chunk.toString().split("\n").filter(line => line.startsWith("data: "));
            for (const line of lines) {
                try {
                    const data = JSON.parse(line.substring(6));
                    if (data.msg === "process_completed") {
                        resolved = true;
                        if (!data.success) {
                            reject(new Error("Processing failed on the external service."));
                        } else {
                            const result = {
                                status: true,
                                message: data.output.data[0],
                                ...data.output.data[1],
                            };
                            resolve(result);
                        }
                        cleanup();
                        break;
                    }
                } catch (e) {
                    if (resolved) return;
                    resolved = true;
                    reject(new Error("Failed to parse stream data."));
                    cleanup();
                    break;
                }
            }
        });
        
        stream.on('error', (err) => {
            if (resolved) return;
            resolved = true;
            reject(err);
            cleanup();
        });
        
        stream.on('end', () => {
            if (resolved) return;
            resolved = true;
            reject(new Error("Stream ended before a result was received."));
            cleanup();
        });

    } catch(e) {
        if (resolved) return;
        reject(new Error("Failed to connect to the external service."));
    }
  });
}; 