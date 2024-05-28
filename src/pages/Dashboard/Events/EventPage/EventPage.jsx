import { useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import BigCalender from '../../Dashboard/Calender/BigCalender';
import { eventsAndMeetings } from '../../../../data/data';
import MeetingCard from '../../../../components/MeetingCard/MeetingCard';
import '../../../../styles/Events.scss';

function EventPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const events = eventsAndMeetings.map((meeting) => ({
        id: meeting.id,
        title: meeting.title,
        start: meeting.start,
        end: meeting.end,
        topic: meeting.topic
    }));

    const meetings = eventsAndMeetings.map((meeting) => ({
        id: meeting.id,
        name: meeting.name,
        role: meeting.role,
        meetingId: meeting.meetingId,
        password: meeting.password,
        topic: meeting.topic,
        dateTime: meeting.dateTime,
        timeZone: meeting.timeZone,
        attendees: meeting.attendees,
        attendeesCount: meeting.attendeesCount,
        image: meeting.image
    }));

    const handleEventClick = (event) => {
        const meeting = meetings.find((meeting) => meeting.id === event.id);
        setSelectedEvent(meeting);
        setShowModal(true);
    };

    const handleGoogleCalendarClick = () => {};

    return (
        <div className="events-listing-wrapper">
            <Row className="w-100">
                <Col>
                    <BigCalender
                        events={events}
                        onEventClick={handleEventClick}
                        googleCalendar={true}
                        handleGoogleCalendarClick={handleGoogleCalendarClick}
                        calendarHeight={'calc(100vh - 200px)'}
                    />
                    <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header style={{ borderBottom: 'none' }} closeButton></Modal.Header>
                        <MeetingCard meeting={selectedEvent} />
                    </Modal>
                </Col>
            </Row>
        </div>
    );
}

EventPage.propTypes = {};

export default EventPage;
