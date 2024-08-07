import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CaretLeft from '@icons/CaretLeft.svg';
import axiosWrapper from '@utils/api';
import { API_URL } from '@utils/apiUrl';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loading from '@components/Loading/Loading';
import '../../../../styles/Common.scss';
import './MeetingRequest.scss';

const MeetingRequest = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const [isAuthCalled, setIsAuthCalled] = useState(false);
    const [coachData, setCoachData] = useState({});
    const [loading, setLoading] = useState(false);
    const [meetingData, setMeetingData] = useState({
        topic: '',
        dateTime: '',
        joinLink: '',
        assignedCoach: '',
        reason: ''
    });

    const validationSchema = Yup.object({
        topic: Yup.string().required('Topic is required'),
        dateTime: Yup.date().required('Date and Time is required').typeError('Invalid date and time'),
        joinLink: Yup.string().required('Join Link is required'),
        reason: Yup.string().required('Reason is required')
    });

    const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
        setLoading(true);
        setSubmitting(true);
        // Later we will replace this with actual API call

        const formData = {
            topic: values.topic,
            dateTime: values.dateTime,
            attendees: [coachData?._id],
            eventHost: coachData?.name,
            reason: values.reason,
            typeOfEvent: coachData?.meetingLink ? 'ONLINE' : 'ONSITE',
            ...(coachData?.meetingLink && { meetingLink: coachData.meetingLink }),
            ...(coachData?.location && { location: coachData.location })
        };

        try {
            await axiosWrapper('POST', API_URL.REQUEST_MEETING, formData, token);

            // Call API here
            resetForm();
            navigate('/student');
            setLoading(false);
        } catch (error) {
            return;
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch data from API here
        if (userInfo?.assignedCoach) {
            getCoachById(userInfo?.assignedCoach);
        }
    }, [userInfo?.assignedCoach]);

    const getCoachById = async (id) => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);
            const response = await axiosWrapper('GET', API_URL.GET_COACH.replace(':id', id), {}, token);
            const coach = response?.data;

            if (coach) {
                // Determine the join link
                const joinLink = coach.meetingLink || coach.location || '';

                // Update meeting data in a single state update
                setMeetingData((prevData) => ({
                    ...prevData,
                    joinLink: joinLink,
                    assignedCoach: coach.name
                }));
                setCoachData(coach);
            }
            setLoading(false);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    // The student should be authenticated to create a meeting

    const auth = async () => {
        setLoading(true);
        // Later we will replace this with actual API call
        try {
            const { data } = await axiosWrapper('GET', `${API_URL.AUTH}`, {}, token);
            if (data.url) {
                toast.loading('Redirecting to Google Calendar Authentication...');
                window.location.href = data.url;
            }
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (userInfo && token && !isAuthCalled) {
            if (!userInfo.googleTokens || userInfo.googleTokens.expiry_date <= Date.now()) {
                setIsAuthCalled(true);
                auth();
            }
        }
        return () => {
            setIsAuthCalled(false); // Reset on component unmount
        };
    }, [userInfo, token]);

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
                {
                    // Show loader if data is loading
                    loading ? (
                        <Loading centered={true} />
                    ) : (
                        <Container fluid className="p-3">
                            <h4 className="mb-3 meeting-request-title">Request For Meeting</h4>
                            <Formik
                                initialValues={meetingData}
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
                                            <Col md={6} xs={12}>
                                                <label className="field-label">Date & Time</label>
                                                <Field
                                                    name="dateTime"
                                                    className="field-control"
                                                    type="datetime-local"
                                                />
                                                <ErrorMessage name="dateTime" component="div" className="error" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <label className="field-label">Assigned Coach</label>
                                                <Field
                                                    name="assignedCoach"
                                                    className="field-control"
                                                    type="text"
                                                    placeholder="Kathrine Jenifer"
                                                    readOnly
                                                />
                                                <ErrorMessage name="assignedCoach" component="div" className="error" />
                                            </Col>

                                            <Col md={6} xs={12}>
                                                <label className="field-label">Meeting Link / Location</label>
                                                <Field
                                                    name="joinLink"
                                                    className="field-control"
                                                    type="text"
                                                    placeholder="Meeting Link | Location"
                                                    readOnly
                                                />
                                                <ErrorMessage name="joinLink" component="div" className="error" />
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
                                            <Button
                                                type="submit"
                                                className="submit-btn custom-width"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Save Changes...' : 'Save'}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Container>
                    )
                }
            </div>
        </div>
    );
};

export default MeetingRequest;
