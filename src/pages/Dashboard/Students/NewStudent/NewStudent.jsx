import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { coachingTrajectory, countryList, regions, studentDummyData, studentProducts } from '../../../../data/data';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import RoadMapList from '../Roadmap/RoadmapList';
import { useSelector } from 'react-redux';
import CarouselWrapper from '@components/Carousel/CarouselWrapper';
import ImageCropper from '@components/ImageMask/ImageCropper';
import '../../../../styles/Students.scss';
import '../../../../styles/Common.scss';

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
        coachingTrajectory: '',
        coursesRoadmap: []
    });

    const schema = Yup.object({
        studentName: Yup.string().required('Please enter the student name'),
        studentId: Yup.string().required('Please enter the student id'),
        studentEmail: Yup.string().email('Please enter a valid email address').required('Email address is required'),
        phoneNumber: Yup.string().required('Please enter a phone number'),
        country: Yup.string().required('Please select a country'),
        region: Yup.string().required('Please select a region'),
        coachingTrajectory: Yup.string().required('Please select a coaching trajectory'),
        coursesRoadmap: Yup.array().min(1, 'Please select at least one course')
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
                    coursesRoadmap: student.coursesRoadmap,
                    coachingTrajectory: student.coachingTrajectory
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

    const handleFormSubmit = (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            if (studentId) {
                const updatedStudents = studentDummyData.map((student) =>
                    student.id === studentId ? { ...student, ...values, avatarUrl: studentPhoto } : student
                );
                toast.success(
                    `New Student:${updatedStudents.studentName || updatedStudents.name} Updated successfully!`
                );
            } else {
                const newStudent = {
                    id: studentDummyData.length + 1,
                    ...values,
                    avatarUrl: studentPhoto
                };
                toast.success(`New Student:${newStudent.studentName || newStudent.name} added successfully!`);
            }
            resetForm();
            setSubmitting(false);
            navigate(`/${role}/students`);
        }, 1000);
    };

    return (
        <div className="new-student-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/students`)} style={{ cursor: 'pointer' }}>
                    Students <img src={CaretRight} alt=">" />
                </span>
                {studentId ? 'Student Profile' : 'Add New Student'}
            </div>
            <div className="new-student-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 new-student-title">{studentId ? 'Student Profile' : 'Add New Student'}</h4>
                    <Formik
                        initialValues={studentData}
                        validationSchema={schema}
                        onSubmit={handleFormSubmit}
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
                                            <Field name="studentPhoto">
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
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Region/State</label>
                                        {/* eslint-disable */}
                                        <Field
                                            name="region"
                                            className="field-select-control"
                                            type="text"
                                            component={({ field, form }) => {
                                                const handleSelect = (eventKey) => {
                                                    const selectedRegion = regions.find(
                                                        (country) => country.id.toString() === eventKey
                                                    );
                                                    form.setFieldValue(field.name, selectedRegion.label);
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
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Coaching Trajectory</label>
                                        {/* eslint-disable */}
                                        <Field
                                            name="coachingTrajectory"
                                            className="field-select-control"
                                            type="text"
                                            component={({ field, form }) => {
                                                const handleSelect = (eventKey) => {
                                                    const selectedField = coachingTrajectory.find(
                                                        (coach) => coach.id.toString() === eventKey
                                                    );
                                                    form.setFieldValue(field.name, selectedField.label);
                                                };

                                                return (
                                                    <>
                                                        <DropdownButton
                                                            title={
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span>{field.value || 'Select ...'}</span>
                                                                    <img src={dropDownArrow} alt="arrow" />
                                                                </div>
                                                            }
                                                            id={field.name}
                                                            onSelect={handleSelect}
                                                            className="dropdown-button w-100"
                                                        >
                                                            {coachingTrajectory.map((coach) => (
                                                                <Dropdown.Item
                                                                    key={coach.id}
                                                                    eventKey={coach.id}
                                                                    className="my-1 ms-2 w-100"
                                                                >
                                                                    <span className="coach-name">{coach.label}</span>
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
                                            {coachingTrajectory.map((region) => (
                                                <option key={region.label} value={region.value}>
                                                    {region.label}
                                                </option>
                                            ))}
                                        </Field>
                                    </Col>

                                    {!studentId && (
                                        <Col md={6} xs={12}>
                                            <label className="field-label">Courses Roadmap</label>
                                            {/* eslint-disable */}
                                            <Field
                                                name="coursesRoadmap"
                                                component={({
                                                    field, // { name, value, onChange, onBlur }
                                                    form // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                }) => (
                                                    <Select
                                                        {...field}
                                                        className="custom-multi-select"
                                                        isMulti
                                                        options={[
                                                            { value: 'metadata', label: 'Meta Data Course', id: 1 },
                                                            {
                                                                value: 'msoffice',
                                                                label: 'Microsoft Office Expert',
                                                                id: 2
                                                            }
                                                        ]}
                                                        value={values.coursesRoadmap}
                                                        onChange={(selectedOptions) => {
                                                            // Update the array with only the selected options
                                                            form.setFieldValue('coursesRoadmap', selectedOptions);
                                                        }}
                                                        closeMenuOnSelect={false}
                                                    />
                                                )}
                                            />
                                            <ErrorMessage
                                                name="coursesRoadmap"
                                                component="div"
                                                className="error mt-2"
                                            />
                                        </Col>
                                    )}
                                </Row>

                                <Row>
                                    <Col>
                                        {values.coursesRoadmap?.length > 0 && (
                                            <>
                                                <div className="field-label my-2">Courses Roadmap List </div>
                                                <div className="course-roadmap-wrapper">
                                                    <RoadMapList coursesList={values.coursesRoadmap} />
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
