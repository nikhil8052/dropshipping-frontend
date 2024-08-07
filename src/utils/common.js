import { format } from 'date-fns';

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

export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
};

// Helper function to get formatted start and end times from an ISO date-time string
export const getFormattedTimes = (dateTime, durationInHours = 2) => {
    if (!dateTime) return { startTime: '', endTime: '' };

    const eventDate = new Date(dateTime);
    const startTime = format(eventDate, 'h:mm a');

    // Calculate end time based on duration
    const endTimeDate = new Date(eventDate.getTime() + durationInHours * 60 * 60 * 1000);
    const endTime = format(endTimeDate, 'h:mm a');

    return { startTime, endTime };
};
