import axios from 'axios';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const getFileObjectFromBlobUrl = async (blobUrl, fileName) => {
    const config = { responseType: 'blob' };
    const response = await axios.get(blobUrl, config);
    const file = new File([response.data], fileName, { type: 'image/jpeg' });
    return file;
};

export const generateString = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const capitalizeFirstLetter = (string) =>
    string && string?.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const textParser = (text) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(text, 'text/html');
    const parsed = htmlDoc.body.textContent;
    return parsed;
};

export const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};
