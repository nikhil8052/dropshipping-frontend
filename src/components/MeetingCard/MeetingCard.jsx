import { Card, Image } from 'react-bootstrap';
import './MeetingCard.scss';
import { formatDateWithDateFnsInNetherlandsTimezone } from '../../utils/common';

const MeetingCard = ({ meeting }) => {
    return (
        <Card className="card-custom">
            <Card.Header className="card-header-custom">
                {meeting?.thumbnail ? (
                    <Image src={meeting?.thumbnail} rounded className="image-custom" />
                ) : (
                    <div className="card-profile-name me-2">
                        {meeting?.createdBy?.name
                            .split(' ')
                            .map((n, index) => (index === 0 || index === 1 ? n[0] : null))
                            .filter((v) => !!v)}
                    </div>
                )}
                <div>
                    <div className="meeting-title">
                        {meeting?.createdBy?.name} ({meeting?.createdBy?.role})
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Title>
                    <span className="main-title"> Topic:</span> <span className="topic-detail">{meeting?.topic}</span>
                </Card.Title>
                <Card.Text className="meeting-time">
                    <strong>Date & Time:</strong>{' '}
                    <span> {formatDateWithDateFnsInNetherlandsTimezone(meeting?.dateTime, true)}</span>
                    <p>Central Standard Time ({meeting?.timeZone})</p>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="card-footer-custom">
                <a href={meeting?.meetingLink} target="_blank" className="join" rel="noreferrer">
                    Join
                </a>
            </Card.Footer>
        </Card>
    );
};

export default MeetingCard;
