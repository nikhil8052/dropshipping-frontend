import { formatDate } from '../../utils/common';

const DateRenderer = ({ value }) => {
    return <div>{formatDate(value)}</div>;
};

export default DateRenderer;
