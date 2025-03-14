import { Button, Dropdown } from 'react-bootstrap';
import calendar from '@icons/calendar.svg';
import { useNavigate } from 'react-router-dom';
const CustomToolbar = (toolbar) => {
    const navigate = useNavigate();

    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToToday = () => {
        toolbar.onNavigate('TODAY');
    };

    const handleViewChange = (eventKey) => {
        toolbar.onView(eventKey);
    };

    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <Button onClick={goToToday}>Today</Button>
                <Button onClick={goToBack}>Back</Button>
                <Button onClick={goToNext}>Next</Button>
            </span>
            <span className="rbc-toolbar-right">
                <Dropdown onSelect={handleViewChange}>
                    {toolbar.googleCalendar && (
                        <>
                            <Button onClick={() => navigate('/student/events/listing')}>See All Events</Button>
                            <Button onClick={toolbar.handleGoogleCalendarClick}>
                                <img src={calendar} alt="calendar" className="me-2" /> Google Calendar
                            </Button>
                        </>
                    )}
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {toolbar.label}
                    </Dropdown.Toggle>
                    {/* <Dropdown.Menu>
                        <Dropdown.Item eventKey="month">Month</Dropdown.Item>
                        <Dropdown.Item eventKey="week">Week</Dropdown.Item>
                        <Dropdown.Item eventKey="day">Day</Dropdown.Item>
                    </Dropdown.Menu> */}
                </Dropdown>
            </span>
        </div>
    );
};

export default CustomToolbar;
