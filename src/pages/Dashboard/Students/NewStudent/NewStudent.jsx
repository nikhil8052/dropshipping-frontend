import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import * as Yup from 'yup';
import {
    Container,
    Row,
    Col,
    Button,
    DropdownButton,
    Dropdown,


    //  Badge
} from 'react-bootstrap';
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
import PhoneInputField from '../../../../components/Input/PhoneInput';

// import PaymentStatusOneTime from './Payments/PaymentStatusOneTime';
// import PaymentStatusInstallments from './Payments/PaymentStatusInstallments';
// import Card from '@components/Card/Card';
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal as BootstrapModal } from 'react-bootstrap';

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
    const [roadmapAccess, setRoadmapAccess] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [courses, setCourses] = useState([]);
    const [studentProducts, setStudentProducts] = useState([]);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [categories, setCategories] = useState([]);
    const [passwordError, setPasswordError] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passSubmitting, setPassSubmitting] = useState(false);


    const [passwordModal, setPasswordModal] = useState(false)
    // const [isRefetch, setIsRefetch] = useState(false);
    const isRefetch = false;
    // Form state
    const modalRef = useRef();
    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => setPasswordModal(false);

    const [studentData, setStudentData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        country: 'Netherlands',
        region: '',
        coachingTrajectory: 'LOW_TICKET',
        coursesRoadmap: [],
        category: [],
        roadMap: 'ROAD_MAP_ONE',
        roadmapAccess: 'false',
        password: ''
        // paymentType: '',
        // installmentFrequency: '',
        // installmentCount: 0,
        // paymentHistory: []
    });

    const [showModal, setShowModal] = useState({
        show: false,
        title: 'Update Trajectory',
        isEditable: false,
        studentId: null
    });
    // Session details
    // const [sessionInfo, setSessionInfo] = useState({
    //     paymentStatus: 'unpaid',
    //     remainingSessions: 0,
    //     nextSessionAvailableDate: null
    // });

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
            .matches(/\S/, 'Phone number cannot be empty or spaces only')
            .test('is-valid-phone', 'Phone number must be in the correct format country', (value) => {
                if (!value) return false; // If value is undefined/null, it fails the test
                // Check for the valid patterns
                const belgiumPattern = '32';
                const netherlandsPattern = '31';
                return value.startsWith(belgiumPattern) || value.startsWith(netherlandsPattern);
            }),
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
        roadMap: Yup.string().trim().oneOf(['ROAD_MAP_ONE', 'ROAD_MAP_TWO']).required('Please select a road map'),
        coursesRoadmap: Yup.array(),
        category: Yup.array()
            .min(1, 'Please select at least one category') // Ensures at least one category is selected
            .required('Please select a category')
        // paymentType: Yup.string().required('Please select a payment type'),
        // installmentFrequency: Yup.string().when('paymentType', {
        //     is: 'installments',
        //     then: () => Yup.string().required('Please select installment frequency'),
        //     otherwise: () => Yup.string().nullable()
        // })
    });

    useEffect(() => {
        if (studentId) {
            getSingleStudentById(studentId);
            // Get students Products
            getStudentProducts(studentId);
            // Commenting out for future reference
            // getSessionInfo(studentId);
        }
    }, [studentId, isRefetch]);

    const getSingleStudentById = async (id) => {
        const response = await axiosWrapper('GET', API_URL.GET_STUDENT.replace(':id', id), {}, token);
        const student = response.data;

        // return 
        const coursesRoadmap = student.coursesRoadmap.map((course) => ({
            value: course?._id,
            label: course?.title,
            id: course?._id
        }));

        const mappedCategories = student.category.map((category) => {
            return {
                value: category._id,
                label: category.name
            };
        });

        setCategories(mappedCategories);
        setStudentData({
            name: student?.name || '',
            email: student?.email || '',
            phoneNumber: student?.phoneNumber || '',
            country: student?.country || '',
            region: student?.region || '',
            category: mappedCategories || [],
            coachingTrajectory: student?.coachingTrajectory || '',
            roadMap: student?.roadMap || 'ROAD_MAP_ONE',
            coursesRoadmap: student?.coursesRoadmap.map((c) => c?._id),
            roadmapAccess: String(student?.roadmapAccess || 'false'),
            password: ''
            // paymentType: student?.paymentType || 'one-time', // Default to 'one-time' if not present
            // installmentFrequency: student?.installmentFrequency || '',
            // installmentCount: student?.installmentCount || 0,
            // paymentHistory: student?.paymentHistory
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

    // const getSessionInfo = async (id) => {
    //     const response = await axiosWrapper('GET', API_URL.GET_STUDENT_SESSION_INFO.replace(':id', id), {}, token);
    //     const { paymentStatus, remainingSessions, nextSessionAvailableDate } = response.data;
    //     setSessionInfo({
    //         paymentStatus,
    //         remainingSessions,
    //         nextSessionAvailableDate: nextSessionAvailableDate ? new Date(nextSessionAvailableDate) : null
    //     });
    // };

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
        try {
            const file = await getFileObjectFromBlobUrl(croppedImage, 'avatar.jpg');
            const formData = new FormData();
            formData.append('files', file);
            formData.append('name', file.name);
            setCropping(false);
            const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
            setStudentPhoto(mediaFile.data[0].path);
        } catch (error) {
            setCropping(false);
        }
    };

    const resetCropper = () => {
        setCropping(false);
        setStudentPhoto(null);
        setImageSrc(null);
        inputRef.current.value = null;
    };

    const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
        let formData = {
            ...values,
            avatar: studentPhoto,
            category: values.category.map((cat) => cat.value)
        };

        if (formData.password.length > 0) {
            if (formData.confirm_password != formData.password) {
                setPasswordError(" Password Does not match!")
                setTimeout(() => {
                    setPasswordError("");
                }, 5000);
                console.error(" Error not matchedc the password ")
                return;
            }
        }

        delete formData.confirm_password;
        // console.log(formData, "DD ");
        // return 
        // If updating an existing student, exclude the email field
        // if (studentId) {
        //     const { email, ...rest } = formData;
        //     formData = rest;
        // }

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

    const getAllCategories = async () => {
        const response = await axiosWrapper('GET', `${API_URL.GET_ALL_CATEGORIES}`, {}, token);
        const mappedCategories = response?.data?.map((category) => ({
            label: category.name,
            value: category._id
        }));
        setCategories(mappedCategories);
    };
    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        // When initialData.category changes, update the categories state to include them
        if (studentData?.category) {
            setCategories((prevCategories) => {
                const combined = [...prevCategories, ...studentData.category];
                const uniqueCategories = combined.reduce((acc, current) => {
                    if (!acc.some((item) => item.value === current.value)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                return uniqueCategories;
            });
        }
    }, [studentData?.category]);

    const loadCategories = async (inputValue) => {
        try {
            const response = await axiosWrapper('GET', `${API_URL.GET_ALL_CATEGORIES}`, {}, token);
            const allCategories = response?.data || [];

            // Filter categories based on input value
            const filteredCategories = allCategories.filter((category) =>
                category.name.toLowerCase().includes(inputValue.toLowerCase())
            );

            // Format the categories for react-select
            const mappedCategories = filteredCategories.map((category) => ({
                label: category.name,
                value: category._id // Assuming _id is the unique identifier for categories
            }));

            setCategories((prevCategories) => {
                const combined = [...prevCategories, ...mappedCategories];
                const uniqueCategories = combined.reduce((acc, current) => {
                    if (!acc.some((item) => item.value === current.value)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                return uniqueCategories;
            });

            return mappedCategories;
        } catch (error) {
            return [];
        }
    };

    const createCategory = async (newCategoryName) => {
        try {
            const response = await axiosWrapper(
                'POST',
                API_URL.CREATE_CATEGORY,
                { name: newCategoryName, createdBy: userInfo?._id },
                token
            );
            const createdCategory = response?.data; // Assuming API returns the created category

            const newCategoryOption = {
                label: createdCategory.name,
                value: createdCategory._id
            };

            // Update the category list with the new category without duplicates
            setCategories((prevCategories) => {
                return [...prevCategories, newCategoryOption];
            });

            return newCategoryOption;
        } catch {
            return null;
        }
    };

    const handleCreateCategory = async (inputValue, setFieldValue, currentValues) => {
        const newCategory = await createCategory(inputValue);
        if (newCategory) {
            const updatedSelectedValues = [...(currentValues || []), newCategory];
            setFieldValue('category', updatedSelectedValues);
        }
        return newCategory;
    };

    // Define your academy dropdown options using your Vite environment variables
    const academyOptions = [
        { label: 'Dropship Academy Low offer', value: 'ROAD_MAP_ONE' },
        { label: 'Dropship Academy Roadmap', value: 'ROAD_MAP_TWO' }
    ];

    const roadmapAccessOptions = [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
    ];


    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [copiedPassword, setCopiedPassword] = useState(false);
    const [copiedConfirmPassword, setCopiedConfirmPassword] = useState(false);

    const copyToClipboard = (fieldName) => {
        const input = document.querySelector(`input[name="${fieldName}"]`);
        if (input && input.value) {
            navigator.clipboard.writeText(input.value);
            if (fieldName === "password") {
                setCopiedPassword(true);
                setTimeout(() => setCopiedPassword(false), 1500);
            } else if (fieldName === "confirm_password") {
                setCopiedConfirmPassword(true);
                setTimeout(() => setCopiedConfirmPassword(false), 1500);
            }
        }
    };

    const handlePasswordSubmit = async () => {

        setPassSubmitting(true)
        if( password.length<=0 || confirmPassword.length<=0 ){
            setPasswordError(" Password cannot be empty!")
            setTimeout(() => {
                setPasswordError("");
            }, 5000);
            setPassSubmitting(false)
            return;
        }

        if (password.length > 0) {
            if (confirmPassword != password) {
                setPasswordError(" Password Does not match!")
                setTimeout(() => {
                    setPasswordError("");
                }, 5000);
                console.error(" Error not matchedc the password ")
                setPassSubmitting(false)

                return;
            }
        }

        const url = studentId ? `${API_URL.UPDATE_STUDENT.replace(':id', studentId)}` : API_URL.CREATE_STUDENT;
        const method = studentId ? 'PUT' : 'POST';
        const formData = {
            password: password,
            email: studentData.email,
            name: studentData.name,
        }
        try {
            await axiosWrapper(method, url, formData, token);

            setPassSubmitting(false)

            closeModal();
        } catch (error) {
            setPassSubmitting(false)

        } finally {
            setPassSubmitting(false)

        }

    };

    return (
        <div className="new-student-page-wrapper new_css_student">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/students`)} style={{ cursor: 'pointer' }}>
                    Students <img src={CaretRight} alt=">" />
                </span>
                {studentId ? 'Student Profile' : 'Add New Student'}
            </div>
            <div className="new-student-page new-page">
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
                                            <label className="field-label">UPLOAD PHOTO</label>
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
                                                                    Upload student picture here
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
                                <div className="box-row">
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
                                            <PhoneInputField
                                                name="phoneNumber"
                                                label="Phone Number"
                                                countriesAllowed={values.country === 'Netherlands' ? ['nl'] : ['be']}
                                            />
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
                                                        // clear the selected region
                                                        form.setFieldValue('region', '');
                                                    };

                                                    return (
                                                        <>
                                                            <DropdownButton
                                                                title={
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span>
                                                                            {field.value || 'Select a country ...'}
                                                                        </span>
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
                                                                        <span className="country-name">
                                                                            {country.name}
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                            {form.touched[field.name] && form.errors[field.name] && (
                                                                <div className="error mt-2">
                                                                    {form.errors[field.name]}
                                                                </div>
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
                                                    // Try to find the region object based on the selected country.
                                                    const currentRegion = regions.find(
                                                        (r) => r?.name === values?.country
                                                    );
                                                    // If no matching country is found, fallback to an empty array.
                                                    const regionList = currentRegion ? currentRegion.regions : [];

                                                    const handleSelect = (eventKey) => {
                                                        // Find the selected region in our regionList.
                                                        const selectedRegion = regionList.find(
                                                            (country) => country?.id.toString() === eventKey
                                                        );
                                                        // Set the field value; if not found, set it to an empty string.
                                                        form.setFieldValue(
                                                            field.name,
                                                            selectedRegion ? selectedRegion.label : ''
                                                        );
                                                    };

                                                    return (
                                                        <>
                                                            <DropdownButton
                                                                title={
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span>
                                                                            {field.value ||
                                                                                (regionList.length > 0
                                                                                    ? 'Select a region ...'
                                                                                    : 'No region available')}
                                                                        </span>
                                                                        <img src={dropDownArrow} alt="arrow" />
                                                                    </div>
                                                                }
                                                                id={field.name}
                                                                onSelect={handleSelect}
                                                                className="dropdown-button  menu-overflow w-100"
                                                                disabled={regionList.length === 0} // disable dropdown if no regions found
                                                            >
                                                                {regionList.map((country) => (
                                                                    <Dropdown.Item
                                                                        key={country?.id}
                                                                        eventKey={country?.id}
                                                                        className="my-1 ms-2 w-100"
                                                                    >
                                                                        <span className="country-name">
                                                                            {country?.label}
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                            {form.touched[field.name] && form.errors[field.name] && (
                                                                <div className="error mt-2">
                                                                    {form.errors[field.name]}
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                }}
                                            />
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
                                                                        <span className="coach-name">
                                                                            {coach.label}
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                            {form.touched[field.name] && form.errors[field.name] && (
                                                                <div className="error mt-2">
                                                                    {form.errors[field.name]}
                                                                </div>
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

                                        {/* {studentId && (
                                            <Col md={6} xs={12}>
                                                <Input
                                                    options={courses}
                                                    name="coursesRoadmap"
                                                    placeholder="Select..."
                                                    label="Courses Roadmap"
                                                    type="select"
                                                    isMulti={true}
                                                    className="up-menu"
                                                />
                                                {courses.length === 0 && (
                                                    <div>
                                                        <div className="error mt-2">
                                                            No coach assigned to this student or coach is not created
                                                            any courses yet.
                                                        </div>
                                                    </div>
                                                )}
                                            </Col>
                                        )} */}

                                        <Col>
                                            <Input
                                                name="category"
                                                label="Course Category"
                                                component={Input}
                                                type="asyncSelect"
                                                loadOptions={loadCategories}
                                                placeholder="Select a category ..."
                                                options={categories}
                                                isMulti
                                                onCreateOption={(inputValue) =>
                                                    handleCreateCategory(inputValue, setFieldValue, values.category)
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    {/* Commenting out for future reference */}
                                    <Row>
                                        {/* <h4 className="my-3 new-student-title">Payment Information</h4> */}
                                        {/* <Col md={12} xs={12}>
                                        <label className="field-label">Payment Type</label>
                                        <Field
                                            name="paymentType"
                                            component={({ field, form }) => {
                                                const handleSelect = (eventKey) => {
                                                    form.setFieldValue(field.name, eventKey);
                                                    // Reset installment frequency when payment type changes
                                                    if (eventKey !== 'installments') {
                                                        form.setFieldValue('installmentFrequency', '');
                                                    }
                                                };

                                                return (
                                                    <DropdownButton
                                                        title={
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span>
                                                                    {field.value
                                                                        ? field.value === 'one-time'
                                                                            ? 'One-Time'
                                                                            : 'Installments'
                                                                        : 'Select Payment Type'}
                                                                </span>
                                                                <img src={dropDownArrow} alt="arrow" />
                                                            </div>
                                                        }
                                                        id={field.name}
                                                        onSelect={handleSelect}
                                                        className="dropdown-button w-100"
                                                        disabled={studentId}
                                                    >
                                                        <Dropdown.Item eventKey="one-time">One-Time</Dropdown.Item>
                                                        <Dropdown.Item eventKey="installments">
                                                            Installments
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                );
                                            }}
                                        />
                                        <ErrorMessage name="paymentType" component="div" className="error mt-2" />
                                    </Col> */}

                                        {/* Installment Frequency Dropdown (conditional) */}
                                        {/* {values.paymentType === 'installments' && (
                                        <>
                                            <Col md={6} xs={12}>
                                                <label className="field-label">Installment Frequency</label>
                                                <Field
                                                    name="installmentFrequency"
                                                    component={({ field, form }) => {
                                                        const handleSelect = (eventKey) => {
                                                            form.setFieldValue(field.name, eventKey);
                                                        };

                                                        return (
                                                            <DropdownButton
                                                                title={
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span>
                                                                            {field.value
                                                                                ? field.value === 'weekly'
                                                                                    ? 'Weekly'
                                                                                    : 'Monthly'
                                                                                : 'Select Frequency'}
                                                                        </span>
                                                                        <img src={dropDownArrow} alt="arrow" />
                                                                    </div>
                                                                }
                                                                id={field.name}
                                                                onSelect={handleSelect}
                                                                className="dropdown-button w-100"
                                                                disabled={studentId}
                                                            >
                                                                <Dropdown.Item eventKey="weekly">Weekly</Dropdown.Item>
                                                                <Dropdown.Item eventKey="monthly">
                                                                    Monthly
                                                                </Dropdown.Item>
                                                            </DropdownButton>
                                                        );
                                                    }}
                                                />
                                                <ErrorMessage
                                                    name="installmentFrequency"
                                                    component="div"
                                                    className="error mt-2"
                                                />
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <label className="field-label">Number of Installments</label>
                                                <Field
                                                    name="installmentCount"
                                                    type="number"
                                                    className="field-control"
                                                    placeholder="Enter number of installments"
                                                    disabled={studentId}
                                                />
                                                <ErrorMessage
                                                    name="installmentCount"
                                                    component="div"
                                                    className="error mt-2"
                                                />
                                            </Col>
                                        </>
                                    )} */}
                                        {/*                                    
                                    {studentId && (
                                        <Col md={12} xs={12}>
                                            {values.paymentType === 'one-time' && (
                                                <PaymentStatusOneTime
                                                    studentName={studentData.name}
                                                    paymentDate={studentData.paymentHistory?.[0]?.paymentDate}
                                                    status={
                                                        studentData.paymentHistory?.[0]?.status === 'paid'
                                                            ? 'Paid'
                                                            : 'Unpaid'
                                                    }
                                                />
                                            )}
                                            {values.paymentType === 'installments' && (
                                                <PaymentStatusInstallments
                                                    studentName={studentData.name}
                                                    paymentHistory={studentData.paymentHistory || []}
                                                    id={studentId}
                                                    setIsRefetch={setIsRefetch}
                                                />
                                            )}
                                        </Col>
                                    )} */}
                                    </Row>
                                    <Row>
                                        {/* <Col md={6} xs={6}>
                                            <label className="field-label">Road Map</label>
                                            <Field
                                                name="roadMap"
                                                className="field-select-control"
                                                type="text"
                                                component={({ field, form }) => {
                                                    const handleSelect = (eventKey) => {
                                                        const selected = academyOptions.find(
                                                            (option) => option.value === eventKey
                                                        );
                                                        form.setFieldValue(field.name, selected.value);
                                                    };

                                                    return (
                                                        <>
                                                            <DropdownButton
                                                                title={
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span>
                                                                            {academyOptions.find(
                                                                                (option) => option.value === field.value
                                                                            )?.label || 'Select a road map...'}
                                                                        </span>
                                                                    </div>
                                                                }
                                                                id={field.name}
                                                                onSelect={handleSelect}
                                                                className="dropdown-button w-100"
                                                            >
                                                                {academyOptions.map((option) => (
                                                                    <Dropdown.Item
                                                                        key={option.value}
                                                                        eventKey={option.value}
                                                                        className="my-1 ms-2 w-100"
                                                                    >
                                                                        {option.label}
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                            {form.touched[field.name] && form.errors[field.name] && (
                                                                <div className="error mt-2">
                                                                    {form.errors[field.name]}
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                }}
                                            />
                                        </Col> */}
                                        {/* Road Map access  */}
                                        <Col md={12} xs={12} >
                                            <label className="field-label">Roadmap Access</label>
                                            <Field
                                                name="roadmapAccess"
                                                className="field-select-control"
                                                type="text"
                                                component={({ field, form }) => {
                                                    const handleSelect = (eventKey) => {
                                                        const selected = roadmapAccessOptions.find(
                                                            (option) => option.value === eventKey
                                                        );
                                                        form.setFieldValue(field.name, selected.value);
                                                    };

                                                    return (
                                                        <>
                                                            <DropdownButton
                                                                title={
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span>
                                                                            {roadmapAccessOptions.find(
                                                                                (option) => option.value === field.value
                                                                            )?.label || 'Select roadmap access...'}
                                                                        </span>
                                                                    </div>
                                                                }
                                                                id={field.name}
                                                                onSelect={handleSelect}
                                                                className="dropdown-button w-100"
                                                            >
                                                                {roadmapAccessOptions.map((option) => (
                                                                    <Dropdown.Item
                                                                        key={option.value}
                                                                        eventKey={option.value}
                                                                        className="my-1 ms-2 w-100"
                                                                    >
                                                                        {option.label}
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                            {form.touched[field.name] && form.errors[field.name] && (
                                                                <div className="error mt-2">
                                                                    {form.errors[field.name]}
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                </div>

                                {/* <Row>
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
                                </Row> */}
                                {/* Session Information */}
                                {/* Commenting out for future reference */}
                                {/*
                                studentId && studentData.paymentType === 'installments' && (
                                    <>
                                        <Row>
                                            <h4 className="my-3 new-student-title">Coaching Session Information</h4>
                                            <Col md={12} xs={12}>
                                                <Card className="p-3 events-card">
                                                    <p>
                                                        <strong>Payment Status:</strong>{' '}
                                                        {sessionInfo.paymentStatus === 'paid' ? (
                                                            <Badge bg="success">Paid</Badge>
                                                        ) : (
                                                            <Badge bg="danger">Unpaid</Badge>
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>Remaining Sessions:</strong>{' '}
                                                        {sessionInfo.remainingSessions}/
                                                        {studentData.installmentFrequency === 'weekly' ? '1' : '4'}{' '}
                                                        sessions available
                                                    </p>
                                                    {sessionInfo.nextSessionAvailableDate &&
                                                        !isNaN(sessionInfo.nextSessionAvailableDate.getTime()) && (
                                                            <p>
                                                                <strong>Next Session Available On:</strong>{' '}
                                                                {sessionInfo.nextSessionAvailableDate.toLocaleDateString()}
                                                            </p>
                                                        )}
                                                </Card>
                                            </Col>
                                        </Row>
                                    </>
                                ) */}

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
                                            {
                                                studentId && (

                                                    <Button
                                                        type="button"

                                                        onClick={() => setPasswordModal(true)}
                                                        className="submit-btn"

                                                    >
                                                        Change password
                                                    </Button>

                                                )
                                            }


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
                        <ImageCropper imageSrc={imageSrc} onCropComplete={handleCropComplete} onCancel={resetCropper} />
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

                    <BootstrapModal show={passwordModal} size="medium" centered>
                        <BootstrapModal.Header >
                            <BootstrapModal.Title className="modal-title">Change Password</BootstrapModal.Title>
                        </BootstrapModal.Header>
                        <BootstrapModal.Body className="modal-content chnage_pass">
                            <Row>
                                {/* Password Field */}
                                <Col md={12} xs={12}>
                                    <label className="field-label">Password</label>
                                    <div className="position-relative">
                                        <input
                                            name="password"
                                            className="field-control pe-5"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {/* Eye icon */}
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEyeSlash : faEye}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="position-absolute top-50 end-0 translate-middle-y me-5"
                                            color="#6c757d"
                                            style={{ cursor: "pointer" }}
                                        />
                                        {/* Copy icon */}
                                        <FontAwesomeIcon
                                            icon={faCopy}
                                            onClick={() => copyToClipboard(password)}
                                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                                            color={copiedPassword ? "green" : "#6c757d"}
                                            style={{ cursor: "pointer" }}
                                            title={copiedPassword ? "Copied!" : "Copy password"}
                                        />
                                    </div>
                                </Col>

                                {/* Confirm Password Field */}
                                <Col md={12} xs={12}>
                                    <label className="field-label">Confirm Password</label>
                                    <div className="position-relative">
                                        <input
                                            name="confirm_password"
                                            className="field-control pe-5"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Enter confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {/* Eye icon */}
                                        <FontAwesomeIcon
                                            icon={showConfirmPassword ? faEyeSlash : faEye}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="position-absolute top-50 end-0 translate-middle-y me-5"
                                            color="#6c757d"
                                            style={{ cursor: "pointer" }}
                                        />
                                        {/* Copy icon */}
                                        <FontAwesomeIcon
                                            icon={faCopy}
                                            onClick={() => copyToClipboard(confirmPassword)}
                                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                                            color={copiedConfirmPassword ? "green" : "#6c757d"}
                                            style={{ cursor: "pointer" }}
                                            title={copiedConfirmPassword ? "Copied!" : "Copy confirm password"}
                                        />
                                    </div>
                                    <div className="error mt-2">{passwordError}</div>
                                </Col>
                            </Row>

                        </BootstrapModal.Body>
                        <BootstrapModal.Footer>
                            <Button className='cancel-btn cancel-btn-pass' onClick={closeModal}>
                                Close
                            </Button>
                            <Button className='submit-btn' onClick={handlePasswordSubmit}>
                                {passSubmitting ? "Updating..." : "Submit"}
                            </Button>
                        </BootstrapModal.Footer>

                    </BootstrapModal>

                </Container>
            </div>
        </div>
    );
};

export default NewStudent;
