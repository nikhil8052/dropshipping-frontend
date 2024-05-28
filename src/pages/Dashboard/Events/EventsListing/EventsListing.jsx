import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, Form, InputGroup, Row } from 'react-bootstrap';
import Search from '@icons/Search.svg';
import calendar from '@icons/calendar.svg';
import { meetings } from '../../../../data/data';
import MeetingCard from '@components/MeetingCard/MeetingCard';
import Pagination from '@components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import '../../../../styles/Events.scss';

const EventsListing = () => {
    const [selectedOption, setSelectedOption] = useState('All Events');
    const options = ['All Events', 'Upcoming Events', 'Previous Events'];
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsData, setEventData] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        setEventData(meetings);
    }, []);

    const itemsPerPage = 6;

    const totalPages = Math.ceil(eventsData.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Get current items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = eventsData.slice(indexOfFirstItem, indexOfLastItem);

    const handleCardClick = (data) => {
        setSelectedEvent(data);
    };

    useEffect(() => {
        if (selectedEvent?.id) {
            // Redirect to event details page
            navigate('/student/events/detail', { state: { event: selectedEvent } });
        }
    }, [selectedEvent?.id]);

    return (
        <div className="events-listing-wrapper">
            <Row className="mb-3 justify-content-between">
                <Col lg={4}>
                    <InputGroup>
                        <InputGroup.Text>
                            <img src={Search} alt="Search" />
                        </InputGroup.Text>
                        <Form.Control
                            className="search-input"
                            type="text"
                            name="Search"
                            label="Search"
                            placeholder="Search"
                        />
                    </InputGroup>
                </Col>
                <Col lg={4}>
                    <div className="d-flex justify-content-end">
                        <Button className="google-calendar-btn">
                            <img src={calendar} alt="calendar" className="me-2" /> Google Calendar
                        </Button>
                        <Dropdown className="dropdown-button-fix ms-3">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <span className="me-2">{selectedOption}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {options.map((option) => (
                                    <Dropdown.Item
                                        key={option}
                                        onClick={() => handleOptionChange(option)}
                                        eventKey={option}
                                    >
                                        <span className="event-name">{option}</span>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>

            <Row>
                {currentItems.map((meeting) => (
                    <Col key={meeting.id} xs={12} sm={6} md={12} lg={6} xl={4} className="mb-4">
                        <MeetingCard meeting={meeting} handleCardClick={handleCardClick} />
                    </Col>
                ))}
            </Row>
            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default EventsListing;
