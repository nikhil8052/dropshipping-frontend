/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import Card from '@components/Card/Card';
import { StatCard, LineChart } from '@components/Home';
import { Helmet } from 'react-helmet';
import BigCalender from './Calender/BigCalender';
import { useSelector } from 'react-redux';
import '../../../styles/Dashboard.scss';
import { useIsSmallScreen } from '../../../utils/mediaQueries';
import MeetingCard from '../../../components/MeetingCard/MeetingCard';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import Loading from '@components/Loading/Loading';
import { convertCamelCaseToTitle } from '../../../utils/common';

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
    const [currentFilter, setCurrentFilter] = useState('monthly');
    const token = useSelector((state) => state?.auth?.userToken);
    const [gridOptionsLabel, setGridOptionsLabel] = useState();
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (chartKey) {
            isSmallScreen ? setChartHeight(200) : setChartHeight(80);
        }
    }, [chartKey]);

    // Sample data for different time periods
    const monthlyData = [5000, 22200, 6000, 20000, 7500, 28000, 8500];
    const weeklyData = [1000, 5000, 3000, 4000, 2000, 7000, 3500];
    const yearlyData = [12000, 15000, 13000, 19000, 14000, 27000, 15500];

    useEffect(() => {
        fetchDashboardData();
    }, [role, currentFilter]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            let cardData, graphData, eventData;
            if (role === 'ADMIN') {
                cardData = await axiosWrapper('GET', API_URL.GET_ADMIN_CARD_DATA, {}, token);
                graphData = await axiosWrapper(
                    'GET',
                    `${API_URL.GET_ADMIN_GRAPH_DATA}?graphFilter=${currentFilter}`,
                    {},
                    token
                );
                eventData = await axiosWrapper('GET', API_URL.GET_ADMIN_EVENTS_DATA, {}, token);
                setDataSet(true);
            }

            if (role === 'COACH') {
                cardData = await axiosWrapper('GET', API_URL.GET_COACH_CARD_DATA, {}, token);
                graphData = await axiosWrapper(
                    'GET',
                    API_URL.GET_COACH_GRAPH_DATA,
                    { graphFilter: currentFilter },
                    token
                );
                eventData = await axiosWrapper('GET', API_URL.GET_COACH_EVENTS_DATA, {}, token);
                setDataSet(false);
            }
            // Map the data to the format required by the StatCard component
            const mapCards = Object.entries(cardData?.data).map(([key, value], index) => ({
                id: index,
                title: convertCamelCaseToTitle(key),
                value
            }));

            const mappedEvents = eventData?.data?.map((event) => ({
                id: event?._id,
                title: event?.topic,
                start: new Date(event.dateTime),
                end: new Date(event.dateTime),
                topic: event?.topic
            }));
            setCardStats(mapCards);
            setEventsData(mappedEvents);
            const data = generateChartData(graphData?.data, currentFilter);

            setLineGraphData(data);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    // Line Chart data
    const generateChartData = (data, filter) => {
        let labels = [];
        let datasets = [];
        if (filter === 'yearly' || filter === 'monthly') {
            labels = data?.totalStudentsData?.flatMap((obj) => Object.keys(obj));
            datasets = data?.totalStudentsData?.flatMap((obj) => Object.values(obj));
            setGridOptionsLabel(labels);
        }

        if (filter === 'weekly') {
            labels = data?.totalStudentsData?.flatMap((obj) => Object.keys(obj));
            datasets = data?.totalStudentsData?.flatMap((obj) => Object.values(obj));
            setGridOptionsLabel(labels);
        }

        return {
            datasets: {
                students: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Students',
                            data: datasets,
                            fill: true,
                            backgroundColor: 'rgba(133, 193, 233, 0.5)',
                            borderColor: 'rgba(0, 0, 0, 0.4)',
                            tension: 0.4
                        }
                    ]
                },
                coaches: {
                    labels: data?.totalCoachesData?.flatMap((obj) => Object.keys(obj)),
                    datasets: [
                        {
                            label: 'Total Coaches',
                            data: data?.totalCoachesData.flatMap((obj) => Object.values(obj)),
                            fill: true,
                            backgroundColor: 'rgba(233, 193, 133, 0.5)', // Different color
                            borderColor: 'rgba(0, 0, 0, 0.4)', // Another color
                            tension: 0.4
                        }
                    ]
                }
            }
        };
    };

    const graphOptions = {
        scales: {
            x: {
                grid: {
                    display: false
                },
                labels: gridOptionsLabel,
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
                min: 0, // Minimum value for Y-axis
                max: 10 // Maximum value for Y-axis
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

    const tabTitles = {
        students: 'Total Students',
        coaches: 'Total Coaches'
    };

    const timePeriods = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Yearly', value: 'yearly' }
    ];

    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);

        let newData;
        if (filter === 'monthly') {
            newData = generateChartData(monthlyData);
        } else if (filter === 'weekly') {
            newData = generateChartData(weeklyData);
        } else if (filter === 'yearly') {
            newData = generateChartData(yearlyData);
        }

        setLineGraphData(newData);
    };

    const getEventDetails = async (id) => {
        try {
            const response = await axiosWrapper('GET', API_URL.GET_EVENT.replace(':id', id), {}, token);
            const event = response.data;
            setSelectedEvent(event);
            setShowModal(true);
        } catch (error) {}
    };

    const handleEventClick = (event) => {
        getEventDetails(event.id);
    };

    return (
        <div className="dashboard-page">
            {loading ? (
                <Loading centered={true} />
            ) : (
                <>
                    <Helmet>
                        <title>Dashboard | Dropship Academy</title>
                    </Helmet>
                    <Row>
                        {cardStats?.map((stat, index) => (
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
                                    handleFilterChange={handleFilterChange}
                                    currentFilter={currentFilter}
                                />
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card header={true} title="Events" customCardClass="events-card">
                                <BigCalender onEventClick={handleEventClick} events={eventsData} />
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
                </>
            )}
        </div>
    );
};

export default Dashboard;
