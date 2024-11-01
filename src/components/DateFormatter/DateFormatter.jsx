import { formatTimezone } from '../../utils/common';

const DateRenderer = ({ value = '--' }) => {
    return <div>{formatTimezone(value)}</div>;
};

export default DateRenderer;
