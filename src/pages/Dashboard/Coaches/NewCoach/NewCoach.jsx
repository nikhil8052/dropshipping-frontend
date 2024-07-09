import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import CustomSelect from '../../../../components/Input/Select';
import { studentDummyData, countryList, regions, COACH } from '../../../../data/data';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageCropper from '../../../../components/ImageMask/ImageCropper';
import UploadSimple from '@icons/UploadSimple.svg';
import RichTextEditor from '@components/RichTextEditor/RichTextEditor';
import Input from '@components/Input/Input';
import { useSelector } from 'react-redux';
import { API_URL } from '../../../../utils/apiUrl';
import { getFileObjectFromBlobUrl } from '../../../../utils/utils';
import axiosWrapper from '../../../../utils/api';
import '../../../../styles/Coaches.scss';
import '../../../../styles/Common.scss';

const NewCoach = () => {
    const inputRef = useRef();
    const [coachPhoto, setCoachPhoto] = useState(null);
    const location = useLocation();
    const coachId = location.state?.coachId;
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
    const navigate = useNavigate();
    const [cropping, setCropping] = useState(false);

    const [imageSrc, setImageSrc] = useState(null);
    const [coachData, setCoachData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        country: '',
        region: '',
        assignedStudents: [],
        highTicketStudentSpots: '',
        lowTicketStudentSpots: '',
        bio: '',
        coachType: COACH.COACH_TYPE.LOW_TICKET
    });

    useEffect(() => {
        if (coachId) {
            getSingleCoachById(coachId);
        }
    }, [coachId]);

    const getSingleCoachById = async (id) => {
        const response = await axiosWrapper('GET', API_URL.GET_COACH.replace(':id', id), {}, token);
        const coach = response.data;
        setCoachData((prev) => ({
            ...prev,
            name: coach.name,
            email: coach.email,
            phoneNumber: coach.phoneNumber,
            country: coach.country,
            region: coach.region,
            assignedStudents: coach.assignedStudents,
            highTicketStudentSpots: coach.highTicketStudentSpots,
            lowTicketStudentSpots: coach.lowTicketStudentSpots,
            bio: coach.bio,
            coachType: coach.coachType
        }));
        setCoachPhoto(coach.avatar);
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
        const file = await getFileObjectFromBlobUrl(croppedImage, 'coachAvatar.jpg');
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        setCoachPhoto(mediaFile.data[0].path);
        setCropping(false);
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Coach name is required'),
        email: Yup.string().email('Invalid email address').required('Coach email is required'),
        phoneNumber: Yup.string().required('Phone number is required'),
        country: Yup.string().required('Country is required'),
        region: Yup.string().required('Region is required'),
        assignedStudents: Yup.array().optional(),
        highTicketStudentSpots: Yup.number().when('coachType', {
            is: COACH.COACH_TYPE.HIGH_TICKET,
            then: () => Yup.number().required('High ticket spots are required').positive('Must be a positive number'),
            otherwise: () => Yup.number()
        }),
        lowTicketStudentSpots: Yup.number().when('coachType', {
            is: COACH.COACH_TYPE.LOW_TICKET,
            then: () => Yup.number().required('Low ticket spots are required').positive('Must be a positive number'),
            otherwise: () => Yup.number()
        }),
        bio: Yup.string(),
        coachType: Yup.string()
            .oneOf([COACH.COACH_TYPE.HIGH_TICKET, COACH.COACH_TYPE.LOW_TICKET])
            .required('Please select the coach type')
    });

    const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
        if (values.coachType === COACH.COACH_TYPE.HIGH_TICKET) {
            delete values.lowTicketStudentSpots;
        } else {
            delete values.highTicketStudentSpots;
        }
        if (coachId) delete values.email;

        const formData = { ...values, avatar: coachPhoto };
        const url = coachId ? `${API_URL.UPDATE_COACH.replace(':id', coachId)}` : API_URL.CREATE_COACH;
        const method = coachId ? 'PUT' : 'POST';

        await axiosWrapper(method, url, formData, token);
        resetForm();
        setSubmitting(false);
        navigate(`/${role}/coaches`);
    };

    const ticketRender = (ticket) => {
        const ticketType = ticket === COACH.COACH_TYPE.HIGH_TICKET ? 'High' : 'Low';
        return (
            <Col md={6} xs={12}>
                <label className="field-label">{ticketType} Ticket Student Spots</label>
                <Field
                    name={`${ticketType.toLowerCase()}TicketStudentSpots`}
                    className="field-control"
                    type="number"
                    placeholder="5"
                    min={1}
                />
                <ErrorMessage
                    name={`${ticketType.toLowerCase()}TicketStudentSpots`}
                    component="div"
                    className="error"
                />
            </Col>
        );
    };

    return (
        <div className="new-coach-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/coaches`)} style={{ cursor: 'pointer' }}>
                    Coaches <img src={CaretRight} alt=">" />
                </span>{' '}
                {coachId ? 'Coach Profile' : 'Add New Coach'}
            </div>
            <div className="new-coach-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 new-coach-title">{coachId ? 'Coach Profile' : 'Add New Coach'}</h4>
                    <Formik
                        initialValues={coachData}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col>
                                        {coachPhoto ? (
                                            <label className="field-label fw-bold">Profile image</label>
                                        ) : (
                                            <label className="field-label">
                                                UPLOAD PHOTO <span className="label-light">(Mandatory)</span>
                                            </label>
                                        )}
                                        <div className="image_wrapper">
                                            <Field name="coachPhoto">
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
                                                        {coachPhoto ? (
                                                            <div className="image-renderer">
                                                                <div className="img-wrapper">
                                                                    <img
                                                                        src={
                                                                            typeof coachPhoto === 'string'
                                                                                ? coachPhoto
                                                                                : URL.createObjectURL(coachPhoto)
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
                                                                <span>{coachPhoto.name}</span>
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
                                                                <span>
                                                                    Upload Coach Picture here
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
                                        <label className="field-label">Coach Name</label>
                                        <Field
                                            name="name"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g David Henderson"
                                        />
                                        <ErrorMessage name="name" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Coach Email</label>
                                        <Field
                                            name="email"
                                            className="field-control"
                                            type="email"
                                            readOnly={coachId}
                                            placeholder="kevin12345@gmail.com"
                                        />
                                        <ErrorMessage name="email" component="div" className="error" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Phone Number</label>
                                        <Field
                                            name="phoneNumber"
                                            className="field-control"
                                            type="text"
                                            placeholder="+1-202-555-0118"
                                        />
                                        <ErrorMessage name="phoneNumber" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Country</label>
                                        {/* eslint-disable */}
                                        <Field
                                            name="country"
                                            className="field-select-control"
                                            type="text"
                                            component={({ field, form }) => {
                                                const handleSelect = (eventKey) => {
                                                    const selectedCountry = countryList.find(
                                                        (country) => country.id.toString() === eventKey
                                                    );
                                                    form.setFieldValue(field.name, selectedCountry.name);
                                                };

                                                return (
                                                    <>
                                                        <DropdownButton
                                                            title={
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span>{field.value || 'Select a country ...'}</span>
                                                                    <img src={dropDownArrow} alt="arrow" />
                                                                </div>
                                                            }
                                                            id={field.name}
                                                            onSelect={handleSelect}
                                                            className="dropdown-button w-100"
                                                        >
                                                            {countryList.map((country) => (
                                                                <Dropdown.Item
                                                                    key={country.id}
                                                                    eventKey={country.id}
                                                                    className="my-1 ms-2 w-100"
                                                                >
                                                                    <span className="country-name">{country.name}</span>
                                                                </Dropdown.Item>
                                                            ))}
                                                        </DropdownButton>
                                                        {form.touched[field.name] && form.errors[field.name] && (
                                                            <div className="error mt-2">{form.errors[field.name]}</div>
                                                        )}
                                                    </>
                                                );
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Region/State</label>
                                        {/* eslint-disable */}
                                        <Field
                                            name="region"
                                            className="field-select-control"
                                            type="text"
                                            component={({ field, form }) => {
                                                const handleSelect = (eventKey) => {
                                                    const selectedCountry = regions.find(
                                                        (country) => country.id.toString() === eventKey
                                                    );
                                                    form.setFieldValue(field.name, selectedCountry.label);
                                                };

                                                return (
                                                    <>
                                                        <DropdownButton
                                                            title={
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span>{field.value || 'Select a region ...'}</span>
                                                                    <img src={dropDownArrow} alt="arrow" />
                                                                </div>
                                                            }
                                                            id={field.name}
                                                            onSelect={handleSelect}
                                                            className="dropdown-button w-100"
                                                        >
                                                            {regions.map((country) => (
                                                                <Dropdown.Item
                                                                    key={country.id}
                                                                    eventKey={country.id}
                                                                    className="my-1 ms-2 w-100"
                                                                >
                                                                    <span className="country-name">
                                                                        {country.label}
                                                                    </span>
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
                                            {regions.map((region) => (
                                                <option key={region.label} value={region.value}>
                                                    {region.label}
                                                </option>
                                            ))}
                                        </Field>
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Assigned Students</label>
                                        <FieldArray name="assignedStudents">
                                            {({ form }) => (
                                                <CustomSelect
                                                    name="assignedStudents"
                                                    options={studentDummyData.map((student) => ({
                                                        value: student.id,
                                                        label: student.name
                                                    }))}
                                                    isMulti={true}
                                                    value={values.assignedStudents}
                                                    placeholder="Select or search students..."
                                                    onChange={(selectedOptions) => {
                                                        form.setFieldValue('assignedStudents', selectedOptions);
                                                    }}
                                                    onBlur={() => form.setFieldTouched('assignedStudents', true)}
                                                />
                                            )}
                                        </FieldArray>
                                        <ErrorMessage name="assignedStudents" component="div" className="error" />
                                    </Col>
                                </Row>

                                <Row className="mb-3 mt-2">
                                    <Col md={6} xs={12}>
                                        <Input
                                            name="coachType"
                                            placeholder="Please Select the Coach Type"
                                            label="Coach Type"
                                            type="radio"
                                            options={[
                                                {
                                                    label: 'High Ticket',
                                                    value: COACH.COACH_TYPE.HIGH_TICKET
                                                },
                                                {
                                                    label: 'Low Ticket',
                                                    value: COACH.COACH_TYPE.LOW_TICKET
                                                }
                                            ]}
                                        />
                                    </Col>
                                    {values.coachType && ticketRender(values.coachType)}
                                </Row>
                                <Row>
                                    <Col>
                                        <label className="field-label">
                                            Bio <span className="label-light">(Optional)</span>
                                        </label>
                                        {/* eslint-disable */}
                                        <Field
                                            name="bio"
                                            type="text"
                                            component={({ field, form }) => (
                                                <RichTextEditor
                                                    form={form}
                                                    field={field}
                                                    className="field-quill-control"
                                                />
                                            )}
                                        />

                                        <ErrorMessage name="bio" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-end gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => navigate(`/${role}/coaches`)}
                                                className="cancel-btn"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                {isSubmitting
                                                    ? coachId
                                                        ? 'Saving Changes...'
                                                        : 'Adding Coach...'
                                                    : coachId
                                                      ? 'Save Changes'
                                                      : 'Add Coach'}
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

export default NewCoach;
