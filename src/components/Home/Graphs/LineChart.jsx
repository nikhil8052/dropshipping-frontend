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

const LineChart = ({ data, options, chartKey, setChartKey, tabTitles, timePeriods, chartHeight }) => {
    return (
        <Card className="graph-card">
            <Card.Body>
                <div className="chart-container">
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
                                            onChange={(e) => setChartKey(e.target.value)}
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
                                            <Line height={chartHeight} data={data.datasets[key]} options={options} />
                                        </Tab.Pane>
                                    ))}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </Card.Body>
        </Card>
    );
};

export default LineChart;
