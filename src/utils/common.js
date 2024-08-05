export function formatDate(value) {
    if (value) {
        const dateInUtc = new Date(value);
        const formatter = new Intl.DateTimeFormat('nl-NL', {
            timeZone: 'Europe/Amsterdam',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return formatter.format(dateInUtc).split('-').join('-');
    }
    return null;
}

export const roles = ['ADMIN', 'COACH', 'STUDENT', 'public'];

const longTextLimit = 10;
export const trimLongText = (text, textLength = longTextLimit) => {
    let finalText = text;
    if (text?.length > textLength) {
        finalText = `${text?.substr(0, textLength)}...`;
    }
    return finalText;
};

export const zoneDate = (timestamp, timeZone) => {
    const options = {
        timeZone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(parseInt(timestamp)));
};
export const formatTimeZone = () => {
    const options = { timeZoneName: 'long' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.formatToParts().find((part) => part.type === 'timeZoneName').value;
};
