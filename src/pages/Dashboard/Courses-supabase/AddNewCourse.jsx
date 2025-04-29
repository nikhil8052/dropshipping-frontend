import { Form, Formik, Field, ErrorMessage } from 'formik';
import { useEffect, useState } from 'react';
import CourseAccessType from './CourseAccessType';
import CourseCategory from './CourseCategory';
import UploadThumbnail from './CourseThumbnail';
import AddLecture from './AddLecture';
import { Button, Col, Row } from 'react-bootstrap';

// import PublishCourses from './PublishCourses';
// import BasicInformation from './BasicInformation';
// import UploadFiles from './UploadFiles';
// import ClipboardText from '@icons/ClipboardText.svg';
// import Stack from '@icons/Stack.svg';
// import taskAlt from '@icons/task_alt.svg';
// import CaretRight from '@icons/CaretRight.svg';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import '../../../styles/Courses.scss';
import './CourseNew.scss';
import axiosWrapper from '../../../utils/api';
import * as types from '../../../redux/actions/actionTypes';
import { API_URL } from '../../../utils/apiUrl';
import { textParser } from '../../../utils/utils';
// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ConfirmationBox from '../../../components/ConfirmationBox/ConfirmationBox';
import Loading from '@components/Loading/Loading';
import BasicInformation from './FirstFormStep';

