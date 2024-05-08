/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@components/Card/Card';
import { StatCard, LineChart } from '@components/Home';
import { Helmet } from 'react-helmet';
import EventDetailsModal from './Calender/CustomEventModal';
import BigCalender from './Calender/BigCalender';

const Dashboard = () => {
    const chartRef = useRef(null);
    const [chartKey, setChartKey] = useState('students');
    const [chartHeight, setChartHeight] = useState(70);
    const [showModal, setShowModal] = useState(false);

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

    const handleEventClick = () => {
        // We can define a state later for the selected event
        setShowModal(true);
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
                        <BigCalender onEventClick={(event) => handleEventClick(event)} />
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
