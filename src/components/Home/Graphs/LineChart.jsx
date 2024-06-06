import { Card, Form, Tab, Row, Col, Nav } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import '@constants/chart-customs.scss';
import './LineGraph.scss';

// Register the necessary components for a line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({
    data,
    options,
    chartKey,
    setChartKey,
    tabTitles,
    timePeriods,
    chartHeight,
    dataSet,
    role,
    handleFilterChange,
    currentFilter
}) => {
    return (
        <Card className="graph-card">
            <Card.Body>
                <div className="chart-container">
                    {dataSet ? (
                        <Tab.Container id="line-chart-tabs" activeKey={chartKey} onSelect={(k) => setChartKey(k)}>
                            <Row>
                                <Col sm={12}>
                                    <Nav variant="tabs">
                                        {Object.keys(data.datasets).map((key, index) => (
                                            <Nav.Item key={index}>
                                                <Nav.Link eventKey={key}>{tabTitles[key]}</Nav.Link>
                                            </Nav.Item>
                                        ))}

                                        <Nav.Item className="ms-auto">
                                            <Form.Select
                                                className="custom-form-select"
                                                aria-label="Select Time Period"
                                                style={{ width: 'auto', display: 'inline-block' }}
                                            >
                                                {timePeriods.map((period) => (
                                                    <option key={period.value} value={period.value}>
                                                        {period.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Tab.Content>
                                        {Object.keys(data.datasets).map((key) => (
                                            <Tab.Pane eventKey={key} key={key}>
                                                <Line
                                                    height={chartHeight}
                                                    data={data.datasets[key]}
                                                    options={options}
                                                />
                                            </Tab.Pane>
                                        ))}
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    ) : role === 'coach' ? (
                        <>
                            <Row className="d-flex justify-content-between">
                                <Col className="flex-grow-1 ">
                                    <h5 className="graph-title">Hours Worked</h5>
                                </Col>
                                <Col className="flex-grow-0 ms-auto">
                                    <Form.Select
                                        className="custom-form-select"
                                        aria-label="Select Time Period"
                                        onChange={(e) => setChartKey(e.target.value)}
                                        style={{ width: 'auto', display: 'inline-block' }}
                                    >
                                        {timePeriods.map((period) => (
                                            <option key={period.value} value={period.value}>
                                                {period.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Line height={chartHeight} data={data} options={options} />
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <>
                            <Row className="d-flex justify-content-between">
                                <Col className="flex-grow-1 ">
                                    <h5 className="graph-title">Revenue (Shopify)</h5>
                                </Col>
                                <Col className="flex-grow-0 ms-auto d-flex gap-2">
                                    <Form.Check
                                        type="checkbox"
                                        id="prev-checkbox"
                                        label="Previous"
                                        checked={currentFilter === 'previous'}
                                        onChange={() => handleFilterChange('previous')}
                                        className="me-2"
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="current-checkbox"
                                        label="Current"
                                        checked={currentFilter === 'current'}
                                        onChange={() => handleFilterChange('current')}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Line height={chartHeight} data={data} options={options} />
                                </Col>
                            </Row>
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default LineChart;
