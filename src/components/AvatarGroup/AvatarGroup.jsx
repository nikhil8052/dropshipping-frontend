import PropTypes from 'prop-types';
import './AvatarGroup.scss';

const AvatarGroup = ({ count, attendees }) => {
    return (
        <div className="avatarGroup">
            <div className="avatarGroup_wrapper">
                {attendees.map((attendee, index) => {
                    return (
                        <div key={index} className="avatarGroup_wrapper-avatar">
                            <img src={attendee} alt="" />
                        </div>
                    );
                })}
                <div className="avatarGroup_wrapper-avatar">
                    <span>{count}</span>
                </div>
            </div>
        </div>
    );
};

AvatarGroup.propTypes = {
    count: PropTypes.string.isRequired,
    attendees: PropTypes.array.isRequired
};

export default AvatarGroup;
