import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/preview.svg';
import UploadSimple from '@icons/UploadSimple.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { coachDummyData } from '../../../../data/data';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImageCropper from '../../../../components/ImageMask/ImageCropper';
import '../../../../styles/Events.scss';
import '../../../../styles/Common.scss';

const NewEvent = () => {
    const inputRef = useRef();
    const [eventThumbnail, setEventThumbnail] = useState(null);
    const location = useLocation();
    const eventId = location.state?.eventId;
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const navigate = useNavigate();
    const [cropping, setCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [eventData, setEventData] = useState({
        topic: '',
        dateAndTime: '',
        eventType: '',
        meetingLink: '',
        attendees: ''
    });
    const schema = Yup.object({
        topic: Yup.string().required('Topic is required.'),
        dateAndTime: Yup.date().required('Date and Time is required.'),
        eventType: Yup.string().required('Event type is required.'),
        meetingLink: Yup.string().when('eventType', {
            is: 'Online',
            then: Yup.string().required('Meeting link is required for online events'),
            otherwise: Yup.string()
        }),
        attendees: Yup.string().required('Attendees are required')
    });

    useEffect(() => {
        if (eventId) {
            const coach = coachDummyData.find((coach) => coach.id === eventId);
            if (coach) {
                setEventThumbnail(coach.avatarUrl);
                setEventData({
                    topic: coach.name,
                    dateAndTime: coach.dateAndTime,
                    eventType: coach.eventType,
                    meetingLink: coach.meetingLink,
                    attendees: coach.attendees
                });
            }
        }
    }, [eventId]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            // Display an error or handle the invalid file selection
            toast.error('Invalid file selected. Please choose an image file.');
            return;
        }

        const image = URL.createObjectURL(file);
        setImageSrc(image);
        setCropping(true);
    };

    const handleCropComplete = (croppedImage) => {
        setEventThumbnail(croppedImage);
        // Upload File through API
        setCropping(false);
        toast.success('Image uploaded successfully!', {
            icon: '🎉',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        });
    };

    return (
        <div className="new-event-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/events`)} style={{ cursor: 'pointer' }}>
                    Events <img src={CaretRight} alt=">" />
                </span>{' '}
                {eventId ? 'Event Details' : 'Create New Event'}
            </div>
            <div className="new-event-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 new-event-title">{eventId ? 'Coach Profile' : 'Schedule Event'}</h4>
                    <Formik
                        initialValues={eventData}
                        validationSchema={schema}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            setTimeout(() => {
                                // Implement form submission logic here
                                resetForm();
                                setSubmitting(false);
                                navigate('/admin/events');
                            }, 1000);
                        }}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col>
                                        {eventThumbnail ? (
                                            <label className="field-label fw-bold">Event image</label>
                                        ) : (
                                            <label className="field-label">Upload Event Thumbnail</label>
                                        )}
                                        <div className="image_wrapper">
                                            <Field name="eventThumbnail">
                                                {({ field }) => (
                                                    <>
                                                        <input
                                                            ref={inputRef}
                                                            accept=".jpg,.jpeg,.png"
                                                            {...field}
                                                            type="file"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                        />
                                                        {eventThumbnail ? (
                                                            <div className="image-renderer">
                                                                <div className="img-wrapper">
                                                                    <img
                                                                        src={
                                                                            typeof eventThumbnail === 'string'
                                                                                ? eventThumbnail
                                                                                : URL.createObjectURL(eventThumbnail)
                                                                        }
                                                                        alt=""
                                                                        style={{ borderRadius: '50%' }}
                                                                    />
                                                                    <div
                                                                        className="overlay-image"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            inputRef.current.click();
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </div>
                                                                </div>
                                                                <span>{eventThumbnail.name}</span>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="image-preview"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    inputRef.current.click();
                                                                }}
                                                            >
                                                                <img src={imagePreview} alt="" />
                                                                <span className="ms-2">
                                                                    Upload your event Thumbnail here.
                                                                    <br />
                                                                    Supported formats:{' '}
                                                                    <strong>.jpg, .jpeg, or .png</strong>
                                                                    <br />
                                                                    <Button className="upload-image-btn">
                                                                        Upload Image{' '}
                                                                        <img src={UploadSimple} alt="Upload Btn" />
                                                                    </Button>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </div>
                                    </Col>
                                </Row>
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
                                        <label className="field-label">Date & Time</label>
                                        <Field
                                            name="dateAndTime"
                                            className="field-control"
                                            type="datetime-local"
                                            placeholder="22/02/2024"
                                        />
                                        <ErrorMessage name="dateAndTime" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Type of Event</label>
                                        <Field
                                            name="eventType"
                                            className="field-select-control"
                                            as="select"
                                            placeholder="Select a type of event..."
                                        >
                                            {['Physical', 'Online'].map((event) => (
                                                <option key={event} value={event}>
                                                    {event}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="eventType" component="div" className="error" />
                                    </Col>
                                </Row>
                                {/* Meeting Link, Meeting Location */}
                                <Row>
                                    <Col>
                                        <label className="field-label">Meeting Link</label>
                                        <Field
                                            name="meetingLink"
                                            className="field-control"
                                            type="text"
                                            placeholder="https://zoom.us/j/97697547647?pwd=UytOUjFlUTlPRjYvbmJnQ0pvZ2RDUT09"
                                        />
                                        <ErrorMessage name="meetingLink" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <label className="field-label">Attendees</label>
                                        <Field
                                            name="attendees"
                                            className="field-control"
                                            type="text"
                                            placeholder="Email or Name"
                                        />
                                        <ErrorMessage name="attendees" component="div" className="error" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-end gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => navigate(`/${role}/events`)}
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
                                                {isSubmitting
                                                    ? eventId
                                                        ? 'Saving Changes...'
                                                        : 'Saving Event...'
                                                    : eventId
                                                      ? 'Save Changes'
                                                      : 'Save'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                    {cropping && (
                        <ImageCropper
                            imageSrc={imageSrc}
                            onCropComplete={handleCropComplete}
                            onCancel={() => setCropping(false)}
                        />
                    )}
                </Container>
            </div>
        </div>
    );
};

export default NewEvent;
