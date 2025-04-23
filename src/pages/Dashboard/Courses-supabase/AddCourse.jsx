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
import AddLecture from './AddLecture';
import AddLectureModel from './AddLectureModal';

const AddNewCourse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
    const editMode = location.state?.isEdit || false;
    // const courseId = location.state?.courseId;
    const [activeKey, setActiveKey] = useState('basic-information');
    const currentCourse = useSelector((state) => state?.root?.currentCourse);
    const currentCourseUpdate = useSelector((state) => state?.root?.currentCourseUpdate);
    const lectureUpdate = useSelector((state) => state?.root?.lectureUpdate);
    const [loading, setLoading] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const courseId = useSelector((state) => state?.root?.currentCourse);

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
            const { data } = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_COURSE.replace(':id', id)}`, {}, token);
            
            console.log( data, "COURSE DATA ")
            // if(data.id  && data.lectures.length == 0){
            //     const newLecture = await axiosWrapper(
            //         'POST',
            //         API_URL.SUPABASE_ADD_LECTURE,
            //         {
            //           name: 'New Page',
            //           courseId: data.id
            //         },
            //         token
            //       );  
            // }
            const description = textParser(data.description);

            // Map categories to { label, value } format
            const categories = data.categoryDetails.map((cat) => ({
                label: cat.name,
                value: cat.id
            }));
            // const updatedLecture = data.lectures.map((lec) => {
            //     const description = textParser(lec.description);
            //     return {
            //         ...lec,
            //         description: description
            //     };
            // });
            updateCourseData({
                title: data.title,
                subtitle: data.subtitle,
                category: categories,
                createdBy: data.createdBy?.id,
                thumbnail: data.thumbnail,
                access_type:data.access_type,
                banner: data.banner,
                trailer: data.trailer,
                description: description,
                lecturess: data.unassignedLectures,
                folders:data.folders
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
       

          
        try {
          if (currentCourse) {
            await axiosWrapper('PUT', `${API_URL.SUPABASE_UPDATE_COURSE.replace(':id', currentCourse)}`, formData, token);
            getCourseById(currentCourse);
          } else {
            const course = await axiosWrapper('POST', API_URL.SUPABASE_CREATE_COURSE, formData, token);
            console.warn(course);
            const newLecture = await axiosWrapper(
                'POST',
                API_URL.SUPABASE_ADD_LECTURE,
                {
                  name: 'New Page',
                  courseId: course.data.id
                },
                token
              );  
            console.warn(newLecture);

            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourse', data: course.data.id } });
          }
      
          dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
        } catch (error) {
          console.error('Error in createOrUpdateCourse:', error);
        }
      };
      
    // const createOrUpdateCourse = async (formData) => {
        
    //     if (currentCourse) {
    //         await axiosWrapper('PUT', `${API_URL.SUPABASE_UPDATE_COURSE.replace(':id', currentCourse)}`, formData, token);

    //         getCourseById(currentCourse);
    //     } else {
            
    //         const course = await axiosWrapper('POST', API_URL.SUPABASE_CREATE_COURSE, formData, token);
    //         const courseId = course?.data?.id; 
    //        
    //         const newLecture = await createLectore(courseId);
    //         // const newLecture = await createLectore(courseId);
    //         // const formData = {
    //         //     name: "New Lecture",
    //         //     description: null,
    //         //     courseId: courseId,
    //         // };
    //         // const lectureData = await axiosWrapper('POST', API_URL.SUPABASE_ADD_LECTURE, formData, token);
    //         dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourse', data: courseId } }); 
    //     }
        
    //         // Call the get Course By Id so we can have updated state of part one
    //         dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
    //     };

        // const createLecture = async (courseId) => {
        //     try {
        //         const response = await axiosWrapper(
        //             'POST',
        //             `${API_URL.SUPABASE_ADD_LECTURE}`,
        //             // { name: 'New Lecture', courseId: courseId },
        //             formData,
        //             token
        //         );
        
        //         const createdLecture = response?.data;
        //         return createdLecture;
               
        //     } catch (error) {
        //         return null;
        //     }
        // };
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
    return (
        <div className="addcourse-section">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/courses-supabase`)} style={{ cursor: 'pointer' }}>
                    Add Course
                </span>
                {/* {editMode ? 'Edit New Course' : 'Add New Course'} */}
                <div className="toggle-wrapper">
                    <span className="toggle-label">{isPublished ? 'Published' : 'Unpublished'}</span>
                    <div className="switch">
                        <input
                            type="checkbox"
                            id="switch"
                            checked={isPublished}
                            onChange={toggleSwitch}
                        />
                        <label htmlFor="switch"></label>
                    </div>
                </div>
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
                    // title={
                    //     <span className="tab-span">
                    //         Add Course
                    //     </span>
                    // }
                >
                    <BasicInformation
                        setStepComplete={completeStep}
                        resetStep={resetStep}
                        initialData={courseData}
                        onNext={() => handleTabChange('upload-files')}
                        createOrUpdateCourse={createOrUpdateCourse}
                        updateCourseData={updateCourseData}
                        onDelete={handleDelete}
                        {...courseData}
                        id={courseId}

                    />
                </Tab>
                <Tab eventKey="upload-files" >
                    <AddLecture setStepComplete={completeStep}
                    onBack={() => handleTabChange('basic-information')}
                    updateCourseData={updateCourseData}
                    initialData={courseData}/>
                </Tab>
                <Tab
                    eventKey="upload-filess"
                    // title={
                    //     <span className="tab-span">
                    //         <img src={ClipboardText} alt="course-icon" /> Upload Files
                    //     </span>
                    // }
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
                    // title={
                    //     <span className="tab-span">
                    //         <img src={taskAlt} alt="course-icon" /> Publish Course
                    //     </span>
                    // }
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
