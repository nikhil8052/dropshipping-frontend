import { Card, Badge } from 'react-bootstrap';

const PaymentStatusInstallments = ({ studentName, paymentHistory }) => (
    <Card className="p-3 my-3">
        <h5>{studentName}'s Payment Status</h5>
        <div className="mt-3">
            <div className="d-flex justify-content-between">
                <span>Payment Type:</span>
                <Badge bg="secondary">Installments</Badge>
            </div>

            <div className="mt-3">
                <h6>Installment Details:</h6>
                {paymentHistory.map((installment) => (
                    <div
                        key={installment.installmentNumber}
                        className="d-flex justify-content-between align-items-center p-2 border rounded mb-2"
                        style={{ backgroundColor: '#f8f9fa' }}
                    >
                        <span>Due: {new Date(installment.dueDate).toLocaleDateString()}</span>
                        <Badge
                            bg={
                                installment.status === 'paid'
                                    ? 'success'
                                    : installment.status === 'unpaid'
                                      ? 'warning'
                                      : 'danger'
                            }
                        >
                            {installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    </Card>
);

export default PaymentStatusInstallments;
