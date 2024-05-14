import { Row, Col } from 'react-bootstrap';
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

const CashFlowLineChart = ({ data, options }) => {
    return (
        <div className="chart-container">
            <Row className="d-flex justify-content-between">
                <Col className="flex-grow-1 ">
                    <h5 className="graph-title">Cash Flow</h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Line
                        data={data}
                        options={options}
                        style={{
                            minHeight: '280px'
                        }}
                        height={85}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default CashFlowLineChart;
