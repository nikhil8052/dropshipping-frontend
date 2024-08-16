import { formatDateWithDateFnsInNetherlandsTimezone } from '../../utils/common';

const DateRenderer = ({ value }) => {
    return <div>{formatDateWithDateFnsInNetherlandsTimezone(value)}</div>;
};

export default DateRenderer;
