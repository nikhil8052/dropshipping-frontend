import { Card, Badge } from 'react-bootstrap';
import { formatTimezone } from '../../../../../utils/common';

const PaymentStatusInstallments = ({ studentName, paymentHistory }) => {
    const statusBadgeStyles = { minWidth: '88px', textAlign: 'center' };

    const getStatusBadge = (installment) => {
        const currentDate = new Date();
        const dueDate = new Date(installment.dueDate);

        if (installment.status === 'paid') {
            return (
                <Badge style={statusBadgeStyles} className="p-2" bg="success">
                    Paid
                </Badge>
            );
        } else if (installment.status === 'unpaid') {
            return (
                <Badge style={statusBadgeStyles} className="p-2" bg={currentDate > dueDate ? 'danger' : 'warning'}>
                    {currentDate > dueDate ? 'Overdue' : 'Unpaid'}
                </Badge>
            );
        }
    };

    return (
        <Card className="p-3 my-3">
            <h5>{studentName}'s Payment Status</h5>
            <div className="mt-3">
                <div className="d-flex justify-content-between">
                    <span>Payment Type:</span>
                    <Badge style={statusBadgeStyles} className="p-2 me-2" bg="secondary">
                        Installments
                    </Badge>
                </div>

                <div className="mt-3">
                    <h6>Installment Details:</h6>
                    {paymentHistory.map((installment) => (
                        <div
                            key={installment.installmentNumber}
                            className="d-flex justify-content-between align-items-center p-2 border rounded mb-2"
                            style={{ backgroundColor: '#f8f9fa' }}
                        >
                            <span>Due Date: {formatTimezone(installment.dueDate)}</span>
                            {getStatusBadge(installment)}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default PaymentStatusInstallments;
