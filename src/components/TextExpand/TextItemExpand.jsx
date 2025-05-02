import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import userImg from '../../assets/images/userImg.svg'
const TextItemExpand = ({ value = '--', ...rest }) => {
    return (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">{value}</Tooltip>}>
            <div className="d-flex align-items-center gap-2">
                {rest.data.avatar ? (
                    <img src={rest.data.avatar} alt={rest.data.name} className="avatar-image" />
                ) : (
                    // <FontAwesomeIcon size="2xl" icon={faCircleUser} color="rgba(200, 202, 216, 1)" />
                    <img src={userImg} alt={userImg} className="avatar-image" />
                )}
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
            </div>
        </OverlayTrigger>
    );
};

export default TextItemExpand;
