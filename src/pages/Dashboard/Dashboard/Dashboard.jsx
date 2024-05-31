/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import Card from '@components/Card/Card';
import { StatCard, LineChart } from '@components/Home';
import { Helmet } from 'react-helmet';
import EventDetailsModal from './Calender/CustomEventModal';
import BigCalender from './Calender/BigCalender';
import { useSelector } from 'react-redux';
import { events, meetings } from '../../../data/data';
import '../../../styles/Dashboard.scss';
import { useIsSmallScreen } from '../../../utils/mediaQueries';
import MeetingCard from '../../../components/MeetingCard/MeetingCard';

const Dashboard = () => {
    const chartRef = useRef(null);
    const [chartKey, setChartKey] = useState('students');
    const [chartHeight, setChartHeight] = useState(50);
    const [showModal, setShowModal] = useState(false);
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const [cardStats, setCardStats] = useState([]);
    const [lineGraphData, setLineGraphData] = useState([{ datasets: [] }]);
    const [dataSet, setDataSet] = useState(false);
    const isSmallScreen = useIsSmallScreen();
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
            isSmallScreen ? setChartHeight(200) : setChartHeight(80);
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
    const coachStatCards = [
        {
            id: 1,
            title: 'Total Students',
            value: '7,265'
        },
        {
            id: 2,
            title: 'Spots Available',
            value: '15'
        },
        {
            id: 3,
            title: 'Coaching calls scheduled',
            value: '2365'
        },
        {
            id: 4,
            title: 'Revenue',
            value: '2,318'
        }
    ];
    const sampleData = [5000, 22200, 6000, 20000, 7500, 28000, 8500];

    // Line Chart data
    const data = {
        datasets: {
            students: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Total Students',
                        data: sampleData,
                        fill: true,
                        backgroundColor: 'rgba(133, 193, 233, 0.5)',
                        borderColor: 'rgba(0, 0, 0, 0.4)',
                        tension: 0.4
                    }
                ]
            },
            coaches: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Total Coaches',
                        data: sampleData,
                        fill: true,
                        backgroundColor: 'rgba(233, 193, 133, 0.5)', // Different color
                        borderColor: 'rgba(0, 0, 0, 0.4)', // Another color
                        tension: 0.4
                    }
                ]
            }
        }
    };

    const coachData = {
        datasets: [
            {
                label: 'Hours Worked',
                borderColor: 'rgba(0, 0, 0, 0.4)',
                pointRadius: 0,
                fill: true,
                backgroundColor: 'yellow',
                lineTension: 0.4,
                data: sampleData,
                borderWidth: 1
            }
        ]
    };
    const graphOptions = {
        scales: {
            x: {
                grid: {
                    display: false
                },
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                ticks: {
                    color: 'rgba(28, 28, 28, 0.4)'
                },
                border: {
                    display: false
                }
            },
            y: {
                beginAtZero: true, // Ensures the scale starts at 0
                grid: {
                    display: false
                },
                border: {
                    display: false
                },
                ticks: {
                    stepSize: 10000, // Set steps of 10,000
                    callback: function (value, index, values) {
                        // Optional: format ticks to show 'k' (e.g., 10k, 20k)
                        return value === 0 ? '0' : value / 1000 + 'k';
                    },
                    color: 'rgba(28, 28, 28, 0.4)'
                },
                min: 0, // Minimum value for Y-axis
                max: 30000 // Maximum value for Y-axis
            }
        },
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: false // Set to true if you want a title, and provide a title text
            }
        },
        elements: {
            line: {
                fill: true // Controls if the area under the line should be filled
            }
        }
    };

    useEffect(() => {
        if (role === 'admin') {
            setCardStats(statCards);
            setLineGraphData(data);
            setDataSet(true);
        } else if (role === 'coach') {
            setCardStats(coachStatCards);
            setDataSet(false);
            setLineGraphData(coachData);
        }
    }, [role]);

    const tabTitles = {
        students: 'Total Students',
        coaches: 'Total Coaches'
    };

    const timePeriods = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Yearly', value: 'yearly' }
    ];

    const handleEventClick = (event) => {
        const meeting = meetings.find((meeting) => meeting.id === event.id);
        setSelectedEvent(meeting);
        // We can define a state later for the selected event
        setShowModal(true);
    };

    return (
        <div className="dashboard-page">
            <Helmet>
                <title>Dashboard | Dropship Academy</title>
            </Helmet>
            <Row>
                {cardStats.map((stat, index) => (
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
                    {lineGraphData && lineGraphData.datasets && (
                        <LineChart
                            data={lineGraphData}
                            options={graphOptions}
                            chartKey={chartKey}
                            setChartKey={setChartKey}
                            tabTitles={tabTitles}
                            timePeriods={timePeriods}
                            chartHeight={chartHeight}
                            dataSet={dataSet}
                            role={role}
                        />
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card header={true} title="Events" customCardClass="events-card">
                        <BigCalender onEventClick={(event) => handleEventClick(event)} events={events} />
                        {/* <EventDetailsModal
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
                        /> */}
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
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
