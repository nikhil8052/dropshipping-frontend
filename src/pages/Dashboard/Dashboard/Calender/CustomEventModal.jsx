import { Badge, Button, Col, Modal, Row } from 'react-bootstrap';

const EventDetailsModal = ({ show, onHide, event }) => {
    if (!event) return null; // Ensure event data is available

    return (
        <Modal
            className="event-detail-modal"
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Row>
                        <Col>
                            <div className="avatar">{event.coachInitials}</div>
                        </Col>
                        <Col>
                            {event.coachName} (Coach)
                            <div className="meeting-details">
                                Meeting ID: {event.meetingId} <br />
                                Password: {event.password}
                            </div>
                        </Col>
                    </Row>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Topic:</h5>
                <p>{event.description}</p>
                <h5>Date & Time:</h5>
                <p>{event.dateTime}</p>
            </Modal.Body>
            <Modal.Footer>
                <Badge bg="secondary">{event.attendeesCount}+</Badge>
                <Button onClick={onHide}>Join</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EventDetailsModal;
