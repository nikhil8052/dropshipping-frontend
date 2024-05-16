import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import record from '@icons/record.svg';
import blueLink from '@icons/blueLink.svg';
import dotOptions from '@icons/dot-options.svg';
import { useLocation } from 'react-router-dom';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import AvatarGroup from '../../../../components/AvatarGroup/AvatarGroup';

const SingleEvent = () => {
    const location = useLocation();
    const meeting = location.state?.event;
    const [showModal, setShowModal] = useState(false);
    const [remainingAttendees, setRemainingAttendees] = useState([]);
    const handleCountClick = () => {
        setShowModal(true);

        setRemainingAttendees([
            'https://randomuser.me/api/portraits/men/5.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg'
        ]);
    };

    return (
        <Card className="card-custom event-detail-card">
            <Card.Header className="card-header-custom">
                <div className="card-profile-img">
                    {meeting.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                </div>
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
                <Card.Text className="meeting-time text-center">
                    <strong>Date & Time:</strong> <span> {meeting.dateTime}</span>
                    <p>{meeting.timeZone}</p>
                </Card.Text>
                <Row className="my-3">
                    <Col>
                        <Row className="justify-content-start">
                            <Col lg={2}>
                                <img src={record} alt="record" className="me-5" />{' '}
                            </Col>
                            <Col>
                                <strong>[Recording] Meeting Held at Feb 2, 2024 at</strong>
                                <div className="recording-date"> {meeting.dateTime}</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <div className="d-flex justify-content-end">
                                    <AvatarGroup
                                        attendees={meeting.attendees.slice(0, 3)}
                                        count={`${meeting.attendees.slice(3, meeting.attendees.length).length}+`}
                                        handleCountClick={handleCountClick}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <Button variant="primary" className="zoom-btn">
                                    <img src={blueLink} alt="" /> | https://zoom.us/j/
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <div className="d-flex justify-content-end">
                            <div className="personal-meeting-btn d-flex">
                                <div className="d-flex profile-icon">
                                    <img src={meeting.image} alt="icon" />
                                    <div>
                                        <h1>{meeting.name}</h1>
                                        <p>Host</p>
                                    </div>
                                </div>

                                <img src={dotOptions} alt="dotOptions" className="dotOptions" />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <iframe
                            src="https://www.youtube.com/embed/rqGNDT_utao"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="video-iframe w-100"
                            height={400}
                        ></iframe>
                    </Col>
                </Row>
                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header style={{ borderBottom: 'none' }} closeButton>
                        Attendees ({remainingAttendees.length})
                    </Modal.Header>
                    <Modal.Body>
                        <div
                            className="d-flex flex-column gap-2"
                            style={{
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}
                        >
                            {remainingAttendees.map((attendee, index) => (
                                <div key={index}>
                                    <img className="avatar" src={attendee} alt={`Profile ${index + 1}`} />
                                    <span>Drew Cana</span>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    );
};
export default SingleEvent;
