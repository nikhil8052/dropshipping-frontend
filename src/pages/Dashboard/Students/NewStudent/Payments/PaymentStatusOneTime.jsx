import { Card, Badge } from 'react-bootstrap';

const PaymentStatusOneTime = ({ studentName, paymentDate, status }) => (
    <Card className="p-3 my-3">
        <h5>{studentName}'s Payment Status</h5>
        <div className="mt-3">
            <div className="d-flex justify-content-between">
                <span>Payment Type:</span>
                <Badge bg="secondary">One-Time</Badge>
            </div>
            <div className="d-flex justify-content-between mt-2">
                <span>Payment Date:</span>
                <span>{paymentDate ? new Date(paymentDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
                <span>Status:</span>
                <Badge bg={status === 'Paid' ? 'success' : 'danger'}>{status}</Badge>
            </div>
        </div>
    </Card>
);

export default PaymentStatusOneTime;
