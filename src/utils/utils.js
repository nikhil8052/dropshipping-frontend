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
