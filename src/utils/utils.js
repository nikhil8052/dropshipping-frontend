import axios from 'axios';

export const getFileObjectFromBlobUrl = async (blobUrl, fileName) => {
    const config = { responseType: 'blob' };
    const response = await axios.get(blobUrl, config);
    const file = new File([response.data], fileName, { type: 'image/jpeg' });
    return file;
};
