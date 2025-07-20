import axios from 'axios';
import * as cheerio from 'cheerio';
import FormData from 'form-data';

export async function ccgenerator(bin) {
    try {
        const _bin = ['Visa', 'MasterCard', 'Amex', 'CUP', 'JCB', 'Diners', 'RuPay'];
        if (!_bin.includes(bin)) throw new Error(`Available bins: ${_bin.join(', ')}`);
        
        const form = new FormData();
        form.append('bin', bin);
        form.append('generate', '');
        const { data } = await axios.post('https://neapay.com/online-tools/credit-card-number-generator-validator.html', form, {
            headers: form.getHeaders()
        });
        const $ = cheerio.load(data);
        
        return {
            cardNumber: $('.card-front pre').eq(0).text().trim() || null,
            expirationDate: $('.card-front pre').eq(1).text().trim() || null,
            name: $('.card-front pre').eq(2).text().trim() || null,
            cvv: $('.card-back pre').eq(0).text().trim()
        };
    } catch (error) {
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            throw new Error(`External API Error: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(error.message);
    }
} 