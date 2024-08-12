import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import UploadSimple from '@icons/UploadSimple.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ImageCropper from '../../../../components/ImageMask/ImageCropper';
import Input from '@components/Input/Input';
import { eventType } from '../../../../data/data';
import Loading from '@components/Loading/Loading';
import axiosWrapper from '../../../../utils/api';
import { API_URL } from '../../../../utils/apiUrl';
import { getFileObjectFromBlobUrl } from '../../../../utils/utils';
import * as types from '../../../../redux/actions/actionTypes';
import '../../../../styles/Events.scss';
import '../../../../styles/Common.scss';
import { currentDate, oneYearsLater } from '../../../../utils/common';

const NewEvent = () => {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const [eventThumbnail, setEventThumbnail] = useState(null);
    const location = useLocation();
    const eventId = location.state?.eventId;
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role;
    const navigate = useNavigate();
    const [cropping, setCropping] = useState(false);
    const [isAuthCalled, setIsAuthCalled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [studentsData, setStudentsData] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [eventData, setEventData] = useState({
        topic: '',
        dateTime: '',
        typeOfEvent: 'Online',
        meetingLink: '',
        attendees: [],
        location: ''
    });

    useEffect(() => {
        if (eventId) {
            getSingleEvent(eventId);
        }
    }, [eventId]);

    const getSingleEvent = async (id) => {
        const response = await axiosWrapper('GET', API_URL.GET_EVENT.replace(':id', id), {}, token);
        const event = response.data;

        setEventData({
            topic: event.topic,
            dateTime: new Date(event.dateTime).toISOString().slice(0, -1),
            typeOfEvent: event.typeOfEvent,
            meetingLink: event.meetingLink,
            location: event.location,
            attendees: event.attendees.map((attendee) => attendee._id)
        });
        setEventThumbnail(event.thumbnail || null);
    };

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

    const handleCropComplete = async (croppedImage) => {
        const file = await getFileObjectFromBlobUrl(croppedImage, 'event.jpg');
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        setEventThumbnail(mediaFile.data[0].path);
        setCropping(false);
    };

    const validationSchema = Yup.object({
        topic: Yup.string()
            .trim()
            .required('Topic is required')
            .test('not-only-spaces', 'Topic cannot be only spaces', (value) => /\S/.test(value)),
        dateTime: Yup.date().required('Date and Time is required').typeError('Invalid date and time'),
        typeOfEvent: Yup.string()
            .trim()
            .required('Event type is required')
            .test('not-only-spaces', 'Event type cannot be only spaces', (value) => /\S/.test(value)),
        meetingLink: Yup.string()
            .trim()
            .when('typeOfEvent', {
                is: 'Online',
                then: () =>
                    Yup.string()
                        .required('Meeting link is required for online events')
                        .test('not-only-spaces', 'Meeting link cannot be only spaces', (value) => /\S/.test(value)),
                otherwise: () => Yup.string().trim()
            }),
        location: Yup.string()
            .trim()
            .when('typeOfEvent', {
                is: 'Onsite',
                then: () =>
                    Yup.string()
                        .required('Location is required for Onsite events')
                        .test('not-only-spaces', 'location cannot be only spaces', (value) => /\S/.test(value)),
                otherwise: () => Yup.string().trim()
            }),
        attendees: Yup.array().min(1, 'Select at least one attendee')
    });

    const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
        const eventPayload = {
            ...values,
            thumbnail: eventThumbnail
        };

        if (eventPayload.typeOfEvent === 'ONLINE') {
            delete eventPayload.location;
        } else if (eventPayload.typeOfEvent === ' ONSITE') {
            delete eventPayload.meetingLink;
        }

        try {
            if (eventId) {
                await axiosWrapper('PUT', API_URL.UPDATE_EVENT.replace(':id', eventId), eventPayload, token);
            } else {
                await axiosWrapper('POST', API_URL.CREATE_EVENT, eventPayload, token);
            }
            resetForm();
            navigate(`/${role}/events`);
        } catch (error) {
            setSubmitting(false);
        } finally {
            setSubmitting(false);
        }
    };

    const auth = async () => {
        setLoading(true);
        // Later we will replace this with actual API call
        try {
            const { data } = await axiosWrapper('GET', `${API_URL.AUTH}`, {}, token);
            if (data.url) {
                toast.loading('Redirecting to Google Calendar Authentication...');
                dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'eventId', data: eventId } });
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
            setEventData((prev) => ({
                ...prev,
                meetingLink: ''
            }));
        };
    }, [userInfo, token]);

    useEffect(() => {
        if (userInfo) {
            if (userInfo?.meetingLink) {
                setEventData((prev) => ({
                    ...prev,
                    typeOfEvent: 'ONLINE',
                    meetingLink: userInfo.meetingLink
                }));
            }
        }
    }, []);

    useEffect(() => {
        // Fetch data from API here
        getAllStudents();
    }, []);

    const getAllStudents = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            const { data } = await axiosWrapper('GET', `${API_URL.GET_ALL_STUDENTS}`, {}, token);
            const students = data.map((student) => ({
                value: student._id,
                label: student.name
            }));

            setStudentsData(students);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="new-event-page-wrapper">
                    <div className="title-top">
                        <span onClick={() => navigate(`/${role?.toLowerCase()}/events`)} style={{ cursor: 'pointer' }}>
                            Events <img src={CaretRight} alt=">" />
                        </span>{' '}
                        {eventId ? 'Event Details' : 'Create New Event'}
                    </div>
                    <div className="new-event-page">
                        <Container fluid className="p-3">
                            <h4 className="mb-3 new-event-title">Schedule Event</h4>
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
                                                                                        : URL.createObjectURL(
                                                                                              eventThumbnail
                                                                                          )
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
                                                                                <img
                                                                                    src={UploadSimple}
                                                                                    alt="Upload Btn"
                                                                                />
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
                                                <Field
                                                    name="dateTime"
                                                    className="field-control"
                                                    type="datetime-local"
                                                    min={currentDate}
                                                    max={oneYearsLater}
                                                    onClick={(e) => e.target.showPicker()}
                                                    step="60"
                                                />
                                                <ErrorMessage name="dateTime" component="div" className="error" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                {/* eslint-disable */}
                                                <label className="field-label">Type of Event</label>
                                                <Field
                                                    name="typeOfEvent"
                                                    className="field-select-control"
                                                    as="select"
                                                    placeholder="Select a type of event..."
                                                    component={({ field, form }) => {
                                                        const handleSelect = (eventKey) => {
                                                            const selectedEvent = eventType.find(
                                                                (event) => event.id.toString() === eventKey
                                                            );
                                                            form.setFieldValue(field.name, selectedEvent.value);
                                                        };

                                                        return (
                                                            <>
                                                                <DropdownButton
                                                                    title={
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <span>
                                                                                {eventType.find(
                                                                                    (e) => e.value === field.value
                                                                                )?.label || 'Select a event ...'}
                                                                            </span>
                                                                            <img src={dropDownArrow} alt="arrow" />
                                                                        </div>
                                                                    }
                                                                    id={field.name}
                                                                    onSelect={handleSelect}
                                                                    className="dropdown-button w-100"
                                                                >
                                                                    {eventType.map((event) => (
                                                                        <Dropdown.Item
                                                                            key={event.id}
                                                                            eventKey={event.id}
                                                                            className="my-1 ms-2 w-100"
                                                                        >
                                                                            <span className="country-name">
                                                                                {event.label}
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                    ))}
                                                                </DropdownButton>
                                                                {form.touched[field.name] &&
                                                                    form.errors[field.name] && (
                                                                        <div className="error mt-2">
                                                                            {form.errors[field.name]}
                                                                        </div>
                                                                    )}
                                                            </>
                                                        );
                                                    }}
                                                >
                                                    {eventType.map((event) => (
                                                        <option key={event.id} value={event.value}>
                                                            {event.label}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </Col>
                                            {values.typeOfEvent === 'ONSITE' ? (
                                                <Col md={6} xs={12}>
                                                    <label className="field-label">Map Location</label>
                                                    <Field
                                                        name="location"
                                                        className="field-control"
                                                        type="text"
                                                        placeholder="https://www.google.com/maps/place/Netherlands/"
                                                    />
                                                    <ErrorMessage name="location" component="div" className="error" />
                                                </Col>
                                            ) : (
                                                <Col md={6} xs={12}>
                                                    <label className="field-label">Meeting Link</label>
                                                    <Field
                                                        name="meetingLink"
                                                        className="field-control"
                                                        type="text"
                                                        placeholder="https://zoom.us/j/97697547647?pwd=UytOUjFlUTlPRjYvbmJnQ0pvZ2RDUT09"
                                                    />
                                                    <ErrorMessage
                                                        name="meetingLink"
                                                        component="div"
                                                        className="error"
                                                    />
                                                </Col>
                                            )}
                                        </Row>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <Input
                                                    options={studentsData}
                                                    name="attendees"
                                                    placeholder="Select or search attendees..."
                                                    label="Attendees"
                                                    type="select"
                                                    isMulti={true}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="mt-3 d-flex justify-content-end gap-3">
                                                    <Button
                                                        type="button"
                                                        onClick={() => navigate(`/${role?.toLowerCase()}/events`)}
                                                        className="cancel-btn"
                                                        disabled={isSubmitting}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="submit-btn"
                                                        disabled={isSubmitting}
                                                    >
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
            )}
        </>
    );
};

export default NewEvent;
