import { useEffect, useState, useRef } from 'react';
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
import CaretRightt from '@icons/CaretRightt.svg';
import BreadHome from '@icons/BreadHome.svg';
import Player from '@vimeo/player';
import resourceImg from '../../../assets/icons/resource_image.svg';
import linkImg from '../../../assets/icons/linkImg.svg';
import ResourcesModel from '@components/ConfirmationBox/ResourcesModel';
import Swal from 'sweetalert2';

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
    const [accessRestricted, setAccessRestricted] = useState(false);
    // const accessRestricted = false;

    const [course, setCourse] = useState(0);
    const [unassignedLectures, setUnassignedLectures] = useState([]);
    const [topics, setTopics] = useState([]);

    const [selectedResource, setSelectedResource] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setSelectedResource(null);
        setShowModal(false);
    };

    const [feedbackReasons, setFeedbackReasons] = useState([]);
    const [inputOptions, setInputOptions] = useState({});



    useEffect(() => {
        const fetchReasons = async () => {
            try {
                const response = await axiosWrapper(
                    'GET',
                    `${API_URL.SUPABASE_LECTURE_FEEBACK_REASONS}`,
                    {},
                    token
                );

                const reasons = response?.data?.reasons || [];

                // Ensure the reasons have `id` and `label`
                const formattedReasons = reasons.map((reason) => ({
                    id: reason.id,
                    label: reason.title
                }));

                setFeedbackReasons(formattedReasons);

                const options = formattedReasons.reduce((acc, item) => {
                    acc[item.id] = item.label;
                    return acc;
                }, {});

                setInputOptions(options);
            } catch (error) {
                console.error('Error fetching reasons:', error);
            }
        };

        fetchReasons();
    }, [token]);

    useEffect(() => {
        const iframeElement = document.querySelector('iframe.ql-video');
        let hasCalledNearEndFunction = false;
        let hasCalledNear10EndFunction = false;


        if (iframeElement) {
            const player = new Player(iframeElement);

            player.on('play', () => {

            });

            player.on('ended', async () => {


                if (markLectureAsCompleted) {
                    if (
                        selectedLecture?.feedbackInserted === false ||
                        selectedLecture?.feedbackInserted === 'false'
                    ) {
                        handleNearVideoEnd();
                    }

                    await markLectureAsCompleted(selectedLecture.id, selectedLecture.courseId);
                } else {
                    console.error('markLectureAsCompleted function is not defined');
                }


            });

            player.on('timeupdate', ({ seconds, duration }) => {
                const timeLeft = duration - seconds;
                if (timeLeft <= 10 && !hasCalledNear10EndFunction) {
                    hasCalledNear10EndFunction = true;
                    moveNextLecSwal();
                }
            });


            return () => {
                player.off('play');
                player.off('ended');
                player.off('timeupdate');
            };
        }
    }, [selectedLecture]);

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

    const moveNextLecSwal = () => {
        Swal.fire({
            title: '<strong class="congrats-title">Congratulations!</strong>',
            html: '<div class="congrats-text">You\'re moving on to the next lecture.</div>',
            confirmButtonText: 'Next Lecture',
            cancelButtonText: 'Dismiss',
            showCancelButton: true,
            showCloseButton: false,
            customClass: {
                popup: 'custom-congrats',
                confirmButton: 'done-btn',
            },
            showCloseButton: false,
            backdrop: false,
            allowOutsideClick: true,
            allowEscapeKey: true,
            focusConfirm: false,
            timer: 12000,
            timerProgressBar: true,
            didOpen: () => {
                // const iframeElement = document.querySelector('iframe.ql-video');
                // if (iframeElement && typeof Player !== 'undefined') {
                //     const player = new Player(iframeElement);
                //     player.pause().catch(console.error);
                // }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const iframeElement = document.querySelector('iframe.ql-video');
                if (iframeElement) {
                    const player = new Player(iframeElement);
                    try {
                        await player.pause();
                    } catch (error) {
                        console.error('Error pausing Vimeo video:', error);
                    }
                }

                if (markLectureAsCompleted) {
                    await markLectureAsCompleted(selectedLecture.id, selectedLecture.courseId);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log('Popup dismissed');
            }
        });
    };




    const handleNearVideoEnd = () => {
        Swal.fire({
            title: 'How was the video?',
            imageUrl: '/like_dislike.png',
            imageAlt: 'Feedback Icon',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '😊 Like',
            cancelButtonText: '😟 Dislike',
            position: 'center',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'swal-shadow-popup',
                confirmButton: 'like-btn',
                cancelButton: 'dislike-btn',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                sendDislikeFeedback('like');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Why did you dislike it?',
                    input: 'select',
                    inputOptions: inputOptions,
                    inputPlaceholder: 'Select a reason',
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    imageUrl: '/opps_image.png',
                    customClass: {
                        popup: 'swal-dislike-popup',
                        input: 'swal-dislike-select',
                        confirmButton: 'swal-dislike-confirm',
                        cancelButton: 'swal-dislike-cancel'
                    }
                }).then((feedbackResult) => {
                    if (feedbackResult.isConfirmed && feedbackResult.value) {
                        sendDislikeFeedback('dislike', feedbackResult.value);
                    }
                });
            }
        });
    };




    const sendDislikeFeedback = async (type, id) => {

        if (type == 'like') {
            if (markLectureAsCompleted) {
                await markLectureAsCompleted(selectedLecture.id, selectedLecture.courseId);
            }
            return
        }
        const lid = selectedLecture.id;
        const URL = `${API_URL.SUPABASE_MARK_LECTURE_REVIEW.replace(':id', lid)}`;
        const payload = {
            'lecture_id': lid,
            'reason_id': id
        };

        const response = await axiosWrapper('PUT', URL, { payload }, token);

        console.log(response)


    }

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

        const { data } = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_COURSE.replace(':id', id)}`, {}, token);
        // setAccessRestricted(true);
        // console.warn('return data:',data);
        // console.warn('return data:',data?.AccessRestricted);
        // if (data?.AccessRestricted) {
        //     setAccessRestricted(true); 
        //     setLoading(false);

        //     return false; 
        // }
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
            // getCurrentLecture(incompleteLectureIndex?.id);
        } else {
            getCurrentLecture(data.lectures[0]?.id);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (lid != null) {
            for (let idx = 0; idx < lectures.length; idx++) {
                const lec = lectures[idx];
                console.warn('lectures', lectures[idx]);
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

        console.log(data, " This is the current fetched lecture from the server now! ")

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


    const markLectureAsCompleted = async (lectureId, courseId) => {
        const URL = `${API_URL.SUPABASE_MARK_LECTURE_COMPLETED.replace(':id', lectureId)}`;
        const data = {
            lectureId,
            courseId
        };

        try {
            await axiosWrapper('PUT', URL, data, token);
        } catch (error) {
            console.error("Failed to mark lecture as completed:", error);

        }

        let nextLecture;

        const currentLecture = lectures[activeIndex];
        const currentFolderId = currentLecture?.folder_id;

        if (currentFolderId) {
            nextLecture = lectures
                .slice(activeIndex + 1)
                .find(lecture => lecture.folder_id === currentFolderId && !lecture.lecture_progress?.[0]?.is_completed);
        }

        if (!nextLecture) {
            nextLecture = lectures
                .slice(activeIndex + 1)
                .find(lecture => !lecture.lecture_progress?.[0]?.is_completed);
        }

        if (!nextLecture && currentFolderId) {
            nextLecture = lectures
                .slice(0, activeIndex)
                .find(lecture => lecture.folder_id === currentFolderId && !lecture.lecture_progress?.[0]?.is_completed);
        }

        if (!nextLecture) {
            nextLecture = lectures
                .slice(0, activeIndex)
                .find(lecture => !lecture.lecture_progress?.[0]?.is_completed);
        }

        const targetLectureId = nextLecture?.id || currentLecture?.id;



        setSlugOnce(true);
        // getCourseById(currentCourseID, lectures[activeIndex]?.id);
        if (nextLecture) {
            const newIndex = lectures.findIndex(lec => lec.id === targetLectureId);
            setActiveIndex(newIndex);
            updateLectureUrl(newIndex);

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
    const [showDownloadModel, setShowDownloadModel] = useState({
        show: false,
        title: '',
        isEditable: false,
        lectureId: null,
        initialValues: null
    });
    const handleDownloadModelClick = (resource) => {
        setShowDownloadModel({
            show: true,
            title: resource?.name,
            file_link: resource?.file_link,
            isEditable: false,
            lectureId: resource?.id,
            initialValues: null
        });
    };
    const handleDownloadModelClose = () => {
        setShowDownloadModel({
            show: false,
            title: 'Delete Lecture',
            isEditable: false,
            lectureId: null,
            initialValues: null
        });
    };
    const handleDownloadImg = () => {
        const fileUrl = showDownloadModel?.file_link;
        if (fileUrl) {
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        } else {
            console.warn('No file URL available to open.');
        }
    };


    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="EnrolledCourseDetail">
                    {filteredLectures.length === 0 ? (
                        <>
                            {/* <div className="title-top">
                                <span onClick={() => navigate(`/${role}/courses-supabase`)} style={{ cursor: 'pointer' }}>
                                    Courses <img src={CaretRight} alt=">" />
                                </span>{' '}
                                {courseDetails.title}
                            </div> */}
                            <div className="top-box">
                                <div className="title-top">
                                    <div className="bread-home">
                                        <img src={BreadHome} alt="" onClick={() => navigate(`/${role}/courses-supabase`)}
                                            style={{ cursor: 'pointer' }} />
                                    </div>
                                    <img src={CaretRightt} alt=">" />
                                    {courseDetails.title} <img src={CaretRightt} alt=">" />
                                    No Lecture Found
                                </div>
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
                                    <div className="enroll-top">
                                        <div className="top-box">
                                            <div className="title-top">
                                                <div className="bread-home">
                                                    <img src={BreadHome} alt="" onClick={() => navigate(`/${role}/courses-supabase`)}
                                                        style={{ cursor: 'pointer' }} />
                                                </div>
                                                {/* <span
                                                                                          onClick={() => navigate(`/${role}/courses-supabase`)}
                                                                                          style={{ cursor: 'pointer' }}
                                                                                      >
                                                                                          Courses 
                                                                                      </span>{' '} */}
                                                <img src={CaretRightt} alt=">" />
                                                {courseDetails.title} <img src={CaretRightt} alt=">" />
                                                {lectures[activeIndex]?.name}
                                                {/* Lecture{' '}
                                                {activeIndex + 1} */}
                                            </div>
                                        </div>

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
                                                <Row className='mt-2'>
                                                    <div className='right-view-course-detail'>
                                                        <div className='search-lectures lec-left mb-1' style={{ height: 'auto' }}>
                                                            <div className="title-lecture-btns">
                                                                <h1>{courseDetails?.title}</h1>
                                                            </div>
                                                            <div className='progress-wrap'>
                                                                <CustomProgressBar progress={calculateCompletionPercentage().toFixed(2)} />
                                                            </div>
                                                        </div>

                                                    </div>

                                                </Row>
                                                <Row className="section-border">
                                                    <Col sm={12} md={12} lg={4} xl={3}>
                                                        {/* <div className='search-lectures lec-left mb-3' style={{ height: 'auto' }}>
                                                            <div className="title-lecture-btns">
                                                                <h1>{courseDetails?.title}</h1>
                                                            </div>
                                                            <div className='progress-wrap'>
                                                                <CustomProgressBar progress={calculateCompletionPercentage().toFixed(2)} />
                                                            </div>
                                                        </div> */}
                                                        <div className="search-lectures lec-left btm-box p-0">


                                                            <div className="lecture-btns">
                                                                {/* <EnrollFolderStructure
                                                        topics={topics}
                                                        unassignedLectures={unassignedLectures}
                                                        onLectureSelect={selectedLecture}
                                                    /> */}

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
                                                    <Col sm={12} md={12} lg={8} xl={9}>
                                                        <div className="lecture-right">
                                                            {lectureLoading ? (
                                                                <LectureCurriculumSkeleton />
                                                            ) : (<>
                                                                {!continueQuiz && selectedLecture && (
                                                                    <>

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
                                                                                {selectedLecture?.lecture_progress?.is_completed ? <img className='checkimg' src={checkicon} alt="Already completed"
                                                                                    data-tooltip-id="my-tooltip2" data-tooltip-place="top" style={{ cursor: 'pointer' }}
                                                                                    data-tooltip-content="Already completed" /> : <img className='checkimg'
                                                                                        onClick={() =>
                                                                                            markLectureAsCompleted(selectedLecture?.id)
                                                                                        } src={checkicon2} alt="Mark lecture as completed."
                                                                                        data-tooltip-id="my-tooltip2" style={{ cursor: 'pointer' }} data-tooltip-place="top" data-tooltip-content="Mark lecture as completed." />}

                                                                            </h2>

                                                                            <p
                                                                                className="mb-2"
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: decodeHtmlEntities(selectedLecture.description)
                                                                                }}
                                                                            ></p>
                                                                            {Array.isArray(selectedLecture.resources) && selectedLecture.resources.length > 0 && (
                                                                                <div className="modal-resources modal-description">
                                                                                    <div className="modal-resources-body">
                                                                                        <h5 className="fw-semibold mb-3">Resources</h5>
                                                                                        <div id="all_resources" className="d-flex flex-column gap-3">
                                                                                            {selectedLecture.resources.map((resource) => (
                                                                                                <div
                                                                                                    key={resource?.id}
                                                                                                    className="d-flex align-items-center gap-2 cursor-pointer"
                                                                                                    style={{ cursor: 'pointer' }}
                                                                                                    onClick={() => {
                                                                                                        if (resource.url) {
                                                                                                            window.open(resource.url, '_blank');
                                                                                                        } else if (resource.file_link) {
                                                                                                            // setSelectedResource(resource);
                                                                                                            handleDownloadModelClick(resource)
                                                                                                            // setShowModal(true);
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    <img
                                                                                                        src={resource.url ? linkImg : resourceImg}
                                                                                                        alt="Resource"
                                                                                                        className="img-fluid"
                                                                                                        style={{ width: '24px', height: '24px' }}
                                                                                                    />
                                                                                                    <div className="text-muted">{resource?.name}</div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {selectedLecture?.transcript && (
                                                                                <div className="modal-description">
                                                                                    <h5 className='fw-semibold my-3'>Transcript</h5>
                                                                                    <div
                                                                                        className="content"
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: decodeHtmlEntities(selectedLecture?.transcript) || ''
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </>
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
                                                <div className="viewProgress-footer mx-auto d-none">
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
                            {/* {selectedResource && (
                                <>
                                <div
                                    className={`custom-fullscreen-modal ${showModal ? 'show d-block' : ''}`}
                                    tabIndex="-1"
                                    role="dialog"
                                >
                                    <div className="custom-modal-overlay" onClick={handleCloseModal}></div>

                                    <div className="custom-modal-content">
                                        <img
                                            src={selectedResource.file_link}
                                            alt={selectedResource.name}
                                            className="custom-modal-image"
                                        />

                                        <div className="custom-modal-actions">
                                            <a href={selectedResource.file_link} download className="action-btn">
                                                ⬇️
                                            </a>
                                            <button onClick={handleCloseModal} className="action-btn">
                                                ❌
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </>
                            )} */}
                            {showDownloadModel.show && (
                                <ResourcesModel
                                    show={showDownloadModel.show}
                                    onClose={handleDownloadModelClose}
                                    // loading={loadingCRUD}
                                    title={showDownloadModel?.title}
                                    file_link={showDownloadModel?.file_link}
                                    body={
                                        <div className='img-resource-wrap'>
                                            <img className="img-resource" src={showDownloadModel?.file_link} alt="Resource Preview" />
                                        </div>
                                    }
                                    customFooterClass="custom-footer-class"
                                    nonActiveBtn="cancel-button"
                                    activeBtn="delete-button"
                                    activeBtnTitle="Delete"
                                    onConfirm={handleDownloadImg}
                                />
                            )}


                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default EnrolledCourseDetail;