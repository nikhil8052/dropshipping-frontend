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
export const getFormattedTimes = (dateTime, durationInHours = 1) => {
    if (!dateTime) return { startTime: '', endTime: '' };

    const eventDate = new Date(dateTime);
    const startTime = format(eventDate, 'h:mm a');

    // Calculate end time based on duration
    const endTimeDate = new Date(eventDate.getTime() + durationInHours * 60 * 60 * 1000);
    const endTime = format(endTimeDate, 'h:mm a');

    return { startTime, endTime };
};

export const convertCamelCaseToTitle = (str) => {
    // Insert a space before all capital letters
    const result = str.replace(/([A-Z])/g, ' $1');
    // Capitalize the first letter of the resulting string
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
};

export const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const currentDate = new Date().toISOString().slice(0, 16);
// Calculate one year later
const oneYearLater = new Date();
oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
export const oneYearsLater = oneYearLater.toISOString().slice(0, 16);

export const formatTimezone = (dateStr, timeZoneName = false) => {
    const date = new Date(dateStr);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        timeZone: 'Europe/Amsterdam',
        timeZoneName: timeZoneName ? 'longGeneric' : undefined
    };

    const formattedDate = date.toLocaleString('en-US', { ...options });
    // return the time zone name from the formatted date and date
    return formattedDate;
};

export const convertToUTC = (localDateTimeStr) => {
    const localDate = new Date(localDateTimeStr);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
};

export const shuffleArray = (array) => {
    // Create a copy of the array to avoid mutating the original array
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

// Toolbar constants
export const TEXT_FORMATTING = ['bold', 'italic', 'underline', 'strike'];
export const LINK = ['link'];
export const LISTS = [{ list: 'ordered' }, { list: 'bullet' }];

// Aggregated toolbar configuration
export const TOOLBAR_CONFIG = [TEXT_FORMATTING, LINK, LISTS];

// Formats constants
export const FORMATS = ['bold', 'italic', 'underline', 'strike', 'link', 'list', 'bullet'];

export const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;

export const isValidUrl = (url) => {
    try {
        const baseUrl = 'https://';
        const isProperUrl = url.startsWith(baseUrl);
        if (!isProperUrl) return false;
        return true;
    } catch (error) {
        return false;
    }
};

export const precisionRound = (number, precision = 2) => {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};
