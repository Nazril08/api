import CryptoJS from 'crypto-js';
import axios from 'axios';

const decrypt = (encryptedText) => {
    const webSecretKey = "ecHyOABV9jgO2/+dzE49cfexQpr/H4SiAYWrHLD7PQ0=";
    const webInitializationVector = "Gu3qsglYJhOOm0eXf6aN2w==";

    const secretKey = CryptoJS.enc.Base64.parse(webSecretKey);
    const initializationVector = CryptoJS.enc.Base64.parse(webInitializationVector);
    const wordArray = CryptoJS.AES.decrypt(encryptedText, secretKey, {
        iv : initializationVector
    });
    const decryptedText = wordArray.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
};

export async function searchPddikti(query) {
    try {
        if (!query || query.length === 0) throw new Error("Query cannot be empty.");
        
        const api = "https://api-pddikti.kemdiktisaintek.go.id/pencarian/enc/all/";
        const response = await axios.get(api + encodeURIComponent(query), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        });
        
        const encryptedData = response.data;
        const data = decrypt(encryptedData);
        
        if (data.mahasiswa === null && data.pt === null && data.prodi === null) {
            throw new Error(`No results found for query: ${query}`);
        }
        
        return data;

    } catch (err) {
        if (err.response) {
            console.error('Error Response Data:', err.response.data);
            throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        }
        throw new Error(err.message);
    }
} 