import 'react-quill/dist/quill.snow.css';
import record from '@icons/record.svg';
import blueLink from '@icons/blueLink.svg';
import dotOptions from '@icons/dot-options.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CaretLeft from '@icons/CaretLeft.svg';
import calendar from '@icons/calendar.svg';
import '../../../../styles/Events.scss';
import '../../../../styles/Common.scss';

const SingleEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const meeting = location.state?.event;
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;

    return (
        <div className="single-event-wrapper">
            {meeting && (
                <Row>
                    <Col>
                        <Button
                            className="submit-btn d-flex align-items-center mb-2"
                            onClick={() => navigate(`/${role}/events`)}
                        >
                            <img src={CaretLeft} alt="CaretLeft" className="me-2" /> Back
                        </Button>
                    </Col>
                    <Col>
                        <div className="d-flex justify-content-end">
                            <Button className="google-calendar-btn">
                                <img src={calendar} alt="calendar" className="me-2" /> Google Calendar
                            </Button>
                        </div>
                    </Col>
                </Row>
            )}
            <Card className="card-custom event-detail-card">
                <Card.Header className="card-header-custom">
                    <div className="card-profile-img">
                        {meeting?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                    </div>
                    <div>
                        <div className="meeting-title">
                            {meeting?.name} ({meeting?.title})
                        </div>
                        <div className="meeting-id">Meeting ID: {meeting?.meetingId}</div>
                        <div className="meeting-password">Password: {meeting?.password}</div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <span className="main-title"> Topic:</span>{' '}
                        <span className="topic-detail">{meeting?.topic}</span>
                    </Card.Title>
                    <Card.Text className="meeting-time text-center">
                        <strong>Date & Time:</strong> <span> {meeting?.dateTime}</span>
                        <p>{meeting?.timeZone}</p>
                    </Card.Text>
                    <Row className="my-3">
                        {role === 'student' && (
                            <Col>
                                <Row className="justify-content-start">
                                    <Col lg={2}>
                                        <img src={record} alt="record" className="me-5" />{' '}
                                    </Col>
                                    <Col>
                                        <strong>[Recording] Meeting Held at Feb 2, 2024 at</strong>
                                        <div className="recording-date"> {meeting?.dateTime}</div>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                        <Col>
                            <Button variant="primary" className={`zoom-btn ${role !== 'student' ? 'w-100' : ''}`}>
                                <img src={blueLink} alt="" /> | https://zoom.us/j/
                            </Button>
                        </Col>
                        <Col>
                            <div className="d-flex justify-content-end">
                                <div className="personal-meeting-btn d-flex">
                                    <div className="d-flex profile-icon">
                                        <img src={meeting?.image} alt="icon" />
                                        <div>
                                            <h1>{meeting?.name}</h1>
                                            <p>Host</p>
                                        </div>
                                    </div>

                                    <img src={dotOptions} alt="dotOptions" className="dotOptions" />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {role === 'student' ? (
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
                    ) : (
                        <div className="event-detail-footer">
                            <button
                                type="button"
                                className="edit"
                                onClick={() =>
                                    navigate(`/${role}/events/edit`, {
                                        state: {
                                            eventId: meeting?.id
                                        }
                                    })
                                }
                            >
                                Edit
                            </button>
                            <button type="button" className="join">
                                Join Meeting
                            </button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};
export default SingleEvent;
