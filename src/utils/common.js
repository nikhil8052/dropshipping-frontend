export function formatDate(value) {
    if (value) {
        const dateInUtc = new Date(value);
        const formatter = new Intl.DatetimeDuration('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return formatter.format(dateInUtc).split('/').reverse().join('-');
    }
    return null;
}
export const roles = ['admin', 'coach', 'student', 'public'];

const longTextLimit = 10;
export const trimLongText = (text, textLength = longTextLimit) => {
    let finalText = text;
    if (text?.length > textLength) {
        finalText = `${text?.substr(0, textLength)}...`;
    }
    return finalText;
};
