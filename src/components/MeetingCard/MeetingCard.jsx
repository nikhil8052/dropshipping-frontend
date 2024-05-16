import { Button, Card, Image } from 'react-bootstrap';
import './MeetingCard.scss';
import ethereum from '@icons/icons8-ethereum 1.svg';
import AvatarGroup from '../AvatarGroup/AvatarGroup';

const MeetingCard = ({ meeting, handleCardClick }) => {
    return (
        <Card className="card-custom" onClick={() => handleCardClick(meeting)}>
            <Card.Header className="card-header-custom">
                <Image src={meeting.image} rounded className="image-custom" />
                <div>
                    <div className="meeting-title">
                        {meeting.name} ({meeting.title})
                    </div>
                    <div className="meeting-id">Meeting ID: {meeting.meetingId}</div>
                    <div className="meeting-password">Password: {meeting.password}</div>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Title>
                    <span className="main-title"> Topic:</span> <span className="topic-detail">{meeting.topic}</span>
                </Card.Title>
                <Card.Text className="meeting-time">
                    <strong>Date & Time:</strong> <span> {meeting.dateTime}</span>
                    <p>{meeting.timeZone}</p>
                </Card.Text>
                <Card.Text className="footer-title">
                    <img src={ethereum} alt="" /> Attendees
                </Card.Text>
            </Card.Body>
            <Card.Footer className="card-footer-custom">
                <AvatarGroup
                    attendees={meeting.attendees.slice(0, 3)}
                    count={`${meeting.attendees.slice(3, meeting.attendees.length).length}+`}
                />
                <Button variant="primary">Join</Button>
            </Card.Footer>
        </Card>
    );
};

export default MeetingCard;
