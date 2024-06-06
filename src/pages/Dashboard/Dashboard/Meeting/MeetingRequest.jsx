import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CaretLeft from '@icons/CaretLeft.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import './MeetingRequest.scss';
import '../../../../styles/Common.scss';
import toast from 'react-hot-toast';

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
        { value: 'CST', label: 'Central Standard Time Chicago (GMT-6)', id: 1 },
        { value: 'EST', label: 'Eastern Standard Time (GMT-5)', id: 2 },
        { value: 'PST', label: 'Pacific Standard Time (GMT-8)', id: 3 },
        { value: 'MST', label: 'Mountain Standard Time (GMT-7)', id: 4 }
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

    const handleFormSubmit = (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            // Implement form submission logic here
            resetForm();
            setSubmitting(false);
            toast.success('Meeting request submitted successfully');
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
                        onSubmit={handleFormSubmit}
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
                                        {/* eslint-disable */}
                                        <Field
                                            name="timeZone"
                                            className="field-select-control"
                                            type="text"
                                            component={({ field, form }) => {
                                                const handleSelect = (eventKey) => {
                                                    const selectedZone = timeZoneOptions.find(
                                                        (zone) => zone.id.toString() === eventKey
                                                    );
                                                    form.setFieldValue(field.name, selectedZone.label);
                                                };

                                                return (
                                                    <>
                                                        <DropdownButton
                                                            title={
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span>
                                                                        {field.value || 'Select a time zone...'}
                                                                    </span>
                                                                    <img src={dropDownArrow} alt="arrow" />
                                                                </div>
                                                            }
                                                            id={field.name}
                                                            onSelect={handleSelect}
                                                            className="dropdown-button w-100"
                                                        >
                                                            {timeZoneOptions.map((zone) => (
                                                                <Dropdown.Item
                                                                    key={zone.id}
                                                                    eventKey={zone.id}
                                                                    className="my-1 ms-2 w-100"
                                                                >
                                                                    <span className="country-name">{zone.label}</span>
                                                                </Dropdown.Item>
                                                            ))}
                                                        </DropdownButton>
                                                        {form.touched[field.name] && form.errors[field.name] && (
                                                            <div className="error mt-2">{form.errors[field.name]}</div>
                                                        )}
                                                    </>
                                                );
                                            }}
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
                                <div className="mt-3 d-flex justify-content-end gap-3 flex-wrap">
                                    <Button
                                        type="button"
                                        onClick={() => navigate('/student')}
                                        className="cancel-btn"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="submit-btn custom-width" disabled={isSubmitting}>
                                        {isSubmitting ? 'Save Changes...' : 'Save'}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </div>
        </div>
    );
};

export default MeetingRequest;
