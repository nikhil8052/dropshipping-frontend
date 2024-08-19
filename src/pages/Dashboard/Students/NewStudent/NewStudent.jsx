import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import * as Yup from 'yup';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { coachingTrajectory, countryList, regions } from '../../../../data/data';
import toast from 'react-hot-toast';
import UploadSimple from '@icons/UploadSimple.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '@components/Input/Input';
import RoadMapList from '../Roadmap/RoadmapList';
import { useSelector } from 'react-redux';
import CarouselWrapper from '@components/Carousel/CarouselWrapper';
import ImageCropper from '@components/ImageMask/ImageCropper';
import { API_URL } from '../../../../utils/apiUrl';
import axiosWrapper from '../../../../utils/api';
import { getFileObjectFromBlobUrl } from '../../../../utils/utils';
import '../../../../styles/Students.scss';
import '../../../../styles/Common.scss';

const NewStudent = () => {
    const inputRef = useRef();
    const [studentPhoto, setStudentPhoto] = useState('');
    const location = useLocation();
    const studentId = location.state?.studentId;
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
    const navigate = useNavigate();
    const [cropping, setCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [courses, setCourses] = useState([]);
    const [studentProducts, setStudentProducts] = useState([]);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [studentData, setStudentData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        country: '',
        region: '',
        coachingTrajectory: 'HIGH_TICKET',
        coursesRoadmap: []
    });
    const [showModal, setShowModal] = useState({
        show: false,
        title: 'Update Trajectory',
        isEditable: false,
        studentId: null
    });

    const schema = Yup.object({
        name: Yup.string()
            .trim()
            .required('Please enter the student name')
            .matches(/\S/, 'Student name cannot be empty or spaces only'),
        email: Yup.string()
            .trim()
            .email('Please enter a valid email address')
            .required('Email address is required')
            .matches(/\S/, 'Email cannot be empty or spaces only'),
        phoneNumber: Yup.string()
            .trim()
            .required('Please enter a phone number')
            .matches(/\S/, 'Phone number cannot be empty or spaces only'),
        country: Yup.string()
            .trim()
            .required('Please select a country')
            .matches(/\S/, 'Country cannot be empty or spaces only'),
        region: Yup.string()
            .trim()
            .required('Please select a region')
            .matches(/\S/, 'Region cannot be empty or spaces only'),
        coachingTrajectory: Yup.string()
            .trim()
            .oneOf(['HIGH_TICKET', 'LOW_TICKET'])
            .required('Please select a coaching trajectory')
            .matches(/\S/, 'Coaching trajectory cannot be empty or spaces only'),
        coursesRoadmap: Yup.array()
    });

    useEffect(() => {
        if (studentId) {
            getSingleStudentById(studentId);
            // Get students Products
            getStudentProducts(studentId);
        }
    }, [studentId]);

    const getSingleStudentById = async (id) => {
        const response = await axiosWrapper('GET', API_URL.GET_STUDENT.replace(':id', id), {}, token);
        const student = response.data;

        const coursesRoadmap = student.coursesRoadmap.map((course) => ({
            value: course._id,
            label: course.title,
            id: course._id
        }));

        setStudentData({
            name: student.name,
            email: student.email,
            phoneNumber: student.phoneNumber,
            country: student.country,
            region: student.region,
            coachingTrajectory: student.coachingTrajectory,
            coursesRoadmap: student.coursesRoadmap.map((c) => c._id)
        });
        setCourses(coursesRoadmap);
        setStudentPhoto(student.avatar);
    };

    const getStudentProducts = async (id) => {
        // Fetch student products
        const url = `${API_URL.GET_ALL_PRODUCTS}?createdBy=${id}`;
        const response = await axiosWrapper('get', url, {}, token);
        const { data } = response;
        setStudentProducts(data);
    };

    useEffect(() => {
        if (studentData.coachingTrajectory) {
            getAllCourses(studentData.coachingTrajectory);
        }
    }, [studentData.coachingTrajectory]);

    const getAllCourses = async (trajectory) => {
        const response = await axiosWrapper(
            'GET',
            `${API_URL.GET_ALL_COURSES}?coachType=${trajectory}${studentId ? `&studentId=${studentId}` : ''}`,
            {},
            token
        );
        const { data } = response;
        const formattedData = data.map((c) => ({
            value: c._id,
            label: c.title,
            id: c._id
        }));

        setCourses(formattedData);
    };

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

    const handleCropComplete = async (croppedImage) => {
        const file = await getFileObjectFromBlobUrl(croppedImage, 'avatar.jpg');
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        setStudentPhoto(mediaFile.data[0].path);
        setCropping(false);
    };

    const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
        if (studentId) delete values.email;
        const formData = { ...values, avatar: studentPhoto };
        const url = studentId ? `${API_URL.UPDATE_STUDENT.replace(':id', studentId)}` : API_URL.CREATE_STUDENT;
        const method = studentId ? 'PUT' : 'POST';

        try {
            await axiosWrapper(method, url, formData, token);
            resetForm();
            navigate(`/${role}/students`);
        } catch (error) {
            setSubmitting(false);
        }
    };

    const resetModal = () => {
        setShowModal({
            show: false,
            title: '',
            isEditable: false,
            studentId: null
        });
    };

    const handleCloseModal = () => {
        resetModal();
    };

    const handleUpdateTrajectory = async () => {
        try {
            setLoadingCRUD(true);
            // Delete API call here
            await axiosWrapper(
                'PUT',
                API_URL.UPDATE_STUDENT.replace(':id', showModal?.studentId),
                {
                    coachingTrajectory: showModal?.trajectory
                },
                token
            );
            setLoadingCRUD(false);
            getSingleStudentById(showModal?.studentId);
            resetModal();
        } catch (error) {
            setLoadingCRUD(false);
            resetModal();
        }
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
                        {({ isSubmitting, handleSubmit, values, setFieldValue }) => (
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
                                                                    Upload Student Picture here
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
                                        <label className="field-label">Student Name</label>
                                        <Field
                                            name="name"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g David Henderson"
                                        />
                                        <ErrorMessage name="name" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Email</label>
                                        <Field
                                            name="email"
                                            className="field-control"
                                            type="email"
                                            placeholder="kevin12345@gmail.com"
                                        />
                                        <ErrorMessage name="email" component="div" className="error" />
                                    </Col>
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
                                                    if (studentId && values.coursesRoadmap.length > 0) {
                                                        // show a toast message that on changing course trajectory, the courses will be updated or removed all the courses
                                                        setShowModal({
                                                            show: true,
                                                            title: 'Update Trajectory',
                                                            isEditable: true,
                                                            studentId,
                                                            trajectory: selectedField.value
                                                        });
                                                        return;
                                                    }
                                                    getAllCourses(selectedField.value);
                                                    form.setFieldValue(field.name, selectedField.value);
                                                };

                                                return (
                                                    <>
                                                        <DropdownButton
                                                            title={
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span>
                                                                        {coachingTrajectory.find(
                                                                            (c) => c.value === field.value
                                                                        )?.label || 'Select ...'}
                                                                    </span>
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

                                    {studentId && (
                                        <Col md={6} xs={12}>
                                            <Input
                                                options={courses}
                                                name="coursesRoadmap"
                                                placeholder="Select..."
                                                label="Courses Roadmap"
                                                type="select"
                                                isMulti={true}
                                            />
                                            {courses.length === 0 && (
                                                <div>
                                                    <div className="error mt-2">
                                                        No coach assigned to this student or coach is not created any
                                                        courses yet.
                                                    </div>
                                                </div>
                                            )}
                                        </Col>
                                    )}
                                </Row>

                                <Row>
                                    <Col>
                                        {values.coursesRoadmap?.length > 0 && (
                                            <>
                                                <div className="field-label my-2">Courses Roadmap List </div>
                                                <div className="course-roadmap-wrapper">
                                                    <RoadMapList
                                                        coursesList={courses.filter((c) =>
                                                            values.coursesRoadmap.find((val) => c.id === val)
                                                        )}
                                                        setCoursesMap={(roadmap) => {
                                                            setFieldValue('coursesRoadmap', roadmap);
                                                        }}
                                                    />
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
                                                            state: { studentId, studentName: values.name }
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
                    {showModal.show && (
                        <ConfirmationBox
                            show={showModal.show}
                            onClose={handleCloseModal}
                            loading={loadingCRUD}
                            title={showModal.title}
                            body="The student will be unassigned from all courses and coach. Are you sure you want to change the trajectory?"
                            onConfirm={handleUpdateTrajectory}
                            customFooterClass="custom-footer-class"
                            nonActiveBtn="cancel-button"
                            activeBtn="delete-button"
                            activeBtnTitle="Update"
                        />
                    )}
                </Container>
            </div>
        </div>
    );
};

export default NewStudent;
