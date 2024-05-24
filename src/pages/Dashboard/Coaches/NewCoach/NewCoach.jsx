import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomSelect from '../../../../components/Input/Select';
import { coachDummyData, studentDummyData, countryList } from '../../../../data/data';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageCropper from '../../../../components/ImageMask/ImageCropper';

const NewCoach = () => {
    const inputRef = useRef();
    const [coachPhoto, setCoachPhoto] = useState(null);
    const location = useLocation();
    const coachId = location.state?.coachId;
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
        bio: ''
    });

    useEffect(() => {
        if (coachId) {
            // For now it is a dummy data, later we will replace it with actual API call

            // Fetch data from API here
            const coach = coachDummyData.find((coach) => coach.id === coachId);
            // later we add the details to the form
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

    return (
        <div className="new-coach-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate('/admin/coaches')} style={{ cursor: 'pointer' }}>
                    Coaches <img src={CaretRight} alt=">" />
                </span>{' '}
                {coachId ? 'Coach Profile' : 'Add New Coach'}
            </div>
            <div className="new-coach-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 new-coach-title">{coachId ? 'Coach Profile' : 'Add New Coach'}</h4>
                    <Formik
                        initialValues={coachData}
                        validationSchema={Yup.object({
                            coachName: Yup.string().required('Coach name is required'),
                            coachEmail: Yup.string().email('Invalid email address').required('Coach email is required'),
                            phoneNumber: Yup.string().required('Phone number is required'),
                            country: Yup.string().required('Country is required'),
                            region: Yup.string().required('Region is required'),
                            assignedStudents: Yup.array().min(1, 'Select at least one student'),
                            highTicketSpots: Yup.number()
                                .required('High ticket spots are required')
                                .positive('Must be a positive number'),
                            lowTicketSpots: Yup.number()
                                .required('Low ticket spots are required')
                                .positive('Must be a positive number'),
                            bio: Yup.string()
                        })}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            setTimeout(() => {
                                // Implement form submission logic here
                                resetForm();
                                setSubmitting(false);
                                navigate('/admin/coaches');
                            }, 1000);
                        }}
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
                                                            <div
                                                                className="image-preview"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    inputRef.current.click();
                                                                }}
                                                            >
                                                                <img src={imagePreview} alt="" />
                                                                <span>
                                                                    Upload Coach Picture here
                                                                    <br />
                                                                    Supported formats:{' '}
                                                                    <strong>.jpg, .jpeg, or .png</strong>
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
                                            type="number"
                                            placeholder="+1-202-555-0118"
                                        />
                                        <ErrorMessage name="phoneNumber" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Country</label>
                                        <Field
                                            name="country"
                                            className="field-select-control"
                                            as="select"
                                            placeholder="United States"
                                        >
                                            <option defaultChecked value="">
                                                Select a country...
                                            </option>
                                            {countryList.map((country) => (
                                                <option key={country.id} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="country" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Region/State</label>
                                        <Field
                                            name="region"
                                            className="field-select-control"
                                            as="select"
                                            placeholder="Select..."
                                        >
                                            {studentDummyData.map((student) => (
                                                <option key={student.id} value={student.name}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="region" component="div" className="error" />
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
                                                        // Update the array with only the selected options
                                                        form.setFieldValue('assignedStudents', selectedOptions);
                                                    }}
                                                    onBlur={() => form.setFieldTouched('assignedStudents', true)}
                                                />
                                            )}
                                        </FieldArray>
                                        <ErrorMessage name="assignedStudents" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">High Ticket student spots</label>
                                        <Field
                                            name="highTicketSpots"
                                            className="field-control"
                                            type="number"
                                            placeholder="5"
                                        />
                                        <ErrorMessage name="highTicketSpots" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Low Ticket Student Spots</label>
                                        <Field
                                            name="lowTicketSpots"
                                            className="field-control"
                                            type="number"
                                            placeholder="10"
                                        />
                                        <ErrorMessage name="lowTicketSpots" component="div" className="error" />
                                    </Col>
                                </Row>
                                {/* Commenting for future use */}
                                {/* <Row>
                                    <Col>
                                        <div className="field-label my-2">List of students Taught</div>
                                        <div className="student-taught-wrapper">
                                            <span className="total">All Students ({studentDummyData.length})</span>
                                            {studentDummyData.map((student) => (
                                                <span key={student.id} className=" data-value">
                                                    {student.name}
                                                </span>
                                            ))}
                                        </div>
                                    </Col>
                                </Row> */}
                                <Row>
                                    <Col>
                                        <label className="field-label">
                                            Bio <span className="label-light">(Optional)</span>
                                        </label>
                                        <Field
                                            name="bio"
                                            value={values.bio}
                                            as="textarea"
                                            placeholder="Enter Bio"
                                            render={({ field }) => (
                                                <ReactQuill
                                                    {...field}
                                                    value={field.value || ''}
                                                    name={field.name}
                                                    onChange={(value) => field.onChange(field.name)(value)} // Update the form value
                                                    className="field-quill-control"
                                                    modules={{ toolbar: true }}
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
                                                onClick={() => navigate('/admin/coaches')}
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
