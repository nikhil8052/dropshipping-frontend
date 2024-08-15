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

const EnrolledCourseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const courseId = location.state?.courseId;
    const role = userInfo?.role?.toLowerCase();

    const [search, setSearch] = useState('');
    const [lectures, setLectures] = useState([]);
    const [filteredLectures, setFilteredLectures] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [continueQuiz, setContinueQuiz] = useState(false);
    const [courseDetails, setCourseDetails] = useState({});
    const [retryQuiz, setRetryQuiz] = useState(false);

    const [initialValues, setInitialValues] = useState({
        mcqs: []
    });

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
        const { data } = await axiosWrapper('GET', `${API_URL.GET_COURSE.replace(':id', id)}`, {}, token);

        // Higher Level info
        setCourseDetails({
            title: data.title,
            moduleManager: data.moduleManager?.name
        });
        // Overall lectures
        setLectures(data.lectures);

        // Handle search results
        setFilteredLectures(data.lectures);
        const incompleteLectureIndex = data.lectures.find((lec) => !lec.completedBy?.includes(userInfo?._id));
        // Get the first lecture
        if (nextLecture && activeIndex <= data?.lectures?.length - 1) {
            getCurrentLecture(nextLecture);
        } else if (incompleteLectureIndex?._id !== undefined) {
            getCurrentLecture(incompleteLectureIndex?._id);
        } else {
            getCurrentLecture(data.lectures[0]?._id);
        }
    };

    const getCurrentLecture = async (id) => {
        const { data } = await axiosWrapper('GET', `${API_URL.GET_LECTURE.replace(':id', id)}`, {}, token);

        setSelectedLecture(data);

        const mcqs = data.quiz?.mcqs;

        const initialValues = {
            mcqs: mcqs?.map((mcq) => ({
                questionId: mcq._id,
                answer: mcq.answer || '',
                question: mcq.question,
                options: mcq.options
            }))
        };
        setInitialValues(initialValues);
    };

    useEffect(() => {
        if (courseId) {
            getCourseById(courseId);
        }
    }, [courseId]);

    useEffect(() => {
        if (search) {
            const filtered = lectures.filter((lecture) => {
                const searchCriteria = lecture.name.toLowerCase() || lecture.description.toLowerCase();
                return searchCriteria.includes(search.toLowerCase());
            });
            setFilteredLectures(filtered);
        } else {
            setFilteredLectures(lectures);
        }
    }, [search, lectures]);

    const handleButtonClick = (index, fetchLecture = true) => {
        setActiveIndex(index);
        if (fetchLecture) getCurrentLecture(lectures[index]?._id);
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
                `${API_URL.PERFORM_QUIZ.replace(':id', selectedLecture._id)}`,
                answers,
                token
            );
            if (data.pass) {
                // Proceed to next lecture if pass
                handleButtonClick(activeIndex + 1, false);
                getCourseById(courseId, lectures[activeIndex + 1]?._id); // Refresh course data
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

    return (
        <div className="EnrolledCourseDetail">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                    Courses <img src={CaretRight} alt=">" />
                </span>{' '}
                Enrolled Course Details <img src={CaretRight} alt=">" /> Lecture {activeIndex + 1}
            </div>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <FormikForm>
                        <div className="card-background">
                            <div className="text-heading">
                                <h1>{courseDetails?.title || 'Course Title'}</h1>
                                <div className="viewProfile-img">
                                    <p>{courseDetails?.moduleManager || 'Module Manager'}</p>
                                </div>
                            </div>
                        </div>
                        <Row className="section-border">
                            <Col sm={3} md={4} lg={4} xl={3}>
                                <div className="search-lectures">
                                    <InputGroup>
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
                                    </InputGroup>
                                    <div className="title-lecture-btns">
                                        <h1>All Lectures</h1>
                                    </div>

                                    <div className="lecture-btns">
                                        {filteredLectures.map((lecture, index) => (
                                            <Button
                                                type="button"
                                                key={index}
                                                className={`btn ${lecture?._id === selectedLecture?._id ? 'active' : 'inactive'} ${lecture?.completedBy?.includes(userInfo?._id) && 'passed-lecture'}`}
                                                onClick={() => handleButtonClick(index)}
                                                disabled={
                                                    index > 0 &&
                                                    !filteredLectures[index - 1]?.completedBy?.includes(userInfo?._id)
                                                }
                                            >
                                                <img
                                                    src={
                                                        lecture?.completedBy?.includes(userInfo?._id)
                                                            ? ActiveIcon
                                                            : InactiveIcon
                                                    }
                                                    alt="IconLect"
                                                />
                                                <p>{lecture.name}</p>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                            <Col sm={8} md={8} lg={8} xl={9} className="lecture-right">
                                {!continueQuiz && selectedLecture && (
                                    <div className="lecture-curriculum">
                                        <h2 className="title">{selectedLecture.name}</h2>
                                        {selectedLecture.file ? (
                                            <div className="video">
                                                <div className="pdf-viewer">
                                                    <PdfModal file={selectedLecture.file} />
                                                </div>
                                            </div>
                                        ) : selectedLecture.vimeoVideoData ? (
                                            <div className="video">
                                                <iframe
                                                    src={selectedLecture.vimeoVideoData.player_embed_url}
                                                    title="Vimeo video player"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="video-iframe w-100"
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="lecture-curriculum">
                                                <h2 className="title">{selectedLecture.name}</h2>
                                                <p className="text-justify text-wrap">{selectedLecture.description}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {continueQuiz && selectedLecture && (
                                    <div className="quiz-curriculum">
                                        {/* <h1 className="text-end">
                                            Status:{' '}
                                            {!isPass ? <span className="text-danger"> Fail</span> : <span> Pass</span>}
                                        </h1> */}
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
                                                                {shuffleArray(mcq.options).map((option, idx) => (
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
                            </Col>
                        </Row>
                        <div className="viewProgress-footer mx-auto">
                            {continueQuiz ? (
                                <Button
                                    className="done-btn"
                                    type="submit"
                                    disabled={isSubmitting || selectedLecture?.completedBy?.includes(userInfo?._id)}
                                >
                                    {retryQuiz ? 'Retry Quiz' : 'Submit Quiz'}
                                </Button>
                            ) : (
                                <Button
                                    className="done-btn"
                                    type="button"
                                    onClick={continueHandler}
                                    disabled={isSubmitting || selectedLecture?.completedBy?.includes(userInfo?._id)}
                                >
                                    Continue To Quiz
                                </Button>
                            )}
                        </div>
                    </FormikForm>
                )}
            </Formik>
        </div>
    );
};

export default EnrolledCourseDetail;
