import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import dropDownArrow from '@icons/drop-down-black.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import '../../Courses-supabase/CourseNew.scss';
import StudentCourseCategory from './StudentCourseCategory';
import imagePreview2 from '../../../../assets/icons/Thumbnail.svg';

import {
    Row,
    Col,
    Button
    // DropdownButton,
    // Dropdown
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

const NewStudent = () => {
    const inputRef = useRef();
    const [studentPhoto, setStudentPhoto] = useState('');
    const location = useLocation();
    const studentId = location.state?.studentId;
    // const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const { userInfo, userToken } = useSelector((state) => state?.auth);

    const role = userInfo?.role?.toLowerCase();
    const navigate = useNavigate();
    const [cropping, setCropping] = useState(false);
    const [roadmapAccess, setRoadmapAccess] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [courses, setCourses] = useState([]);
    const [studentProducts, setStudentProducts] = useState([]);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const isRefetch = false;

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
        roadmapAccess: 'false'
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
            .matches(/\S/, 'Phone number cannot be empty or spaces only')
            .test('is-valid-phone', 'Please add country code', (value) => {
                if (!value) return false;
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
        category: Yup.array().min(1, 'Please select at least one category').required('Please select a category')
    });

    useEffect(() => {
        if (studentId) {
            getSingleStudentById(studentId);
            getStudentProducts(studentId);
        }
    }, [studentId, isRefetch]);

    const getSingleStudentById = async (id) => {
        const response = await axiosWrapper('GET', API_URL.SUPABASE_GET_STUDENT.replace(':id', id), {}, token);
        const student = response.data;

        const coursesRoadmap = student?.coursesRoadmaps?.map((course) => ({
            value: course?.id,
            label: course?.title,
            id: course?.id
        }));

        const mappedCategories = student?.categories?.map((category) => {
            return {
                value: category.id,
                label: category.name
            };
        });

        setSelectedCategories(mappedCategories);
        setStudentData({
            name: student?.name || '',
            email: student?.email || '',
            phoneNumber: student?.phoneNumber || '',
            country: student?.country || '',
            region: student?.region || '',
            category: mappedCategories || [],
            coachingTrajectory: student?.coachingTrajectory || '',
            roadMap: student?.roadMap || 'ROAD_MAP_ONE',
            coursesRoadmap: student?.coursesRoadmaps?.map((c) => c?.id),
            roadmapAccess: String(student?.roadmapAccess || 'false')
        });
        setCourses(coursesRoadmap);
        setStudentPhoto(student.avatar);
    };

    const getStudentProducts = async (id) => {
        // Fetch student products implementation
    };

    useEffect(() => {
        if (studentData.coachingTrajectory) {
            getAllCourses(studentData.coachingTrajectory);
        }
    }, [studentData.coachingTrajectory]);

    const getAllCourses = async (trajectory) => {
        const response = await axiosWrapper(
            'GET',
            `${API_URL.SUPABASE_GET_ALL_COURSES}?coachType=${trajectory}${studentId ? `&studentId=${studentId}` : ''}`,
            {},
            token
        );
        const { data } = response;
        const formattedData = data.map((c) => ({
            value: c.id,
            label: c.title,
            id: c.id
        }));

        setCourses(formattedData);
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
        let formData = { ...values, avatar: studentPhoto, category: values.category.map((cat) => cat.value) };
        console.log(formData);
        if (studentId) {
            const { email, ...rest } = formData;
            formData = rest;
        }

        const url = studentId
            ? `${API_URL.SUPABASE_UPDATE_STUDENT.replace(':id', studentId)}`
            : API_URL.SUPABASE_CREATE_STUDENT;
        const method = studentId ? 'PUT' : 'POST';

        try {
            await axiosWrapper(method, url, formData, token);
            resetForm();
            navigate(`/${role}/students-supabase`);
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
            await axiosWrapper(
                'PUT',
                API_URL.SUPABASE_UPDATE_STUDENT.replace(':id', showModal?.studentId),
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
        const response = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_ALL_CATEGORIES}`, {}, token);
        const mappedCategories = response?.data?.map((category) => ({
            label: category.name,
            value: category.id
        }));
        setCategories(mappedCategories);
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
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
            const response = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_ALL_CATEGORIES}`, {}, token);
            const allCategories = response?.data || [];

            const filteredCategories = allCategories.filter((category) =>
                category.name.toLowerCase().includes(inputValue.toLowerCase())
            );

            const mappedCategories = filteredCategories.map((category) => ({
                label: category.name,
                value: category.id
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
                { name: newCategoryName, createdBy: userInfo?.id },
                token
            );
            const createdCategory = response?.data;

            const newCategoryOption = {
                label: createdCategory.name,
                value: createdCategory.id
            };

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

    const academyOptions = [
        { label: 'Dropship Academy Low offer', value: 'ROAD_MAP_ONE' },
        { label: 'Dropship Academy Roadmap', value: 'ROAD_MAP_TWO' }
    ];

    const roadmapAccessOptions = [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
    ];

    return (
        <div className="new-student-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/students-supabase`)} style={{ cursor: 'pointer' }}>
                    Students <img src={CaretRight} alt=">" />
                </span>
                <p>{studentId ? 'Student Profile' : 'Add New Student'}</p>
            </div>
            <div className="new-student-page new-page">
                <div className="add-course-form Course-form">
                    <Formik
                        initialValues={studentData}
                        validationSchema={schema}
                        onSubmit={handleFormSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit, values, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <div className="box-row">
                                <Row className="mb-5">
                                    <Col>
                                        <div className="student-upload thumbnail-block">
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
                                                                            style={{
                                                                                borderRadius: '50%',
                                                                                width: '200px',
                                                                                height: '128px'
                                                                            }}
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
                                                                        src={imagePreview2}
                                                                        alt=""
                                                                    />
                                                                    <span>
                                                                        {/* Upload student picture here
                                                                        <br />
                                                                        Supported formats:{' '}
                                                                        <strong>.jpg, .jpeg, or .png</strong>
                                                                        <br /> */}
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
                                        </div>
                                    </Col>
                                </Row>
                                    <Row>
                                        <Col md={6} xs={12} className="form-group">
                                            <TextField
                                                name="name"
                                                label="Name"
                                                className="field-control"
                                                variant="outlined"
                                                id="name-basic"
                                                type="text"
                                                value={values.name}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 100) {
                                                        setFieldValue('name', e.target.value);
                                                    }
                                                }}
                                                helperText={`${values.name?.length || 0}/100`}
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth
                                            />
                                            <ErrorMessage name="name" component="div" className="error" />
                                        </Col>
                                        <Col md={6} xs={12} className="form-group">
                                            <TextField
                                                name="email"
                                                label="Email"
                                                className="field-control"
                                                variant="outlined"
                                                id="email-basic"
                                                type="email"
                                                value={values.email}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 100) {
                                                        setFieldValue('email', e.target.value);
                                                    }
                                                }}
                                                helperText={`${values.email?.length || 0}/100`}
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth
                                            />
                                            <ErrorMessage name="email" component="div" className="error" />
                                        </Col>
                                        <Col md={6} xs={12} className="form-group">
                                            <TextField
                                                name="phoneNumber"
                                                label="Phone Number"
                                                className="field-control"
                                                variant="outlined"
                                                id="phone-basic"
                                                type="number"
                                                value={values.phoneNumber}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 12) {
                                                        setFieldValue('phoneNumber', e.target.value);
                                                    }
                                                }}
                                                helperText={`${values.phoneNumber?.length || 0}/12`}
                                                inputProps={{ maxLength: 12 }}
                                                fullWidth
                                                countriesAllowed={values.country === 'Netherlands' ? ['nl'] : ['be']}
                                            />
                                            <ErrorMessage name="phoneNumber" component="div" className="error" />

                                            {/* <label htmlFor="phoneNumber">Phone Number</label>
                                            <Field name="phoneNumber">
                                            {({ field, form }) => (
                                                <PhoneInputField
                                                {...field}
                                                countriesAllowed={values.country === 'Netherlands' ? ['nl'] : ['be']}
                                                onChange={(value) => form.setFieldValue('phoneNumber', value)}
                                                />
                                            )}
                                            </Field> */}
                                        </Col>
                                        <Col md={6} xs={12} className="form-group">
                                            <FormControl fullWidth>
                                                <InputLabel id="country-label">Country</InputLabel>
                                                <Select
                                                    labelId="country-label"
                                                    id="country-select"
                                                    value={values.country}
                                                    label="Country"
                                                    onChange={(e) => {
                                                        setFieldValue('country', e.target.value);
                                                        setFieldValue('region', '');
                                                    }}
                                                >
                                                    {countryList.map((country) => (
                                                        <MenuItem key={country.id} value={country.name}>
                                                            {country.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <ErrorMessage name="country" component="div" className="error" />
                                            </FormControl>
                                        </Col>
                                        <Col md={6} xs={12} className="form-group">
                                            <FormControl fullWidth>
                                                <InputLabel id="region-label">Region/State</InputLabel>
                                                <Select
                                                    labelId="region-label"
                                                    id="region-select"
                                                    value={values.region}
                                                    label="Region/State"
                                                    onChange={(e) => setFieldValue('region', e.target.value)}
                                                    disabled={!values.country}
                                                >
                                                    {(() => {
                                                        const currentRegion = regions.find(
                                                            (r) => r?.name === values?.country
                                                        );
                                                        const regionList = currentRegion ? currentRegion.regions : [];

                                                        return regionList.length > 0 ? (
                                                            regionList.map((region) => (
                                                                <MenuItem key={region.id} value={region.label}>
                                                                    {region.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : (
                                                            <MenuItem disabled>No regions available</MenuItem>
                                                        );
                                                    })()}
                                                </Select>
                                                <ErrorMessage name="region" component="div" className="error" />
                                            </FormControl>
                                        </Col>
                                        <Col md={6} xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="coaching-label">Coaching Trajectory</InputLabel>
                                                <Select
                                                    labelId="coaching-label"
                                                    id="coaching-select"
                                                    value={values.coachingTrajectory}
                                                    label="Coaching Trajectory"
                                                    onChange={(e) => {
                                                        if (studentId && values.coursesRoadmap.length > 0) {
                                                            setShowModal({
                                                                show: true,
                                                                title: 'Update Trajectory',
                                                                isEditable: true,
                                                                studentId,
                                                                trajectory: e.target.value
                                                            });
                                                            return;
                                                        }
                                                        getAllCourses(e.target.value);
                                                        setFieldValue('coachingTrajectory', e.target.value);
                                                    }}
                                                >
                                                    {coachingTrajectory.map((coach) => (
                                                        <MenuItem key={coach.id} value={coach.value}>
                                                            {coach.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <ErrorMessage
                                                    name="coachingTrajectory"
                                                    component="div"
                                                    className="error"
                                                />
                                            </FormControl>
                                        </Col>
                                        <Col md={12} xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="roadmap-access-label">Roadmap Access</InputLabel>
                                                <Select
                                                    labelId="roadmap-access-label"
                                                    id="roadmap-access-select"
                                                    value={values.roadmapAccess}
                                                    label="Roadmap Access"
                                                    onChange={(e) => setFieldValue('roadmapAccess', e.target.value)}
                                                >
                                                    {roadmapAccessOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <ErrorMessage name="roadmapAccess" component="div" className="error" />
                                            </FormControl>
                                        </Col>
                                        {/* <Col>
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
                                        </Col> */}
                                        <Col md={12} xs={12}>
                                            <Field name="category">
                                                {({ field, form }) => (
                                                    <StudentCourseCategory
                                                        value={field.value}
                                                        onChange={(value) => form.setFieldValue(field.name, value)}
                                                        token={userToken}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="category" component="div" className="error" />
                                        </Col>
                                    </Row>
                                </div>

                                <Row>
                                    <Col>
                                        <div className="mt-5 d-flex justify-content-end align-items-center gap-3 tab-buttons ">
                                            {studentId && (
                                                <>
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

                                                    <CarouselWrapper items={studentProducts} type="product" />
                                                </>
                                            )}
                                            <Button
                                                type="button"
                                                onClick={() => navigate(`/${role}/students-supabase`)}
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
                </div>
            </div>
        </div>
    );
};

export default NewStudent;
