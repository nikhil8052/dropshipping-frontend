import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import CustomSelect from '../../../../components/Input/Select';
import { coachDummyData, studentDummyData, countryList, regions } from '../../../../data/data';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageCropper from '../../../../components/ImageMask/ImageCropper';
import UploadSimple from '@icons/UploadSimple.svg';
import RichTextEditor from '@components/RichTextEditor/RichTextEditor';
import Input from '@components/Input/Input';
import '../../../../styles/Coaches.scss';
import '../../../../styles/Common.scss';
import { useSelector } from 'react-redux';

const NewCoach = () => {
    const inputRef = useRef();
    const [coachPhoto, setCoachPhoto] = useState(null);
    const location = useLocation();
    const coachId = location.state?.coachId;
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const navigate = useNavigate();
    const [cropping, setCropping] = useState(false);

    const [imageSrc, setImageSrc] = useState(null);
    const [coachData, setCoachData] = useState({
        coachName: '',
        coachEmail: '',
        phoneNumber: '',
        country: '',
        region: '',
        assignedStudents: [],
        highTicketSpots: '',
        lowTicketSpots: '',
        bio: '',
        coachType: ''
    });

    useEffect(() => {
        if (coachId) {
            const coach = coachDummyData.find((coach) => coach.id === coachId);
            if (coach) {
                setCoachPhoto(coach.avatarUrl);
                setCoachData({
                    coachName: coach.name,
                    coachEmail: coach.email,
                    phoneNumber: coach.phoneNumber,
                    country: coach.country,
                    region: coach.region,
                    assignedStudents: coach.assignedStudents,
                    highTicketSpots: coach.highTicketSpots,
                    lowTicketSpots: coach.lowTicketSpots,
                    bio: coach.bio
                });
            }
        }
    }, [coachId]);

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
        setCoachPhoto(croppedImage);
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
        coachName: Yup.string().required('Coach name is required'),
        coachEmail: Yup.string().email('Invalid email address').required('Coach email is required'),
        phoneNumber: Yup.string().required('Phone number is required'),
        country: Yup.string().required('Country is required'),
        region: Yup.string().required('Region is required'),
        assignedStudents: Yup.array().min(1, 'Select at least one student'),
        highTicketSpots: Yup.number().when('coachType', {
            is: 'high',
            then: () => Yup.number().required('High ticket spots are required').positive('Must be a positive number'),
            otherwise: () => Yup.number()
        }),
        lowTicketSpots: Yup.number().when('coachType', {
            is: 'low',
            then: () => Yup.number().required('Low ticket spots are required').positive('Must be a positive number'),
            otherwise: () => Yup.number()
        }),
        bio: Yup.string(),
        coachType: Yup.string().required('Please select the coach type')
    });

    const handleFormSubmit = (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            if (coachId) {
                const updatedCoaches = coachDummyData.map((coach) =>
                    coach.id === coachId ? { ...coach, ...values, avatarUrl: coachPhoto } : coach
                );
                toast.success(`New coach:${updatedCoaches.coachName || updatedCoaches.name} Updated successfully!`);
            } else {
                const newCoach = {
                    id: coachDummyData.length + 1,
                    ...values,
                    avatarUrl: coachPhoto
                };
                toast.success(`New coach:${newCoach.coachName || newCoach.name} added successfully!`);
            }
            resetForm();
            setSubmitting(false);
            navigate(`/${role}/coaches`);
        }, 1000);
    };

    const ticketRender = (ticket) => {
        return (
            <Col md={6} xs={12}>
                <label className="field-label">
                    {ticket.slice(0, 1).toUpperCase() + ticket.slice(1)} Ticket Student Spots
                </label>
                <Field name={`${ticket}TicketSpots`} className="field-control" type="number" placeholder="5" min={1} />
                <ErrorMessage name={`${ticket}TicketSpots`} component="div" className="error" />
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
                                            name="coachName"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g David Henderson"
                                        />
                                        <ErrorMessage name="coachName" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Coach Email</label>
                                        <Field
                                            name="coachEmail"
                                            className="field-control"
                                            type="email"
                                            placeholder="kevin12345@gmail.com"
                                        />
                                        <ErrorMessage name="coachEmail" component="div" className="error" />
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

                                <Row className="mb-3">
                                    <Col md={6} xs={12}>
                                        <Input
                                            name="coachType"
                                            placeholder="Please Select the Coach Type"
                                            label="Coach Type"
                                            type="radio"
                                            options={[
                                                {
                                                    label: 'High Ticket',
                                                    value: 'high'
                                                },
                                                {
                                                    label: 'Low Ticket',
                                                    value: 'low'
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
                                            component={({ field }) => (
                                                <RichTextEditor field={field} className="field-quill-control" />
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
