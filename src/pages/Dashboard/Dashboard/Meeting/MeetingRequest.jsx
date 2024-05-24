import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CaretLeft from '@icons/CaretLeft.svg';
import './MeetingRequest.scss';

const MeetingRequest = () => {
    const navigate = useNavigate();
    const initialValues = {
        topic: '',
        date: '',
        time: '',
        timeZone: '',
        attendees: '',
        reason: ''
    };
    const timeZoneOptions = [
        { value: 'CST', label: 'Central Standard Time Chicago (GMT-6)' },
        { value: 'EST', label: 'Eastern Standard Time (GMT-5)' },
        { value: 'PST', label: 'Pacific Standard Time (GMT-8)' },
        { value: 'MST', label: 'Mountain Standard Time (GMT-7)' }
        // Add more time zones as needed
    ];

    const validationSchema = Yup.object({
        topic: Yup.string().required('Topic is required'),
        date: Yup.date().required('Date is required'),
        time: Yup.string().required('Time is required'),
        timeZone: Yup.string().required('Time Zone is required'),
        attendees: Yup.string().required('Attendees are required'),
        reason: Yup.string().required('Reason is required')
    });

    const handleSubmit = ({ resetForm, setSubmitting }) => {
        setTimeout(() => {
            // Implement form submission logic here
            resetForm();
            setSubmitting(false);
            navigate('/student');
        }, 1000);
    };

    return (
        <div className="meeting-request-page-wrapper">
            <Row>
                <Col>
                    <Button className="submit-btn d-flex align-items-center mb-2" onClick={() => navigate('/student')}>
                        <img src={CaretLeft} alt="CaretLeft" className="me-2" /> Back
                    </Button>
                </Col>
            </Row>
            <div className="meeting-request-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 meeting-request-title">Request For Meeting</h4>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <label className="field-label">Topic</label>
                                        <Field
                                            name="topic"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g David Enderson meeting related to XYZ Course"
                                        />
                                        <ErrorMessage name="topic" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Date</label>
                                        <Field name="date" className="field-control" type="date" />
                                        <ErrorMessage name="date" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Time</label>
                                        <Field name="time" className="field-control" type="time" />
                                        <ErrorMessage name="time" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <label className="field-label">Time Zone</label>
                                        <Field
                                            name="timeZone"
                                            className="field-select-control"
                                            type="text"
                                            as="select"
                                            placeholder="Central Standard Time Chicago (GMT-6)"
                                        >
                                            <option value="" disabled>
                                                Select a time zone...
                                            </option>
                                            {timeZoneOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="timeZone" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} xs={12}>
                                        <label className="field-label">Attendees</label>
                                        <Field
                                            name="attendees"
                                            className="field-control"
                                            type="text"
                                            placeholder="Kathrine Jenifer"
                                        />
                                        <ErrorMessage name="attendees" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} xs={12}>
                                        <label className="field-label">Reason (Mandatory)</label>
                                        <Field
                                            name="reason"
                                            className="field-text-area-control"
                                            as="textarea"
                                            placeholder="E.g Type brief summary of the coach"
                                            rows="12"
                                        />
                                        <ErrorMessage name="reason" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-end gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => navigate('/student')}
                                                className="cancel-btn"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                {isSubmitting ? 'Save Changes...' : 'Save'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </div>
        </div>
    );
};

export default MeetingRequest;
