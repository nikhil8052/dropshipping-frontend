/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@components/Card/Card';
import { StatCard, CashFlowLineChart, LineChart } from '@components/Home';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import Profit from '@icons/Profit.svg';
import Costs from '@icons/Costs.svg';

const sampleData = [5000, 22200, 6000, 20000, 7500, 28000, 8500, 20000, 7500, 28000, 8500, 20000, 7500, 28000, 8500];
const previousData = [3000, 12000, 4000, 16000, 5000, 24000, 6000, 18000, 5500, 26000, 7500, 22000];

const currentData = [5000, 22200, 6000, 20000, 7500, 28000, 8500, 20000, 7500, 28000, 8500, 20000];

const StudentDashboard = () => {
    const chartRef = useRef(null);
    const [chartHeight, setChartHeight] = useState(50);
    const [cardStats, setCardStats] = useState([]);
    const [lineGraphData, setLineGraphData] = useState({
        datasets: [
            {
                label: 'Revenue (Shopify)',
                borderColor: 'rgba(1, 159, 216, 1)',
                pointRadius: 0,
                fill: true,
                backgroundColor: 'yellow',
                lineTension: 0.4,
                data: sampleData,
                borderWidth: 4
            }
        ]
    });
    const [cashFlowData, setCashFlowData] = useState({
        datasets: [
            {
                label: 'Cash Flow',
                borderColor: 'rgba(37, 205, 37, 1)',
                pointRadius: 0,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                lineTension: 0.4,
                data: [2000, 5000, 1500, 1000, 2000, 4000, 7000, 9000],
                borderWidth: 2
            }
        ]
    });
    const [chartKey, setChartKey] = useState('students');

    const [dataSet, setDataSet] = useState(false);
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;

    const [currentFilter, setCurrentFilter] = useState('current');

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, []);

    const statCards = [
        {
            id: 1,
            title: 'Total Revenue',
            value: '$2,235'
        },
        {
            id: 2,
            title: 'Profit / Loss',
            value: '$2,100'
        },
        {
            id: 3,
            title: 'Products Tested',
            value: '135'
        },
        {
            id: 4,
            title: 'Total Orders',
            value: '565'
        }
    ];
    const cashFlowCards = [
        {
            id: 1,
            title: 'Profit',
            value: '$235.5k',
            icon: Profit
        },
        {
            id: 2,
            title: 'Costs',
            value: '$996.5k',
            icon: Costs
        }
    ];

    // Line Chart data
    const data = {
        datasets: [
            {
                label: 'Revenue (Shopify)',
                borderColor: 'rgba(1, 159, 216, 1)',
                pointRadius: 0,
                fill: true,
                backgroundColor: 'yellow',
                lineTension: 0.4,
                data: sampleData,
                borderWidth: 4
            }
        ]
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
            }
        },
        elements: {
            line: {
                fill: true // Controls if the area under the line should be filled
            }
        }
    };
    const cashData = {
        datasets: [
            {
                label: 'Cash Flow',
                borderColor: 'rgba(37, 205, 37, 1)',
                pointRadius: 0,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                lineTension: 0.4,
                data: [2000, 5000, 15000, 10000, 20000, 4000, 7000, 900],
                borderWidth: 2,
                borderDash: [5, 5]
            }
        ]
    };
    const cashFlowOptions = {
        scales: {
            x: {
                grid: {
                    display: true
                },
                labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
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
            }
        },
        elements: {
            line: {
                fill: true // Controls if the area under the line should be filled
            }
        }
    };

    useEffect(() => {
        setCardStats(statCards);
        setLineGraphData(data);
        setCashFlowData(cashData);
        setDataSet(false);
        setChartHeight(50);
    }, []);

    const timePeriods = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Yearly', value: 'yearly' }
    ];
    const handleFilterChange = (filter) => {
        if (currentFilter !== filter) {
            setCurrentFilter(filter);
            const newData = filter === 'current' ? currentData : previousData;
            setLineGraphData({
                datasets: [
                    {
                        label: 'Revenue (Shopify)',
                        borderColor: 'rgba(1, 159, 216, 1)',
                        pointRadius: 0,
                        fill: true,
                        backgroundColor: 'rgba(1, 159, 216, 0.1)',
                        lineTension: 0.4,
                        data: newData,
                        borderWidth: 4
                    }
                ]
            });
        }
    };

    const tabTitles = {
        students: 'Total Students',
        coaches: 'Total Coaches'
    };

    return (
        <div className="dashboard-page">
            <Helmet>
                <title>Dashboard | Drop Ship Academy</title>
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
                    <LineChart
                        data={lineGraphData}
                        options={graphOptions}
                        timePeriods={timePeriods}
                        chartHeight={chartHeight}
                        dataSet={dataSet}
                        role={role}
                        handleFilterChange={handleFilterChange}
                        currentFilter={currentFilter}
                        chartKey={chartKey}
                        setChartKey={setChartKey}
                        tabTitles={tabTitles}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card header={true} customCardClass="events-card">
                        {cashFlowData && (
                            <CashFlowLineChart
                                data={cashFlowData}
                                options={cashFlowOptions}
                                chartHeight={chartHeight}
                            />
                        )}
                    </Card>
                </Col>
                <Col>
                    <Row>
                        {cashFlowCards.map((stat, index) => (
                            <Col key={stat.id}>
                                <Card
                                    customCardClass={`custom-card-colors cash-flow-card ${index % 2 === 0 ? 'even' : 'odd'}`}
                                >
                                    <StatCard {...stat} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default StudentDashboard;
