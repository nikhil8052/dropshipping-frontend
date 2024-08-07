import { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import BigCalender from '../../Dashboard/Calender/BigCalender';
import { eventsAndMeetings } from '../../../../data/data';
import MeetingCard from '../../../../components/MeetingCard/MeetingCard';
import axiosWrapper from '@utils/api';
import { API_URL } from '@utils/apiUrl';
import Loading from '../../../../components/Loading/Loading';
import { useSelector } from 'react-redux';
import '../../../../styles/Events.scss';

function EventPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [eventsData, setEventsData] = useState([]);
    const token = useSelector((state) => state?.auth?.userToken);

    const events = eventsAndMeetings.map((meeting) => ({
        id: meeting.id,
        title: meeting.title,
        start: meeting.start,
        end: meeting.end,
        topic: meeting.topic
    }));

    const handleEventClick = (event) => {
        getEventDetails(event.id);
    };

    const handleGoogleCalendarClick = () => {};

    useEffect(() => {
        fetchData();
    }, []);

    ////////////////// Handlers ////////////////////
    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);
            const events = await axiosWrapper('GET', API_URL.GET_ALL_EVENTS_FOR_STUDENT, {}, token);
            const mappedEvents = events?.data?.data?.map((event) => ({
                id: event?._id,
                title: event?.topic,
                start: new Date(event.dateTime),
                end: new Date(event.dateTime),
                topic: event?.topic
            }));

            setEventsData(mappedEvents);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const getEventDetails = async (id) => {
        try {
            setLoading(true);
            const response = await axiosWrapper(
                'GET',
                API_URL.GET_EVENT_BY_ID_FOR_STUDENT.replace(':id', id),
                {},
                token
            );
            const event = response.data;
            setSelectedEvent(event);
            setShowModal(true);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="events-listing-wrapper">
            {loading ? (
                <Loading centered={true} />
            ) : (
                <Row className="w-100">
                    <Col>
                        <BigCalender
                            events={eventsData && eventsData?.length > 0 ? eventsData : events}
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
            )}
        </div>
    );
}

EventPage.propTypes = {};

export default EventPage;
