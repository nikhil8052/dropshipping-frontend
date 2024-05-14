import { Tabs, Tab } from 'react-bootstrap';
import StudentsTrainingProduct from './Product/StudentsTrainingProduct';
import DailyFinances from './DailyFinances';
import Invoices from './Invoices';

function VisualizeCsv() {
    return (
        <div className="visualize-csv-tabs">
            <Tabs fill defaultActiveKey="students" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="students" title="Students Training Products">
                    <StudentsTrainingProduct />
                </Tab>
                <Tab eventKey="finance" title="Daily Finances">
                    <DailyFinances />
                </Tab>
                <Tab eventKey="inbox" title="Invoices">
                    <Invoices />
                </Tab>
            </Tabs>
        </div>
    );
}

export default VisualizeCsv;
