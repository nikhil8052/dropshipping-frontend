import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import UploadSimple from '@icons/UploadSimple.svg';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImageCropper from '../../../../components/ImageMask/ImageCropper';
import CustomSelect from '../../../../components/Input/Select';
import '../../../../styles/Events.scss';
import '../../../../styles/Common.scss';
import { eventsDummyData, studentDummyData } from '../../../../data/data';

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
        attendees: []
    });

    useEffect(() => {
        if (eventId) {
            const event = eventsDummyData.find((event) => event.id === eventId);
            if (event) {
                setEventThumbnail(event.thumbnailUrl);
                setEventData({
                    topic: event.topic,
                    dateAndTime: event.dateAndTime,
                    eventType: event.eventType,
                    meetingLink: event.meetingLink,
                    attendees: event.attendees
                });
            }
        }
    }, [eventId]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Invalid file selected. Please choose an image file.');
            return;
        }

        const image = URL.createObjectURL(file);
        setImageSrc(image);
        setCropping(true);
    };

    const handleCropComplete = (croppedImage) => {
        setEventThumbnail(croppedImage);
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

    const validationSchema = Yup.object({
        topic: Yup.string()
            .trim()
            .required('Topic is required')
            .test('not-only-spaces', 'Topic cannot be only spaces', (value) => /\S/.test(value)),
        dateAndTime: Yup.date().required('Date and Time is required').typeError('Invalid date and time'),
        eventType: Yup.string()
            .trim()
            .required('Event type is required')
            .test('not-only-spaces', 'Event type cannot be only spaces', (value) => /\S/.test(value)),
        meetingLink: Yup.string()
            .trim()
            .when('eventType', {
                is: 'Online',
                then: () =>
                    Yup.string()
                        .required('Meeting link is required for online events')
                        .test('not-only-spaces', 'Meeting link cannot be only spaces', (value) => /\S/.test(value)),
                otherwise: () => Yup.string().trim()
            }),
        attendees: Yup.array().min(1, 'Select at least one attendee')
    });

    const handleFormSubmit = (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            if (eventId) {
                toast.success('Event updated successfully!');
            } else {
                const newEvent = {
                    id: eventsDummyData.length + 1,
                    ...values,
                    thumbnailUrl: eventThumbnail
                };
                toast.success(`${newEvent.topic} added successfully!`);
            }
            resetForm();
            setSubmitting(false);
            navigate(`/${role}/events`);
        }, 1000);
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
                    <h4 className="mb-3 new-event-title">{eventId ? 'Event Details' : 'Schedule Event'}</h4>
                    <Formik
                        initialValues={eventData}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit, values }) => (
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
                                                            <div className="image-preview">
                                                                <img
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        inputRef.current.click();
                                                                    }}
                                                                    src={imagePreview}
                                                                    alt=""
                                                                />
                                                                <span className="ms-2">
                                                                    Upload your event Thumbnail here.
                                                                    <br />
                                                                    Supported formats:{' '}
                                                                    <strong>.jpg, .jpeg, or .png</strong>
                                                                    <br />
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            inputRef.current.click();
                                                                        }}
                                                                        className="upload-image-btn"
                                                                    >
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
                                    <Col md={6} xs={12}>
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
                                        <Field name="dateAndTime" className="field-control" type="datetime-local" />
                                        <ErrorMessage name="dateAndTime" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        {/* eslint-disable */}
                                        <label className="field-label">Type of Event</label>
                                        <Field
                                            name="eventType"
                                            className="field-select-control"
                                            as="select"
                                            placeholder="Select a type of event..."
                                            component={({ field, form }) => {
                                                const handleSelect = (eventKey) => {
                                                    const selectedEvent = [
                                                        { value: 'Physical', label: 'Physical', id: 1 },
                                                        { value: 'Online', label: 'Online', id: 2 }
                                                    ].find((event) => event.id.toString() === eventKey);
                                                    form.setFieldValue(field.name, selectedEvent.label);
                                                };

                                                return (
                                                    <>
                                                        <DropdownButton
                                                            title={
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span>{field.value || 'Select a event ...'}</span>
                                                                    <img src={dropDownArrow} alt="arrow" />
                                                                </div>
                                                            }
                                                            id={field.name}
                                                            onSelect={handleSelect}
                                                            className="dropdown-button w-100"
                                                        >
                                                            {[
                                                                { value: 'Physical', label: 'Physical', id: 1 },
                                                                { value: 'Online', label: 'Online', id: 2 }
                                                            ].map((event) => (
                                                                <Dropdown.Item
                                                                    key={event.id}
                                                                    eventKey={event.id}
                                                                    className="my-1 ms-2 w-100"
                                                                >
                                                                    <span className="country-name">{event.label}</span>
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
                                            {[
                                                { value: 'Physical', label: 'Physical', id: 1 },
                                                { value: 'Online', label: 'Online', id: 2 }
                                            ].map((event) => (
                                                <option key={event.id} value={event.value}>
                                                    {event.label}
                                                </option>
                                            ))}
                                        </Field>
                                    </Col>
                                    <Col md={6} xs={12}>
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
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Attendees</label>
                                        <FieldArray name="attendees">
                                            {({ form }) => (
                                                <CustomSelect
                                                    name="attendees"
                                                    options={studentDummyData.map((student) => ({
                                                        value: student.id,
                                                        label: student.name
                                                    }))}
                                                    isMulti={true}
                                                    value={values.attendees}
                                                    placeholder="Select or search attendees..."
                                                    onChange={(selectedOptions) => {
                                                        form.setFieldValue('attendees', selectedOptions);
                                                    }}
                                                    onBlur={() => form.setFieldTouched('attendees', true)}
                                                />
                                            )}
                                        </FieldArray>
                                        <ErrorMessage name="attendees" component="div" className="error mt-2" />
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
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                {isSubmitting
                                                    ? eventId
                                                        ? 'Saving Changes...'
                                                        : 'Adding Event...'
                                                    : eventId
                                                      ? 'Save Changes'
                                                      : 'Add Event'}
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
