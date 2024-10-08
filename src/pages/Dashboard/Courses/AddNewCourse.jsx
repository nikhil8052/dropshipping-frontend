import { useEffect, useState } from 'react';
import PublishCourses from './PublishCourses';
import BasicInformation from './BasicInformation';
import UploadFiles from './UploadFiles';
import ClipboardText from '@icons/ClipboardText.svg';
import Stack from '@icons/Stack.svg';
import taskAlt from '@icons/task_alt.svg';
import CaretRight from '@icons/CaretRight.svg';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../../styles/Courses.scss';
import axiosWrapper from '../../../utils/api';
import * as types from '../../../redux/actions/actionTypes';
import { API_URL } from '../../../utils/apiUrl';
import { textParser } from '../../../utils/utils';

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

    const [courseData, setCourseData] = useState({
        title: '',
        subtitle: '',
        category: [],
        createdBy: null,
        thumbnail: '',
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
    const handleTabChange = (key) => {
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
            const { data } = await axiosWrapper('GET', `${API_URL.GET_COURSE.replace(':id', id)}`, {}, token);

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
        if (currentCourse) {
            await axiosWrapper('PUT', `${API_URL.UPDATE_COURSE.replace(':id', currentCourse)}`, formData, token);

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
            const course = await axiosWrapper('POST', API_URL.CREATE_COURSE, formData, token);

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

    // Steps for creating a new course
    // 1. Basic Information Module
    // Create a new course in the db with just title, subtitle, module manger, category
    // Save the course Id to redux state so we can call it every time during each steps
    // create a complete state for the course in this module so we can update it every time when course is updated
    // Handle the Add Lecture step for Both PDF and video upload (We can keep this at the end of the course)
    // At the end of third step we just publish the new course.

    // Api's call
    // 1. Create a new course
    // 2. Update the course
    // 3. Get Course information By Id
    // 4. Get All Coaches
    // 5. Create a new Lecture
    // 6. Update a lecture (if video then replace it with a new one else if pdf then replace it with a new pdf but first remove it on the DB)
    // 7. Get Lecture By Id
    // 8. Delete a lecture Both from Vimeo and DataBase
    // 9. Create Helpers for Data Mapping of lectures
    // 10. Publish a New Course Api
    // 11. Get All Courses of User that created by this user
    // 12. Use Best practices and move the state in the parent component to handle it properly

    return (
        <div className="addcourse-section">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                    Courses <img src={CaretRight} alt=">" />{' '}
                </span>
                {editMode ? 'Edit New Course' : 'Add New Course'}
            </div>
            <Tabs
                fill
                activeKey={activeKey}
                onSelect={(k) => handleTabChange(k)}
                id="controlled-tab-example"
                className="mb-3"
            >
                <Tab
                    eventKey="basic-information"
                    title={
                        <span className="tab-span">
                            <img src={Stack} alt="course-icon" /> Basic Information
                        </span>
                    }
                >
                    <BasicInformation
                        setStepComplete={completeStep}
                        resetStep={resetStep}
                        initialData={courseData}
                        onNext={() => handleTabChange('upload-files')}
                        createOrUpdateCourse={createOrUpdateCourse}
                        updateCourseData={updateCourseData}
                    />
                </Tab>
                <Tab
                    eventKey="upload-files"
                    title={
                        <span className="tab-span">
                            <img src={ClipboardText} alt="course-icon" /> Upload Files
                        </span>
                    }
                >
                    <UploadFiles
                        setStepComplete={completeStep}
                        onNext={() => handleTabChange('publish-course')}
                        onBack={() => handleTabChange('basic-information')}
                        updateCourseData={updateCourseData}
                        initialData={courseData}
                    />
                </Tab>
                <Tab
                    eventKey="publish-course"
                    title={
                        <span className="tab-span">
                            <img src={taskAlt} alt="course-icon" /> Publish Course
                        </span>
                    }
                >
                    <PublishCourses
                        onBack={() => handleTabChange('upload-files')}
                        initialData={courseData}
                        setStepComplete={completeStep}
                        publishCourse={handlePublishCourse}
                    />
                </Tab>
            </Tabs>
        </div>
    );
};

export default AddNewCourse;
