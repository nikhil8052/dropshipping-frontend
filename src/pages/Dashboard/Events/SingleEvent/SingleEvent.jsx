import 'react-quill/dist/quill.snow.css';
import record from '@icons/record.svg';
import blueLink from '@icons/blueLink.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CaretLeft from '@icons/CaretLeft.svg';
import { useEffect, useState } from 'react';
import axiosWrapper from '@utils/api';
import Loading from '@components/Loading/Loading';
import { API_URL } from '@utils/apiUrl';
import '../../../../styles/Events.scss';
import '../../../../styles/Common.scss';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '../../../../utils/utils';
import { formatTimezone, trimLongText } from '../../../../utils/common';

const SingleEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const token = useSelector((state) => state?.auth?.userToken);
    const [loading, setLoading] = useState(false);
    const eventId = location.state?.eventId;
    const [event, setEventData] = useState(null);

    useEffect(() => {
        if (eventId) {
            getEventDetails(eventId);
        }
    }, [eventId]);

    const getEventDetails = async (id) => {
        try {
            setLoading(true);
            const url = role === 'student' ? API_URL.GET_EVENT_BY_ID_FOR_STUDENT : API_URL.GET_EVENT;
            const response = await axiosWrapper('GET', url.replace(':id', id), {}, token);
            const event = response.data;

            setEventData(event);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="single-event-wrapper">
            {loading ? (
                <Loading centered={true} />
            ) : (
                <>
                    {event && (
                        <Row>
                            <Col>
                                <Button
                                    className="submit-btn d-flex align-items-center mb-2"
                                    onClick={() =>
                                        navigate(role === 'student' ? `/${role}/events/listing` : `/${role}/events`)
                                    }
                                >
                                    <img src={CaretLeft} alt="CaretLeft" className="me-2" /> Back
                                </Button>
                            </Col>
                        </Row>
                    )}

                    <Card className="card-custom event-detail-card">
                        <Card.Header className="card-header-custom">
                            <div className="card-profile-img">
                                {event?.createdBy?.name
                                    .split(' ')
                                    .map((n, index) => (index === 0 || index === 1 ? n[0] : null))
                                    .filter((v) => !!v)}
                            </div>
                            <div>
                                <div className="meeting-title text-capitalize">
                                    {event?.createdBy?.name} ({capitalizeFirstLetter(event?.createdBy?.role)})
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <span className="main-title"> Topic:</span>{' '}
                                <span className="topic-detail">{event?.topic}</span>
                            </Card.Title>
                            <Card.Text className="meeting-time text-center">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Date & Time:</strong> <span> {formatTimezone(event?.dateTime)}</span>
                                    </div>
                                    <div>
                                        <Button
                                            variant="primary"
                                            className={`zoom-btn ${role !== 'student' ? 'w-100' : ''}`}
                                        >
                                            <img src={blueLink} alt="" /> |{' '}
                                            {event?.typeOfEvent === 'ONLINE' ? event?.meetingLink : event?.location}
                                        </Button>
                                    </div>
                                </div>
                            </Card.Text>
                            <Row className="my-3">
                                {role === 'student' && event?.zoomMeetingDetails && (
                                    <Col>
                                        <Row className="justify-content-start">
                                            <Col lg={2}>
                                                <img src={record} alt="record" className="me-5" />{' '}
                                            </Col>
                                            <Col>
                                                <strong>[Recording] Meeting Held at Feb 2, 2024 at</strong>
                                                <div className="recording-date"> {formatTimezone(event?.dateTime)}</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                )}
                                <Col>
                                    <div className="d-flex justify-content-end">
                                        <div className="personal-meeting-btn d-flex">
                                            <div className="d-flex profile-icon">
                                                {event?.createdBy?.avatar ? (
                                                    <img src={event?.createdBy?.avatar} alt="Event Host Avatar" />
                                                ) : (
                                                    <FontAwesomeIcon
                                                        size="2xl"
                                                        icon={faCircleUser}
                                                        color="rgba(200, 202, 216, 1)"
                                                    />
                                                )}
                                                <div>
                                                    <h1>{trimLongText(event?.createdBy?.name)}</h1>
                                                    <p>Host</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {!event?.zoomMeetingDetails && (
                                <p className="text-danger text-center">Meeting Details on zoom not found</p>
                            )}

                            {role === 'student' ? (
                                <>
                                    {event?.zoomMeetingDetails && (
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
                                    )}
                                </>
                            ) : (
                                <div className="event-detail-footer">
                                    <button
                                        type="button"
                                        className="edit"
                                        onClick={() =>
                                            navigate(`/${role}/events/edit`, {
                                                state: {
                                                    eventId: event?._id
                                                }
                                            })
                                        }
                                    >
                                        Edit
                                    </button>
                                    <a
                                        href={event?.typeOfEvent === 'ONLINE' ? event?.meetingLink : event?.location}
                                        type="button"
                                        target="_blank"
                                        className="join"
                                        rel="noreferrer"
                                    >
                                        Join Meeting
                                    </a>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </>
            )}
        </div>
    );
};
export default SingleEvent;
