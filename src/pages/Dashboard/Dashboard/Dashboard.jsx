import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import Card from '@components/Card/Card';
import { StatCard, LineChart } from '@components/Home';
import GreenDot from '@icons/dot-green.svg';
import BlueDot from '@icons/dot-blue.svg';
import { Helmet } from 'react-helmet';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { events } from '../../../data/data';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addHours, isAfter, isBefore } from 'date-fns';
import { Dropdown } from 'react-bootstrap';

const locales = {
    'en-US': enUS
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const Dashboard = () => {
    const chartRef = useRef(null);
    const [chartKey, setChartKey] = useState('students');
    const [chartHeight, setChartHeight] = useState(70);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, []);
    // Set the height of the chart on tab change
    useEffect(() => {
        if (chartKey) {
            setChartHeight(330);
        }
    }, [chartKey]);
    const statCards = [
        {
            id: 1,
            title: 'Low Ticket Students Available',
            value: '7,265'
        },
        {
            id: 2,
            title: 'High Ticket Students Available',
            value: '3,671'
        },
        {
            id: 3,
            title: 'Courses',
            value: '156'
        },
        {
            id: 4,
            title: 'Upcoming Events',
            value: '2,318'
        }
    ];
    // Line Chart data
    const data = {
        datasets: {
            students: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Total Students',
                        data: [10000, 12000, 15000, 13000, 16000, 18000, 17000],
                        fill: true,
                        backgroundColor: 'rgba(133, 193, 233, 0.5)',
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.4
                    }
                ]
            },
            coaches: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Total Coaches',
                        data: [5000, 7000, 6000, 8000, 7500, 9000, 8500],
                        fill: true,
                        backgroundColor: 'rgba(233, 193, 133, 0.5)', // Different color
                        borderColor: 'rgb(192, 75, 192)', // Another color
                        tension: 0.4
                    }
                ]
            }
        }
    };
    const options = {
        maintainAspectRatio: true,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        elements: {
            line: {
                fill: true
            }
        }
    };

    const tabTitles = {
        students: 'Total Students',
        coaches: 'Total Coaches'
    };

    const timePeriods = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Yearly', value: 'yearly' }
    ];

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

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const EventComponent = ({ event, title }) => {
        const now = new Date();
        const soon = addHours(now, 1);

        // Determine if the event is active or upcoming
        const isActiveEvent = (isAfter(now, event.start) && isBefore(now, event.end)) || isBefore(event.start, soon);
        const eventClass = isActiveEvent ? 'active-event' : 'future-event';

        return (
            <div onClick={() => handleEventClick(event)} className={`rbc-event ${eventClass}`}>
                <div className="rbc-event-content">
                    <p>
                        <img className="me-2 mb-1" src={isActiveEvent ? GreenDot : BlueDot} alt="" /> {title}
                    </p>
                </div>
            </div>
        );
    };

    const CustomHeader = ({ label, date }) => {
        const todayDate = date.getDate();
        return (
            <div className="rbc-header">
                <div className="rbc-row">
                    <div className="rbc-header-label">
                        {label} {todayDate}{' '}
                    </div>
                </div>
            </div>
        );
    };

    const CustomToolbar = (toolbar) => {
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
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {toolbar.label}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="month">Month</Dropdown.Item>
                            <Dropdown.Item eventKey="week">Week</Dropdown.Item>
                            <Dropdown.Item eventKey="day">Day</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </span>
            </div>
        );
    };

    const eventStyleGetter = (event, start, end) => {
        const now = new Date();
        const style = {
            backgroundColor: isBefore(end, now) ? '#d6d6d6' : isAfter(start, now) ? '#7dba7d' : '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    return (
        <div className="dashboard-page">
            <Helmet>
                <title>Dashboard | Drop Ship Academy</title>
            </Helmet>
            <Row>
                {statCards.map((stat, index) => (
                    <Col key={stat.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                        <Card
                            customCardClass={`custom-card-colors ${index % 2 === 0 ? 'even' : 'odd'}`}
                            cardType="small"
                        >
                            <StatCard {...stat} />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className="graph-wrapper">
                <Col>
                    <LineChart
                        data={data}
                        options={options}
                        chartKey={chartKey}
                        setChartKey={setChartKey}
                        tabTitles={tabTitles}
                        timePeriods={timePeriods}
                        chartHeight={chartHeight}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card header={true} title="Events" customCardClass="events-card">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            views={['day', 'week', 'month']}
                            step={60}
                            showMultiDayTimes
                            defaultDate={new Date()}
                            defaultView="month"
                            formats={{
                                dayFormat: (date, culture, localizer) => localizer.format(date, 'EEE MMM dd', culture),
                                weekdayFormat: (date, culture, localizer) => localizer.format(date, 'EEEE', culture)
                            }}
                            eventPropGetter={eventStyleGetter}
                            components={{
                                month: {
                                    event: EventComponent
                                },
                                header: CustomHeader,
                                toolbar: CustomToolbar
                            }}
                        />
                        <EventDetailsModal
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            event={{
                                coachName: 'Ada Guyen',
                                coachInitials: 'AG',
                                meetingId: '226326',
                                password: '4K22MJ7',
                                description: 'Detailed meeting about the new course descriptions, their time frame.',
                                dateTime: 'Feb 2, 2024 19:28 Central Standard Time (GMT-6)',
                                attendeesCount: '15'
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
