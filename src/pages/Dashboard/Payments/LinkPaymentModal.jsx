import { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Spinner } from 'react-bootstrap';
import axiosWrapper from '@utils/api';
import toast from 'react-hot-toast';
import { API_URL } from '@utils/apiUrl';
import { useSelector } from 'react-redux';

const LinkPaymentModal = ({ show, onClose, paymentId }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state?.auth?.userToken);

    useEffect(() => {
        if (show) {
            fetchStudents();
        }
    }, [show]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axiosWrapper('GET', API_URL.GET_UNPAID_STUDENTS, {}, token);
            setStudents(response.data || []);
        } catch (error) {
            toast.error('Error fetching students');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkPayment = async (studentId) => {
        await axiosWrapper('POST', API_URL.LINK_PAYMENT_TO_STUDENT.replace(':paymentId', paymentId), { studentId });
        onClose(); // Close the modal after successful linking
        // Optionally, refetch payments to reflect the latest changes
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Link Payment to Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status" />
                        <span className="ms-2">Loading...</span>
                    </div>
                ) : (
                    <ListGroup>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <ListGroup.Item action key={student._id} onClick={() => handleLinkPayment(student._id)}>
                                    {student.name} - {student.email}
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p className="text-center">No students with unpaid payments found.</p>
                        )}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LinkPaymentModal;
