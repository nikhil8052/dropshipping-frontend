import { OverlayTrigger, Tooltip } from 'react-bootstrap';
const TextExpand = ({ value }) => {
    return (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">{value}</Tooltip>}>
            <div
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'inline-block',
                    maxWidth: '150px' // Adjust as necessary
                }}
            >
                {value}
            </div>
        </OverlayTrigger>
    );
};

export default TextExpand;
