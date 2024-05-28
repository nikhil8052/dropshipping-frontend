import { Tabs, Tab } from 'react-bootstrap';
import StudentsTrainingProduct from './Product/StudentsTrainingProduct';
import DailyFinances from './DailyFinances';
import Invoices from './Invoices';
import { useLocation, useNavigate } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import { studentDummyData } from '../../../data/data';
import { useSelector } from 'react-redux';
import '../../../styles/VisualizeCsv.scss';

function VisualizeCsv() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const studentId = location.state?.studentId;
    const student = studentDummyData.find((student) => student.id === studentId);

    return (
        <div className="visualize-csv-tabs">
            {studentId && (
                <div className="title-top">
                    <span onClick={() => navigate(`/${role}/students`)} style={{ cursor: 'pointer' }}>
                        Students <img src={CaretRight} alt=">" />
                    </span>{' '}
                    {student?.name}'s Profile <img src={CaretRight} alt=">" /> View Test Products
                </div>
            )}
            <Tabs fill defaultActiveKey="students" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="students" title="Students Training Products">
                    <StudentsTrainingProduct studentId={studentId} />
                </Tab>
                <Tab eventKey="finance" title="Daily Finances">
                    <DailyFinances studentId={studentId} />
                </Tab>
                <Tab eventKey="inbox" title="Invoices">
                    <Invoices studentId={studentId} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default VisualizeCsv;
