import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { countryList, studentDummyData, studentProducts } from '../../../../data/data';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import RoadMapList from '../Roadmap/RoadmapList';
import { useSelector } from 'react-redux';
import CarouselWrapper from '@components/Carousel/CarouselWrapper';
import ImageCropper from '@components/ImageMask/ImageCropper';

const NewStudent = () => {
    const inputRef = useRef();
    const [studentPhoto, setStudentPhoto] = useState(null);
    const location = useLocation();
    const studentId = location.state?.studentId;
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const navigate = useNavigate();
    const [cropping, setCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [studentData, setStudentData] = useState({
        studentName: '',
        studentId: '',
        studentEmail: '',
        phoneNumber: '',
        country: '',
        region: '',
        assignedStudents: [],
        highTicketSpots: '',
        lowTicketSpots: '',
        bio: ''
    });

    const schema = Yup.object({
        studentName: Yup.string().required('Please enter the student name'),
        studentId: Yup.string().required('Please enter the student id'),
        studentEmail: Yup.string().email('Please enter a valid email address').required('Email address is required'),
        phoneNumber: Yup.string().required('Please enter a phone number'),
        country: Yup.string().required('Please select a country'),
        region: Yup.string().required('Please select a region'),
        assignedStudents: Yup.array().min(1, 'Please select at least one student'),
        highTicketSpots: Yup.number()
            .required('Number of high ticket spots is required')
            .positive('Number must be greater than zero'),
        lowTicketSpots: Yup.number()
            .required('Number of low ticket spots is required')
            .positive('Number must be greater than zero'),
        bio: Yup.string()
    });

    useEffect(() => {
        if (studentId) {
            // For now it is a dummy data, later we will replace it with actual API call

            // Fetch data from API here
            const student = studentDummyData.find((student) => student.id === studentId);
            // later we add the details to the form
            if (student) {
                setStudentPhoto(student.avatarUrl);
                setStudentData({
                    studentName: student.name,
                    studentId: student.id,
                    studentEmail: student.email,
                    phoneNumber: student.phoneNumber,
                    country: student.country,
                    region: student.region,
                    assignedStudents: student.assignedStudents,
                    highTicketSpots: student.highTicketSpots,
                    lowTicketSpots: student.lowTicketSpots,
                    bio: student.bio
                });
            }
        }
    }, [studentId]);

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
        setStudentPhoto(croppedImage);
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
        <div className="new-coach-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/students`)} style={{ cursor: 'pointer' }}>
                    Students <img src={CaretRight} alt=">" />
                </span>
                {studentId ? 'Student Profile' : 'Add New Student'}
            </div>
            <div className="new-coach-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 new-coach-title">{studentId ? 'Student Profile' : 'Add New Student'}</h4>
                    <Formik
                        initialValues={studentData}
                        validationSchema={schema}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            setTimeout(() => {
                                // Implement form submission logic here
                                resetForm();
                                setSubmitting(false);
                            }, 1000);
                        }}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col>
                                        {studentPhoto ? (
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
                                                        {studentPhoto ? (
                                                            <div className="image-renderer">
                                                                <div className="img-wrapper">
                                                                    <img
                                                                        src={
                                                                            typeof studentPhoto === 'string'
                                                                                ? studentPhoto
                                                                                : URL.createObjectURL(studentPhoto)
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
                                                                    <span>{studentPhoto.name}</span>
                                                                </div>
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
                                                                    Upload Student Picture here
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
                                        <label className="field-label">Student Name</label>
                                        <Field
                                            name="studentName"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g David Henderson"
                                        />
                                        <ErrorMessage name="studentName" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Student ID</label>
                                        <Field
                                            name="studentId"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g 65435"
                                        />
                                        <ErrorMessage name="studentId" component="div" className="error" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Email</label>
                                        <Field
                                            name="studentEmail"
                                            className="field-control"
                                            type="email"
                                            placeholder="kevin12345@gmail.com"
                                        />
                                        <ErrorMessage name="studentEmail" component="div" className="error" />
                                    </Col>
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
                                </Row>
                                <Row>
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
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Coaching Trajectory</label>
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
                                        <ErrorMessage name="assignedStudents" component="div" className="error" />
                                    </Col>

                                    {!studentId && (
                                        <Col md={6} xs={12}>
                                            <label className="field-label">Courses Roadmap</label>
                                            {/* eslint-disable */}
                                            <Field
                                                name="assignedStudents"
                                                component={({
                                                    field, // { name, value, onChange, onBlur }
                                                    form // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                }) => (
                                                    <Select
                                                        {...field}
                                                        isMulti
                                                        options={[
                                                            { value: 'metadata', label: 'Meta Data Course', id: 1 },
                                                            {
                                                                value: 'msoffice',
                                                                label: 'Microsoft Office Expert',
                                                                id: 2
                                                            }
                                                        ]}
                                                        value={values.assignedStudents}
                                                        onChange={(selectedOptions) => {
                                                            // Update the array with only the selected options
                                                            form.setFieldValue('assignedStudents', selectedOptions);
                                                        }}
                                                        closeMenuOnSelect={false}
                                                    />
                                                )}
                                            />
                                            <ErrorMessage name="assignedStudents" component="div" className="error" />
                                        </Col>
                                    )}
                                </Row>

                                <Row>
                                    <Col>
                                        {values.assignedStudents?.length > 0 && (
                                            <>
                                                <div className="field-label my-2">Courses Roadmap List </div>
                                                <div className="course-roadmap-wrapper">
                                                    <RoadMapList coursesList={values.assignedStudents} />
                                                </div>
                                            </>
                                        )}
                                    </Col>
                                </Row>

                                {studentId && (
                                    <>
                                        <Row>
                                            <Col>
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/${role}/visualize-csv`, {
                                                            state: { studentId }
                                                        })
                                                    }
                                                    className="submit-btn my-2"
                                                >
                                                    View Test Products
                                                </Button>
                                            </Col>
                                        </Row>

                                        <CarouselWrapper items={studentProducts} type="product" />
                                    </>
                                )}
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-end gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => navigate(`/${role}/students`)}
                                                className="cancel-btn"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                {isSubmitting
                                                    ? studentId
                                                        ? 'Saving Changes...'
                                                        : 'Adding Student...'
                                                    : studentId
                                                      ? 'Save Changes'
                                                      : 'Add Student'}
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

export default NewStudent;
