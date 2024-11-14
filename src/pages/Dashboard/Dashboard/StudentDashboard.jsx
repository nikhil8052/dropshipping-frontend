/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import Card from '@components/Card/Card';
import { StatCard, CashFlowLineChart, LineChart } from '@components/Home';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import Profit from '@icons/Profit.svg';
import Costs from '@icons/Costs.svg';
import { useNavigate } from 'react-router';
import { useIsSmallScreen } from '../../../utils/mediaQueries';
import axiosWrapper from '../../../utils/api';
import Loading from '@components/Loading/Loading';
import { API_URL } from '../../../utils/apiUrl';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../../../styles/Dashboard.scss';
import { convertCamelCaseToTitle, formatNumberWithCommas } from '../../../utils/common';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const chartRef = useRef(null);
    const isSmallScreen = useIsSmallScreen();
    const [cardStats, setCardStats] = useState([]);
    const [cashFlowCards, setCashFlowCards] = useState([]);
    const [lineGraphData, setLineGraphData] = useState(null);
    const [cashFlowData, setCashFlowData] = useState(null);
    const [chartKey, setChartKey] = useState('students');
    const { userInfo } = useSelector((state) => state?.auth);
    const [loading, setLoading] = useState(false);
    const role = userInfo?.role;
    const token = useSelector((state) => state?.auth?.userToken);
    const [currentFilter, setCurrentFilter] = useState('current_month');

    // New state variables for session data
    const [availableSessions, setAvailableSessions] = useState(0);
    const [paymentUpToDate, setPaymentUpToDate] = useState(false);
    const [nextSessionDate, setNextSessionDate] = useState(null);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [role]);

    useEffect(() => {
        if (currentFilter) {
            fetchDashboardData(false);
        }
    }, [currentFilter]);

    // Fetch session info
    useEffect(() => {
        fetchSessionInfo();
    }, [token]);

    const fetchSessionInfo = async () => {
        const sessionInfo = await axiosWrapper('GET', API_URL.GET_SESSION_INFO, {}, token);
        const { paymentStatus, remainingSessions, nextSessionAvailableDate } = sessionInfo.data;

        setAvailableSessions(remainingSessions);
        setPaymentUpToDate(paymentStatus === 'paid');
        setNextSessionDate(new Date(nextSessionAvailableDate));
    };

    const fetchDashboardData = async (loading = true) => {
        setLoading(loading);
        try {
            let cardData, graphData, secondCard;
            cardData = await axiosWrapper('GET', API_URL.GET_STUDENT_CARD_DATA, {}, token);

            secondCard = await axiosWrapper('GET', API_URL.GET_STUDENT_SECOND_CARD_DATA, {}, token);

            graphData = await axiosWrapper(
                'GET',
                `${API_URL.GET_STUDENT_GRAPH_DATA}?graphFilter=${currentFilter}`,
                {},
                token
            );

            // New session info fetch
            // const sessionInfo = await axiosWrapper('GET', API_URL.GET_SESSION_INFO, {}, token);
            // const { paymentStatus, remainingSessions, nextSessionAvailableDate } = sessionInfo.data;

            // setAvailableSessions(remainingSessions);
            // setPaymentUpToDate(paymentStatus === 'paid');
            // setNextSessionDate(new Date(nextSessionAvailableDate));

            // Map the data to the format required by the StatCard component
            const amountKeys = ['totalRevenue', 'profitOrLoss'];
            const mapCards = Object.entries(cardData?.data).map(([key, value], index) => ({
                id: index,
                title: convertCamelCaseToTitle(key),
                value: amountKeys.includes(key) ? `$${formatNumberWithCommas(value)}` : value
            }));

            const mapSecondCards = Object.entries(secondCard?.data).map(([key, value], index) => ({
                id: index + 1,
                title: convertCamelCaseToTitle(key),
                value: amountKeys.includes(key) ? `$${formatNumberWithCommas(value)}` : value,
                icon: key === 'profit' ? Profit : Costs
            }));

            setCardStats(mapCards);
            setCashFlowCards(mapSecondCards);

            const revenueData = generateRevenueData(graphData?.data);
            const cashFlowData = generateCashData(graphData?.data);
            setLineGraphData(revenueData);
            setCashFlowData(cashFlowData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching dashboard data:', error);
        }
    };

    const graphOptions = {
        scales: {
            x: {
                grid: {
                    display: false
                },
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                ticks: {
                    color: 'rgba(0, 0, 0, 1)'
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
                    stepSize: 5000, // Set steps of 10,000
                    callback: function (value, index, values) {
                        // Optional: format ticks to show 'k' (e.g., 10k, 20k)
                        return value === 0 ? '0' : '$' + value / 1000 + 'k';
                    },
                    color: 'rgba(0, 0, 0, 1)'
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
            },
            tooltip: {
                mode: 'nearest',
                displayColors: false,
                intersect: false
            }
        },
        elements: {
            line: {
                fill: true // Controls if the area under the line should be filled
            }
        }
    };
    const generateCashData = (data) => {
        const { cashFlowData } = data;
        return {
            datasets: [
                {
                    label: 'Cash Flow',
                    borderColor: 'rgba(37, 205, 37, 1)',
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    lineTension: 0.4,
                    data: cashFlowData?.flatMap((obj) => Object.values(obj)),
                    borderWidth: 2,
                    borderDash: [5, 5]
                }
            ]
        };
    };
    const cashFlowOptions = {
        scales: {
            x: {
                grid: {
                    display: true
                },
                labels: ['2020', '2021', '2022', '2023', '2024'],
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
                    display: true
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
            },
            tooltip: {
                mode: 'nearest',
                displayColors: false,
                intersect: false
            }
        },
        elements: {
            line: {
                fill: true // Controls if the area under the line should be filled
            }
        }
    };

    const generateRevenueData = (data) => {
        const { revenueData } = data;
        return {
            datasets: [
                {
                    label: 'Revenue (Shopify)',
                    borderColor: 'rgba(1, 159, 216, 1)',
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(1, 159, 216, 0.1)',
                    lineTension: 0.4,
                    data: revenueData?.flatMap((obj) => Object.values(obj)),
                    borderWidth: 4
                }
            ]
        };
    };

    const timePeriods = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Yearly', value: 'yearly' }
    ];
    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
    };

    const tabTitles = {
        students: 'Total Students',
        coaches: 'Total Coaches'
    };

    // Calculate the countdown timer for the next session
    const calculateCountdown = () => {
        if (!nextSessionDate) return null;
        const now = new Date();
        const timeLeft = nextSessionDate - now;
        if (timeLeft <= 0) return 'Available now';

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return `${days}d ${hours}h ${minutes}m`;
    };

    const countdown = calculateCountdown();

    return (
        <div className="dashboard-page">
            <Helmet>
                <title>Dashboard | Dropship Academy</title>
            </Helmet>
            {false ? (
                <Loading centered={true} />
            ) : (
                <>
                    <Row className="my-4 align-items-center">
                        <Col xs={12}>
                            <Card header={false} customCardClass="events-card">
                                <Row className="align-items-center">
                                    <Col xs={12} lg={8}>
                                        <h5>Coaching Sessions</h5>
                                        {!userInfo?.assignedCoach ? (
                                            <p className="text-danger">
                                                You have not been assigned a coach. Please contact support to get
                                                assigned a coach.
                                            </p>
                                        ) : (
                                            <>
                                                <p>
                                                    <Badge bg={paymentUpToDate ? 'success' : 'danger'} className="p-2">
                                                        {paymentUpToDate
                                                            ? `${availableSessions}/${
                                                                  userInfo.installmentFrequency === 'weekly' ? '1' : '4'
                                                              } sessions available`
                                                            : `0/${userInfo.installmentFrequency === 'weekly' ? '1' : '4'} sessions available`}
                                                    </Badge>

                                                    {paymentUpToDate && availableSessions > 0 && nextSessionDate && (
                                                        <span className="ms-3">
                                                            Next session available in: <strong>{countdown}</strong>
                                                        </span>
                                                    )}
                                                </p>

                                                <p className="text-muted">
                                                    {paymentUpToDate
                                                        ? `You are eligible to schedule up to ${availableSessions} coaching session${
                                                              availableSessions !== 1 ? 's' : ''
                                                          } this ${userInfo.installmentFrequency === 'weekly' ? 'week' : 'month'}.`
                                                        : 'Your payments are not up-to-date. Please complete your payment to access coaching sessions.'}
                                                </p>
                                            </>
                                        )}
                                    </Col>
                                    <Col xs={12} lg={4} className="d-flex justify-content-lg-end mt-3 mt-lg-0">
                                        {!userInfo?.assignedCoach || !paymentUpToDate || availableSessions === 0 ? (
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-top">
                                                        {!userInfo?.assignedCoach
                                                            ? 'You need to be assigned a coach to request a meeting.'
                                                            : !paymentUpToDate
                                                              ? 'Payments are not up-to-date. You cannot schedule a session.'
                                                              : 'No available sessions remaining this month.'}
                                                    </Tooltip>
                                                }
                                            >
                                                <Button variant="primary" className="meeting-btn" disabled>
                                                    Request for meeting
                                                </Button>
                                            </OverlayTrigger>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                className="meeting-btn"
                                                onClick={() => navigate('/student/request-meeting')}
                                            >
                                                Request for meeting
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

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
                            {lineGraphData && (
                                <LineChart
                                    data={lineGraphData}
                                    options={graphOptions}
                                    timePeriods={timePeriods}
                                    chartHeight={isSmallScreen ? 200 : 100}
                                    dataSet={false}
                                    role={role}
                                    handleFilterChange={handleFilterChange}
                                    currentFilter={currentFilter}
                                    chartKey={chartKey}
                                    setChartKey={setChartKey}
                                    tabTitles={tabTitles}
                                />
                            )}
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={8}>
                            <Card header={true} customCardClass="events-card">
                                {cashFlowData && (
                                    <CashFlowLineChart
                                        data={cashFlowData}
                                        options={cashFlowOptions}
                                        chartHeight={isSmallScreen ? 200 : 100}
                                    />
                                )}
                            </Card>
                        </Col>
                        <Col lg={4}>
                            {cashFlowCards?.map((stat, index) => (
                                <Col key={stat.id} className="w-100 d-flex flex-column h-50">
                                    <Card
                                        customCardClass={`custom-card-colors h-100 ${index % 2 === 0 ? 'even' : 'odd'}`}
                                    >
                                        <StatCard {...stat} />
                                    </Card>
                                </Col>
                            ))}
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default StudentDashboard;
