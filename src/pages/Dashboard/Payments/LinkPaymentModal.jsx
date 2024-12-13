import { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Spinner, InputGroup, Form } from 'react-bootstrap';
import axiosWrapper from '@utils/api';
import toast from 'react-hot-toast';
import { API_URL } from '@utils/apiUrl';
import { useSelector } from 'react-redux';
import Search from '@icons/Search.svg';
const LinkPaymentModal = ({ show, onClose, paymentId }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Link Payment to Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text>
                        <img src={Search} alt="Search" />
                    </InputGroup.Text>
                    <Form.Control
                        className="search-input"
                        type="text"
                        name="Search"
                        label="Search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search"
                    />
                </InputGroup>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status" />
                        <span className="ms-2">Loading...</span>
                    </div>
                ) : (
                    <ListGroup>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <ListGroup.Item
                                    action
                                    key={student._id}
                                    onClick={() => handleLinkPayment(student._id)}
                                    className="mb-3"
                                >
                                    {student.name} - {student.email}
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p className="text-center">
                                {searchTerm ? 'No matching students found.' : 'No students with unpaid payments found.'}
                            </p>
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
