import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CaretRight from '@icons/CaretRight.svg';
import { InputGroup, Button, Form, Col, Row } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import InactiveIcon from '../../../assets/icons/Icon-inactive-lec.svg';
import ActiveIcon from '../../../assets/icons/active-lect.svg';
import { Form as FormikForm, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import '../../../styles/Courses.scss';
import PdfModal from '../../../components/PdfRenderer/PdfViewer';
import toast from 'react-hot-toast';
import { shuffleArray } from '../../../utils/common';
import bannerImage from '../../../assets/images/publish-background.svg';
import checkicon from '../../../assets/images/Check.svg';
import checkicon2 from '../../../assets/images/check2.svg';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import EnrollFolderStructure from './EnrollFolderStructure';
import '../Courses-supabase/CourseNew.scss';
import Loading from '@components/Loading/Loading';
import CustomProgressBar from '../../../components/CustomProgressBar/CustomProgressBar';
import LectureCurriculumSkeleton from '../../../components/LectureCurriculumSkeleton';

const EnrolledCourseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
    const [loading, setLoading] = useState(true);
    const [lectureLoading, setLectureLoading] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const cid = queryParams.get('cid');
    const lid = queryParams.get('lid');
    const medium = queryParams.get('m');

    const [currentCourseID, setCurrentCourseID] = useState('');
    const [search, setSearch] = useState('');
    const [lectures, setLectures] = useState([]);
    const [filteredLectures, setFilteredLectures] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [continueQuiz, setContinueQuiz] = useState(false);
    const [courseDetails, setCourseDetails] = useState({});
    const [retryQuiz, setRetryQuiz] = useState(false);
    const [slugOnce, setSlugOnce] = useState(false);
    // const [accessRestricted, setAccessRestricted] = useState(false);
    const accessRestricted = false;

    const [course, setCourse] = useState(0);
    const [unassignedLectures, setUnassignedLectures] = useState([]);
    const [topics, setTopics] = useState([]);
    useEffect(() => {
        const processCourseData = (courseData) => {
            if (!courseData || !courseData.folders || !courseData.lectures) {
                console.error("Course data or lectures/folders missing");
                return; // Exit if data is incomplete
            }

            // Process folders into topics
            const processedTopics = courseData.folders.map(folder => ({
                id: folder.id,
                name: folder.name,
                lectures: folder.lectures || []
            })) || [];

            // Process unassigned lectures
            const unassigned = courseData.lectures.filter(lecture => {
                // Check if folder_id is null, empty string, or undefined
                return !lecture.folder_id;  // This will handle null, undefined, and empty string
            }) || [];

            setTopics(processedTopics);
            setUnassignedLectures(unassigned);

        };

        if (courseDetails) {
            processCourseData(courseDetails);
        }
    }, [courseDetails]);

    let courseId = location.state?.courseId;
    // const courseId = location.state?.courseId;

    const [initialValues, setInitialValues] = useState({
        mcqs: []
    });

    if (medium == 'direct') {
        courseId = cid;
        // setCurrentCourseID(cid);
    }

    // useEffect(()=>{
    //     if(medium=="direct"){
    //         courseId=cid;
    //         setCurrentCourseID(cid);
    //     }
    // },[])

    const validationSchema = Yup.object().shape({
        mcqs: Yup.array()
            .of(
                Yup.object().shape({
                    questionId: Yup.string()
                        .matches(/^[0-9a-fA-F]{24}$/, 'Invalid question ID')
                        .required('Question ID is required'),
                    answer: Yup.string().required('Answer is required')
                })
            )
            .required('MCQs are required')
    });

    const continueHandler = () => {
        setContinueQuiz(true);
    };

    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    const getCourseById = async (id, nextLecture) => {
        console.log('next-lecture',nextLecture);
        console.log('current-lecture',id);
        const { data } = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_COURSE.replace(':id', id)}`, {}, token);

        setCurrentCourseID(id);
        // Higher Level info
        setCourseDetails({
            title: data.title,
            moduleManager: data.createdBy?.name,
            category: data.category || [],
            banner: data?.banner || '',
            lectures: data?.lectures || [],
            folders: data?.folders || [],
            
        });
        // Overall lectures
        setLectures(data.lectures);

        // Handle search results
        setFilteredLectures(data.lectures);
        const incompleteLectureIndex = data.lectures.find((lec) => !lec.completedBy?.includes(userInfo?.id));
        // Get the first lecture
        // if (nextLecture && activeIndex <= data?.lectures?.length - 1) {
        if (nextLecture) {
            getCurrentLecture(nextLecture);
        } else if (incompleteLectureIndex?.id !== undefined) {
            getCurrentLecture(incompleteLectureIndex?.id);
        } else {
            getCurrentLecture(data.lectures[0]?.id);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (lid != null) {
            for (let idx = 0; idx < lectures.length; idx++) {
                const lec = lectures[idx];
                if (lec.id == lid) {
                    setActiveIndex(idx);
                    getCurrentLecture(lec.id);
                    break;
                }
            }
        }
    }, [lectures, medium, cid]);
    // Commenting out for future reference
    // Handle eligibility check based on courseAccessUntil
    // const checkAccessEligibility = () => {
    //     const currentDate = new Date();
    //     const accessUntilDate = new Date(userInfo?.courseAccessUntil);

    //     if (userInfo?.paymentType === 'installments' && accessUntilDate < currentDate) {
    //         setAccessRestricted(false);
    //     } else {
    //         setAccessRestricted(false);
    //     }
    // };

    // useEffect(() => {
    //     checkAccessEligibility();

    //     return () => {
    //         setAccessRestricted(false);
    //     };
    // }, [userInfo?.courseAccessUntil]);

    const getCurrentLecture = async (id) => {
        if (!id) return;
        setLectureLoading(true);
        const { data } = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_LECTURE.replace(':id', id)}`, {}, token);
        setSelectedLecture(data);
        const mcqs = data.quiz?.mcqs;

        const initialValues = {
            mcqs: mcqs?.map((mcq) => ({
                questionId: mcq.id,
                answer: mcq.answer || '',
                question: mcq.question,
                options: shuffleArray(mcq.options)
            }))
        };
        setInitialValues(initialValues);
        setLectureLoading(false);

    };
    const decodeHtmlEntities = (encodedString) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = encodedString;
        return textarea.value;
    };

    useEffect(() => {
        if (courseId) {
            getCourseById(courseId);
        }
    }, [courseId]);

    useEffect(() => {
        if (search) {
            const filtered = lectures.filter((lecture, idx) => {
                const searchCriteria = lecture.name.toLowerCase() || lecture.description.toLowerCase();
                return searchCriteria.includes(search.toLowerCase());
            });
            setFilteredLectures(filtered);
        } else {
            if (lectures.length > 0 && slugOnce == false && medium == null) {
                const name = lectures[0].name;
                const slug = createSlug(name);
                const segments = location.pathname.split('/').filter(Boolean);
                const lastSegment = segments[segments.length - 1];
                if (lastSegment !== slug) {
                    segments.push(slug);
                    setSlugOnce(true);
                    const newUrl = `/${segments.join('/')}`;
                    navigate(newUrl, { replace: true }); // Ensure leading slash & avoid history stacking
                }
            }
            setFilteredLectures(lectures);
        }
    }, [search, lectures]);

    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    };

    const handleButtonClick = (index, fetchLecture = true) => {
        setActiveIndex(index);
        if (fetchLecture) getCurrentLecture(lectures[index]?.id);

        if (lectures[index]) {
            if (lectures[index] && lectures[index].name) {
                const slug = createSlug(lectures[index].name);
                // Get URL segments
                const segments = location.pathname.split('/').filter(Boolean); // Remove empty segments
                const lastSegment = segments[segments.length - 1]; // Get last part of the URL
                if (lastSegment !== slug) {
                    // Replace last segment with the new slug
                    if (segments.length > 1) {
                        segments[segments.length - 1] = slug; // Replace last segment
                    } else {
                        segments.push(slug); // If only one segment, just add it
                    }
                    const newUrl = `/${segments.join('/')}`;
                    navigate(newUrl, { replace: true }); // Ensure leading slash
                }
            }
        }
        setContinueQuiz(false);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const answers = {
                mcqs: values.mcqs.map((mcq) => ({
                    questionId: mcq.questionId,
                    answer: mcq.answer
                }))
            };

            const { data } = await axiosWrapper(
                'PUT',
                `${API_URL.PERFORM_QUIZ.replace(':id', selectedLecture.id)}`,
                answers,
                token
            );
            if (data.pass) {
                // Proceed to next lecture if pass
                handleButtonClick(activeIndex + 1, false);
                getCourseById(courseId, lectures[activeIndex + 1]?.id);
                setCourseId(courseId); // Refresh course data
                toast.success('You have passed the quiz. Proceeding to the next lecture.');
                setRetryQuiz(false);
            } else {
                // Handle retry logic
                toast.error('You have failed the quiz. Please retry.');
                setRetryQuiz(true);
            }
            setSubmitting(false);
            resetForm();
        } catch (error) {
            setSubmitting(false);
            resetForm();
        }
    };

    // const markLectureAsCompleted = async (lectureId) => {
    //     const URL = `${API_URL.SUPABASE_MARK_LECTURE_COMPLETED.replace(':id', lectureId)}`;
    //     await axiosWrapper('PUT', URL, {}, token);
    //     setSlugOnce(true);
    //     getCourseById(currentCourseID, lectures[activeIndex]?.id);
    // };

    const markLectureAsCompleted = async (lectureId, courseId) => {
        const URL = `${API_URL.SUPABASE_MARK_LECTURE_COMPLETED.replace(':id', lectureId)}`;        
        const data = {
            lectureId,
            courseId
        };
        
        await axiosWrapper('PUT', URL, data, token);
        
        let nextLecture = lectures
        .slice(activeIndex + 1)
        .find(lecture => !lecture.lecture_progress?.[0]?.is_completed);
    
        if (!nextLecture) {
            nextLecture = lectures
            .slice(0, activeIndex)
            .find(lecture => !lecture.lecture_progress?.[0]?.is_completed);
        }
    
        const targetLectureId = nextLecture?.id || lectures[activeIndex]?.id;
          
        
    
        setSlugOnce(true);
        // getCourseById(currentCourseID, lectures[activeIndex]?.id);
        if (nextLecture) {
            const newIndex = lectures.findIndex(lec => lec.id === targetLectureId);
            setActiveIndex(newIndex);
            updateLectureUrl(newIndex);
            console.log(newIndex);
            getCourseById(currentCourseID, targetLectureId);
        } else {
            getCourseById(currentCourseID, targetLectureId);
        }
    };

    const updateLectureUrl = (index) => {
        if (lectures[index]?.name) {
          const slug = createSlug(lectures[index].name);
          const segments = location.pathname.split('/').filter(Boolean);
          
          if (segments[segments.length - 1] !== slug) {
            const newSegments = segments.slice(0, -1).concat(slug);
            navigate(`/${newSegments.join('/')}`, { replace: true });
          }
        }
      };

    const handleLectureSelect = (lecture) => {
        setSelectedLecture(lecture);
    };
    // const calculateCompletionPercentage = () => {
    //     console.log('%lectures',lectures);
    //     if (lectures.length === 0) return 0;
    //     const completedLectures = lectures.filter(lecture => lecture.lecture_progress?.is_completed).length;
    //     console.log('completedLectures',completedLectures);
    //     return (completedLectures / lectures.length) * 100;
    // };
    const calculateCompletionPercentage = () => {
        if (lectures.length === 0) return 0;
        
        lectures.forEach((lecture, index) => {  
            if (lecture.lecture_progress && lecture.lecture_progress.length > 0) {
                const progress = lecture.lecture_progress[0];
            } else {
                // console.log(`Lecture ${index + 1} has no progress data.`);
            }
        });
        const completedLectures = lectures.filter(lecture => 
            lecture.lecture_progress?.length > 0 && 
            lecture.lecture_progress[0]?.is_completed
        ).length;    
        return (completedLectures / lectures.length) * 100;
    };
    
    
    return (
        <>
        {loading ? (
            <Loading />
        ) : (
        <div className="EnrolledCourseDetail">
            {filteredLectures.length === 0 ? (
                <>
                    <div className="title-top">
                        <span onClick={() => navigate(`/${role}/courses-supabase`)} style={{ cursor: 'pointer' }}>
                            Courses <img src={CaretRight} alt=">" />
                        </span>{' '}
                        Enrolled Course Details
                    </div>
                    <p className="no-data-wrapper">No Lecture Found</p>
                </>
            ) : (
                <>
                    {accessRestricted ? (
                        <div className="restricted-access-message">
                            <h3>Access Restricted</h3>
                            <p>
                                Your access to this course has been restricted. Please pay the next installment to
                                continue.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className='col-md-8'>
                                <div className="title-top">
                                    <span
                                        onClick={() => navigate(`/${role}/courses-supabase`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Courses <img src={CaretRight} alt=">" />
                                    </span>{' '}
                                    {/* Enrolled Course Details */}
                                    {courseDetails?.title || 'Enrolled Course Details'}
                                     <img src={CaretRight} alt=">" /> 
                                     {/* Lecture {activeIndex + 1} */}
                                     {lectures[activeIndex]?.name}
                                </div>
                                </div>
                                <div className="col-md-4">
                                    {/* <InputGroup>
                                        <InputGroup.Text>
                                            <img src={Search} alt="Search" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            className="search-input"
                                            type="text"
                                            name="Search"
                                            label="Search"
                                            value={search}
                                            onChange={onFilterTextChange}
                                            placeholder="Search"
                                        />
                                    </InputGroup> */}
                                </div>
                            </div>
                            <Formik
                                enableReinitialize
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, values, setFieldValue }) => (
                                    <FormikForm>
                                        <div
                                            className="card-background"
                                            style={{
                                                backgroundImage: `url(${courseDetails?.banner || bannerImage})`,
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover'
                                            }}
                                        >
                                            <div className="text-heading">
                                                <h1>{courseDetails?.title || 'Course Title'}</h1>
                                                <div className="viewProfile-img">
                                                    <p>{courseDetails?.moduleManager || 'Module Manager'}</p>
                                                </div>
                                            </div>

                                            <div className="category-container">
                                                {courseDetails?.category?.map((cat) => (
                                                    <span key={cat.id} className="category-tag">
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Row className="section-border">
                                            <Col sm={12} md={6} lg={4} xl={3}>
                                                <div className="search-lectures lec-left">
                                                    <div className="title-lecture-btns">
                                                        <h1>{courseDetails?.title}</h1>
                                                    </div>

                                                    <div className="lecture-btns">
                                                    {/* <EnrollFolderStructure
                                                        topics={topics}
                                                        unassignedLectures={unassignedLectures}
                                                        onLectureSelect={selectedLecture}
                                                    /> */}
                                                   <div className='progress-wrap'> 
                                                   <CustomProgressBar progress={calculateCompletionPercentage().toFixed(2)} />

                                                        {/* <h3>Course Completion:</h3>
                                                        <input 
                                                            type="number" 
                                                            value={calculateCompletionPercentage().toFixed(2)} 
                                                            readOnly
                                                            style={{ width: '100px', textAlign: 'center', fontSize: '16px' }}
                                                        />
                                                        <span>%</span> */}
                                                    </div>
                                                    <EnrollFolderStructure 
                                                        topics={topics}
                                                        unassignedLectures={unassignedLectures}
                                                        filteredLectures={filteredLectures}
                                                        onLectureSelect={(lecture) => {
                                                            const index = filteredLectures.findIndex(l => l.id === lecture.id);
                                                            if (index !== -1) {
                                                            handleButtonClick(index);
                                                            }
                                                        }}
                                                        selectedLectureId={selectedLecture?.id}
                                                        userInfo={userInfo}
                                                        markLectureAsCompleted={markLectureAsCompleted}
                                                        accessRestricted={accessRestricted}
                                                    />
                                                        {/* {filteredLectures.map((lecture, index) => (
                                                            <Button
                                                                type="button"
                                                                key={index}
                                                                className={`btn ${lecture?.id === selectedLecture?.id ? 'active' : 'inactive'} ${lecture?.completedBy?.includes(userInfo?.id) && 'passed-lecture'}`}
                                                                onClick={() => handleButtonClick(index)}
                                                                disabled={
                                                                    accessRestricted ||
                                                                    (index > 0 &&
                                                                        !filteredLectures[
                                                                            index - 1
                                                                        ]?.completedBy?.includes(userInfo?.id) &&
                                                                        lecture?.quiz?.mcqs?.length > 0)
                                                                }
                                                            >
                                                                <div>
                                                                    <img
                                                                        src={
                                                                            lecture?.completedBy?.includes(userInfo?.id)
                                                                                ? ActiveIcon
                                                                                : InactiveIcon
                                                                        }
                                                                        alt="IconLect"
                                                                    />
                                                                    <p>{lecture.name}</p>
                                                                </div>
                                                                <img
                                                                    className="checkimg"
                                                                    src={
                                                                        lecture?.completedBy?.includes(userInfo?.id)
                                                                            ? checkicon
                                                                            : ''
                                                                    }
                                                                    alt="IconLect"
                                                                />
                                                            </Button>
                                                        ))} */}
                                                    </div>
                                                </div>
                                            </Col>
                                            {/* eslint-disable  */}
                                            <Col sm={12} md={6} lg={8} xl={9}>
                                            <div className="lecture-right">
                                            {lectureLoading? (
                                                <LectureCurriculumSkeleton />
                                            ) : (<>
                                            {!continueQuiz && selectedLecture && (
                                                    <div className="lecture-curriculum">
                                                        <h2 className="title">
                                                            {selectedLecture.name}
                                                                {/* {selectedLecture.completedBy?.some(user => user.id === userInfo?.id) ?  <img className='checkimg' src={checkicon}   alt="Already completed"
                                                                    data-tooltip-id="my-tooltip2" data-tooltip-place="top" 
                                                                     data-tooltip-content="Already completed"/> : <img className='checkimg' 
                                                                       onClick={() =>
                                                                    markLectureAsCompleted(selectedLecture?.id)
                                                                }  src={checkicon2}  alt="Mark lecture as completed."
                                                                data-tooltip-id="my-tooltip2"   data-tooltip-place="top" data-tooltip-content="Mark lecture as completed."/>} */}
                                                                {selectedLecture?.lecture_progress?.is_completed ?  <img className='checkimg' src={checkicon}   alt="Already completed"
                                                                    data-tooltip-id="my-tooltip2" data-tooltip-place="top"  style={{ cursor: 'pointer' }}
                                                                     data-tooltip-content="Already completed"/> : <img className='checkimg' 
                                                                       onClick={() =>
                                                                    markLectureAsCompleted(selectedLecture?.id)
                                                                }  src={checkicon2}  alt="Mark lecture as completed."
                                                                data-tooltip-id="my-tooltip2"   style={{ cursor: 'pointer' }}  data-tooltip-place="top" data-tooltip-content="Mark lecture as completed."/>}
                                                                
                                                        </h2>
                                                        
                                                        <p
                                                            className="mb-2"
                                                            dangerouslySetInnerHTML={{
                                                                __html: decodeHtmlEntities(selectedLecture.description)
                                                            }}
                                                        ></p>
                                                    </div>
                                                )}

                                                {continueQuiz && selectedLecture && (
                                                    <div className="quiz-curriculum">
                                                        <h1 className="title">Quiz {selectedLecture.name}:</h1>

                                                        {values?.mcqs.length > 0 && (
                                                            <>
                                                                <p className="title mb-0 mt-2 fw-bold">
                                                                    Multiple Choice Questions ({values?.mcqs.length}/
                                                                    {values?.mcqs.length}) :
                                                                </p>
                                                                {values?.mcqs.map((mcq, index) => (
                                                                    <div className="add-quiz-question" key={index}>
                                                                        <div className="questions">
                                                                            <Form.Label>{`Q 0${index + 1}: ${mcq.question}`}</Form.Label>
                                                                            <div className="d-flex flex-wrap">
                                                                                {mcq.options.map((option, idx) => (
                                                                                    <div
                                                                                        key={`inline-radio-${index}-${idx}`}
                                                                                        className="d-flex selectedLecture.quiz"
                                                                                    >
                                                                                        <Form.Check
                                                                                            name={`mcqs[${index}].answer`}
                                                                                            inline
                                                                                            label={option}
                                                                                            onChange={(e) => {
                                                                                                // Set field value in Formik
                                                                                                setFieldValue(
                                                                                                    `mcqs[${index}].answer`,
                                                                                                    e.target.value
                                                                                                );
                                                                                            }}
                                                                                            type="radio"
                                                                                            id={`inline-radio-${index}-${idx}`}
                                                                                            value={option}
                                                                                        />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            {/* Render the error message outside of the options loop */}
                                                                            <ErrorMessage
                                                                                name={`mcqs[${index}].answer`}
                                                                                component="div"
                                                                                className="error"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                               </>)} 
                                            </div>
                                            </Col>
                                        </Row>
                                        <Tooltip id="my-tooltip2" />
                                        <div className="viewProgress-footer mx-auto">
                                            {continueQuiz ? (
                                                <Button
                                                    className="done-btn"
                                                    type="submit"
                                                    disabled={
                                                        isSubmitting ||
                                                        selectedLecture?.completedBy?.includes(userInfo?.id)
                                                    }
                                                >
                                                    {retryQuiz ? 'Retry Quiz' : 'Submit Quiz'}
                                                </Button>
                                            ) : (
                                                <>
                                                    {
                                                        /* Continue to Quiz Button */
                                                        selectedLecture && selectedLecture.quiz && selectedLecture.quiz.mcqs && selectedLecture.quiz.mcqs.length !== 0 ? (
                                                            <Button
                                                                className="done-btn"
                                                                type="button"
                                                                onClick={continueHandler}
                                                                disabled={
                                                                    isSubmitting ||
                                                                    selectedLecture?.completedBy?.includes(
                                                                        userInfo?.id
                                                                    )
                                                                }
                                                            >
                                                                Continue To Quiz
                                                            </Button>
                                                        ) : (
                                                            <></>
                                                            // <Button
                                                            //     className="done-btn"
                                                            //     type="button"
                                                            //     onClick={() =>
                                                            //         // markLectureAsCompleted(selectedLecture?.id)
                                                            //         markLectureAsCompleted(selectedLecture?.id, selectedLecture?.courseId)

                                                            //     }
                                                            // >
                                                            //     Done
                                                            // </Button>
                                                        )
                                                    }
                                                </>
                                            )}
                                        </div>
                                    </FormikForm>
                                )}
                            </Formik>
                        </>
                    )}
                </>
            )}
        </div>
        )}
        </>
    );
};

export default EnrolledCourseDetail;