const AddNewCourse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
    const editMode = location.state?.isEdit || false;
    const courseId = location.state?.courseId;
    const [activeKey, setActiveKey] = useState('basic-information');
    const currentCourse = useSelector((state) => state?.root?.currentCourse);
    const currentCourseUpdate = useSelector((state) => state?.root?.currentCourseUpdate);
    const lectureUpdate = useSelector((state) => state?.root?.lectureUpdate);
    const [loading, setLoading] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');

    const [courseData, setCourseData] = useState({
        title: '',
        subtitle: '',
        category: [],
        createdBy: null,
        thumbnail: '',
        banner: '',
        trailer: '',
        description: '',
        lectures: []
    });
    const [stepsCompleted, setStepsCompleted] = useState({
        step1: false,
        step2: false,
        step3: false
    });

    // //////////////////////////////Handlers////////////////////////

    const handleDelete = async (courseId) => {
        setLoading(true);
        try {
            await axiosWrapper('DELETE', `${API_URL.DELETE_COURSE.replace(':id', courseId)}`, {}, token);
            setLoading(false);
            // getAllCourses();
        } catch (error) {
            setLoading(false);
        }
    };
    const handleTabChange = (key) => {
        // console.log( key , " THI IS THEKLEY")
        if (courseId) {
            setActiveKey(key);
        } else {
            if (
                key === 'basic-information' ||
                (key === 'upload-files' && stepsCompleted.step1) ||
                (key === 'publish-course' && stepsCompleted.step1 && stepsCompleted.step2)
            ) {
                setActiveKey(key);
            }
        }
    };

    // Function to update course data from child components
    const updateCourseData = (newData) => {
        setCourseData((prevData) => ({
            ...prevData,
            ...newData
        }));
    };

    const completeStep = (step) => {
        setStepsCompleted((prevSteps) => ({
            ...prevSteps,
            [step]: true
        }));
    };
    const resetStep = () => {
        setStepsCompleted((prevSteps) => ({
            ...prevSteps,
            step1: false,
            step2: false,
            step3: false
        }));
    };

    // ///////////////// APi Calls ///////////////
    const getCourseById = async (id) => {
        try {
            // return
            const { data } = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_COURSE.replace(':id', id)}`, {}, token);

            const description = textParser(data.description);

            // Map categories to { label, value } format
            const categories = data.category.map((cat) => ({
                label: cat.name,
                value: cat._id
            }));
            const updatedLecture = data.lectures.map((lec) => {
                const description = textParser(lec.description);
                return {
                    ...lec,
                    description: description
                };
            });
            updateCourseData({
                title: data.title,
                subtitle: data.subtitle,
                category: categories,
                createdBy: data.createdBy?._id,
                thumbnail: data.thumbnail,
                banner: data.banner,
                trailer: data.trailer,
                description: description,
                lectures: updatedLecture
            });

            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: false } });
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'coachName', data: data.createdBy?.name } });
        } catch (error) {
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: false } });
        }
    };

    const getLectures = async (id) => {
        try {
            const { data } = await axiosWrapper('GET', `${API_URL.GET_ALL_LECTURES}?courseId=${id}`, {}, token);
            updateCourseData({
                lectures: data
            });

            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'lectureUpdate', data: false } });
        } catch (error) {
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'lectureUpdate', data: false } });
        }
    };

    const createOrUpdateCourse = async (formData) => {
        console.log(formData);
        return false;
        if (currentCourse) {
            await axiosWrapper(
                'PUT',
                `${API_URL.SUPABASE_UPDATE_COURSE.replace(':id', currentCourse)}`,
                formData,
                token
            );

            getCourseById(currentCourse);

            // updateCourseData({
            //     title: course?.data?.title,
            //     subtitle: course?.data?.subtitle,
            //     category: course?.data?.category,
            //     createdBy: course?.data?.createdBy?._id,
            //     thumbnail: course?.data?.thumbnail,
            //     trailer: course?.data?.trailer,
            //     description: course?.data?.description,
            //     lectures: course?.data?.lectures
            // });
        } else {
            const course = await axiosWrapper('POST', API_URL.SUPABASE_CREATE_COURSE, formData, token);

            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourse', data: course?.data?._id } });
        }

        // Call the get Course By Id so we can have updated state of part one
        dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
    };

    const handlePublishCourse = async () => {
        await axiosWrapper('PUT', `${API_URL.PUBLISH_COURSE.replace(':id', currentCourse)}`, {}, token);
        // Call the get Course By Id so we can have updated state of part one
        // dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
    };

    // /////////// Hooks //////////
    useEffect(() => {
        if (stepsCompleted.step1 && stepsCompleted.step2) {
            setActiveKey('publish-course');
        } else if (stepsCompleted.step1) {
            setActiveKey('upload-files');
        }
    }, [stepsCompleted]);

    useEffect(() => {
        if (currentCourseUpdate) {
            getCourseById(currentCourse);
        }
    }, [currentCourseUpdate]);

    useEffect(() => {
        if (lectureUpdate) {
            getLectures(currentCourse);
        }
    }, [lectureUpdate]);

    useEffect(() => {
        if (courseId) {
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourse', data: courseId } });
            getCourseById(courseId);
        }
    }, [courseId]);
    const toggleSwitch = () => {
        setIsPublished(!isPublished);
    };

    // for Confirmation model :
    const handlePublishCourseModal = () => {
        setPublishCourseModel(false);
    };
    const setShowConfirmModal = (e) => {
        e.stopPropagation();
        setPublishCourseModel(true);
    };
    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            setLoading(true);
            // Create the course
            const formData = { ...values, category: values.category.map((cat) => cat.value) };
            await createOrUpdateCourse(formData);

            setStepComplete('step1');
            setSubmitting(false);
            setLoading(false);
            resetForm();
        } catch (error) {
            setSubmitting(false);
            setLoading(false);
            resetStep();
        }
    };

    return (
        <>
            <div className="addcourse-section">
                <Tabs id="add-course-tabs" activeKey={activeKey} onSelect={(k) => handleTabChange(k)}>
                    <Tab eventKey="basic-information">
                        <div className="title-top">
                            <span onClick={() => navigate(`/${role}/courses-supabase`)} style={{ cursor: 'pointer' }}>
                                Add Course
                                {/* <img src={CaretRight} alt=">" />{' '} */}
                            </span>
                            {/* {editMode ? 'Edit New Course' : 'Add New Course'} */}

                            <div className="toggle-wrapper">
                                <span className="toggle-label">{isPublished ? 'Published' : 'Unpublished'}</span>
                                <div className="switch">
                                    <input type="checkbox" id="switch" checked={isPublished} onChange={toggleSwitch} />
                                    <label htmlFor="switch"></label>
                                </div>
                            </div>
                        </div>

                        <div className="Course-form">
                            <div className="form-group">
                                <TextField
                                    id="Title-basic"
                                    label="Title"
                                    variant="outlined"
                                    onChange={(e) => {
                                        if (e.target.value.length <= 80) setTitle(e.target.value);
                                    }}
                                    inputProps={{ maxLength: 80 }}
                                    helperText={`${title.length}/80`}
                                    fullWidth
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    id="SubTitle-basic"
                                    label="Subtitle"
                                    variant="outlined"
                                    onChange={(e) => {
                                        if (e.target.value.length <= 120) setSubtitle(e.target.value);
                                    }}
                                    inputProps={{ maxLength: 120 }}
                                    helperText={`${subtitle.length}/120`}
                                    fullWidth
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    id="Description-basic"
                                    label="Course Description"
                                    variant="outlined"
                                    multiline
                                    rows={7}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 500) setDescription(e.target.value);
                                    }}
                                    inputProps={{ maxLength: 500 }}
                                    helperText={`${description.length}/500`}
                                    fullWidth
                                />
                            </div>
                        </div>
                        <CourseAccessType />

                        <CourseCategory />
                        <UploadThumbnail
                            setStepComplete={completeStep}
                            resetStep={resetStep}
                            initialData={courseData}
                            onNext={() => handleTabChange('upload-files')}
                            updateCourseData={updateCourseData}
                        />
                        <div className="">
                            <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                                <Button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => navigate(`/${role}/courses-supabase`)}
                                    // disabled={isSubmitting}
                                    // onClick={onBack}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    className="submit-btn"
                                    // disabled={isSubmitting}
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#confirmModal"
                                    onClick={() => setPublishCourseModel(true)}
                                >
                                    Save & Next
                                </Button>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="upload-files">
                        <AddLecture
                            setStepComplete={completeStep}
                            onBack={() => handleTabChange('basic-information')}
                            updateCourseData={updateCourseData}
                            initialData={courseData}
                        />
                    </Tab>
                </Tabs>
            </div>
            <>
                {/* confirmation model : default */}

                {publishCourseModel && (
                    <ConfirmationBox
                        show={publishCourseModel}
                        onClose={handlePublishCourseModal}
                        onConfirm={handleSubmit}
                        title="Publish your course!"
                        // body="Are you sure you want to delete this course? Data associated with this course will be lost."
                        loading={loadingCRUD}
                        customFooterClass="custom-footer-class"
                        nonActiveBtn="cancel-btn"
                        activeBtn="submit-btn"
                        cancelButtonTitle="Cancel"
                        activeBtnTitle="Proceed"
                        modalClassName="coursemodal publishcourse"
                    />
                )}
            </>
        </>
    );
};

export default AddNewCourse;
