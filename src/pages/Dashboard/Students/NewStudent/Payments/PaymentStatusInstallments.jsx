import { Card, Badge, Modal, Button } from 'react-bootstrap';
import { formatTimezoneWithoutTime } from '../../../../../utils/common';
import { useState } from 'react';
import { API_URL } from '../../../../../utils/apiUrl';
import { useSelector } from 'react-redux';
import editIcon from '@icons/edit_square.svg';
import DatePicker from 'react-datepicker';
import axiosWrapper from '../../../../../utils/api';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.scss';

const PaymentStatusInstallments = ({ studentName, paymentHistory, id, setIsRefetch }) => {
    const statusBadgeStyles = { minWidth: '88px', textAlign: 'center' };

    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);

    const handleEditClick = (installment) => {
        setSelectedInstallment(installment);
        setSelectedDate(new Date(installment.dueDate));
        setShowModal(true);
    };

    const getMinDate = (currentInstallment) => {
        const currentInstallmentIndex = paymentHistory.findIndex(
            (inst) => inst.installmentNumber === currentInstallment.installmentNumber
        );

        if (currentInstallmentIndex > 0) {
            // Get previous installment's due date
            const previousInstallmentDueDate = new Date(paymentHistory[currentInstallmentIndex - 1].dueDate);
            return previousInstallmentDueDate;
        }

        return new Date(); // For first installment, use current date
    };

    const handleUpdateDueDate = async () => {
        setIsUpdating(true);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await axiosWrapper(
                'PUT',
                API_URL.UPDATE_STUDENT_PAYMENT_DUE_DATE.replace(':id', id),
                {
                    newDueDate: formattedDate,
                    installmentNumber: selectedInstallment.installmentNumber
                },
                token
            );
            if (response?.data?.message === 'Payment due date updated successfully') {
                toast.success('Payment due date updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update due date');
        } finally {
            setShowModal(false);
            setIsRefetch((prev) => !prev);
            setIsUpdating(false);
        }
    };

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
                            <div className="d-flex align-items-center gap-2">
                                <span>Due Date: {formatTimezoneWithoutTime(installment.dueDate)}</span>
                                {installment.status === 'unpaid' && userInfo?.role === 'ADMIN' && (
                                    <img
                                        src={editIcon}
                                        alt="Edit"
                                        style={{
                                            cursor: 'pointer',
                                            width: '24px',
                                            height: '24px',
                                            marginLeft: '10px'
                                        }}
                                        onClick={() => handleEditClick(installment)}
                                    />
                                )}
                            </div>
                            {getStatusBadge(installment)}
                        </div>
                    ))}
                </div>
            </div>

            <Modal size="md" centered show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Due Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={selectedInstallment ? getMinDate(selectedInstallment) : new Date()}
                        dateFormat="MMMM d, yyyy"
                        className="form-control text-center"
                        placeholderText="Select new due date"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={isUpdating} className="update-due-date-btn" onClick={handleUpdateDueDate}>
                        Update Due Date
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default PaymentStatusInstallments;
