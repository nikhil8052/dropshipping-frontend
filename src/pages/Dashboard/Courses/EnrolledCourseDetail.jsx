import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CaretRight from '@icons/CaretRight.svg';
import { InputGroup, Button, Form, Col, Row } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import InactiveIcon from '../../../assets/icons/Icon-inactive-lec.svg';
import { Form as FormikForm, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import '../../../styles/Courses.scss';
import PdfModal from '../../../components/PdfRenderer/PdfViewer';
import toast from 'react-hot-toast';

const EnrolledCourseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const courseId = location.state?.courseId;
    const role = userInfo?.role.toLowerCase();

    const [search, setSearch] = useState('');
    const [lectures, setLectures] = useState([]);
    const [filteredLectures, setFilteredLectures] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [continueQuiz, setContinueQuiz] = useState(false);
    const [courseDetails, setCourseDetails] = useState({});
    const [retryQuiz, setRetryQuiz] = useState(false);

    const [initialValues, setInitialValues] = useState({
        questions: [],
        mcqs: []
    });

    const validationSchema = Yup.object().shape({
        questions: Yup.array()
            .of(
                Yup.object().shape({
                    questionId: Yup.string()
                        .matches(/^[0-9a-fA-F]{24}$/, 'Invalid question ID')
                        .required('Question ID is required'),
                    answer: Yup.string().required('Answer is required')
                })
            )
            .required('Questions are required'),
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

    const getCourseById = async (id) => {
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
        // Current Lecture
        setSelectedLecture(data.lectures[0]);

        const questions = data.lectures[0].quiz?.questions;
        const mcqs = data.lectures[0].quiz?.mcqs;

        const initialValues = {
            questions: questions?.map((question) => ({
                questionId: question._id,
                answer: '',
                question: question.question
            })),
            mcqs: mcqs?.map((mcq) => ({
                questionId: mcq._id,
                answer: '',
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

    const handleButtonClick = (index) => {
        if (index > 0 && !lectures[index - 1].completedBy.includes(userInfo._id)) {
            toast.error('Complete the previous lecture and quiz before proceeding.');
            return;
        }
        setActiveIndex(index);
        setSelectedLecture(lectures[index]);

        // set values on each tab change
        const questions = lectures[index].quiz?.questions;
        const mcqs = lectures[index].quiz?.mcqs;

        const initialValues = {
            questions: questions?.map((question) => ({
                questionId: question._id,
                answer: '',
                question: question.question
            })),
            mcqs: mcqs?.map((mcq) => ({
                questionId: mcq._id,
                answer: '',
                question: mcq.question,
                options: mcq.options
            }))
        };
        setInitialValues(initialValues);
        setContinueQuiz(false);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const answers = {
                questions: values.questions.map((question) => ({
                    questionId: question.questionId,
                    answer: question.answer
                })),
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
                handleButtonClick(activeIndex + 1);
                setRetryQuiz(false);
            } else {
                // Handle retry logic
                setRetryQuiz(true);
            }

            getCourseById(courseId); // Refresh course data
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
                                                className={`btn ${index === activeIndex ? 'active' : 'inactive'}`}
                                                onClick={() => handleButtonClick(index)}
                                                disabled={
                                                    index > 0 && !lectures[index - 1].completedBy.includes(userInfo._id)
                                                }
                                            >
                                                <img src={InactiveIcon} alt="IconLect" />
                                                <p>{lecture.name}</p>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                            <Col sm={8} md={8} lg={8} xl={9}>
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
                                        <h1 className="title">Quiz {selectedLecture.name}:</h1>
                                        {values?.questions.length > 0 && (
                                            <>
                                                <p className="title fw-bold">
                                                    Please Answer these questions for personal assessments of this
                                                    course. ({values?.questions.length}/{values?.questions.length}) :
                                                </p>
                                                {values?.questions.map((question, index) => (
                                                    <div className="add-quiz-question" key={index}>
                                                        <div className="questions">
                                                            <div className="question">
                                                                <p>
                                                                    Q 0{index + 1}: {question.question}
                                                                </p>
                                                            </div>

                                                            <Field
                                                                name={`questions[${index}].answer`}
                                                                placeholder="Please type answer here..."
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                            <ErrorMessage
                                                                name={`questions[${index}].answer`}
                                                                component="div"
                                                                className="error"
                                                            />

                                                            <Field
                                                                type="hidden"
                                                                name={`questions[${index}].questionId`}
                                                                value={question._id}
                                                            />
                                                            <p className="limit">0/120</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {values?.mcqs.length > 0 && (
                                            <>
                                                <p className="title mb-0 mt-2 fw-bold">
                                                    Multiple Choice Questions ({values?.mcqs.length}/
                                                    {values?.mcqs.length}) :
                                                </p>
                                                {values?.mcqs.map((mcq, index) => (
                                                    <div className="add-quiz-question" key={index}>
                                                        <div className="questions">
                                                            <Form>
                                                                <Form.Label>{`Q 0${index + 1}: ${mcq.question}`}</Form.Label>
                                                                <div className="d-flex flex-wrap">
                                                                    {mcq.options.map((option, idx) => (
                                                                        <div
                                                                            key={`inline-radio-${index}-${idx}`}
                                                                            className="d-selectedLecture.quiz
                                                                            selectedLecture.quiz
                                                                            selectedLecture.quiz
                                                                            selectedLecture.quizflex"
                                                                        >
                                                                            <Form.Check
                                                                                name={`mcqs[${index}].answer`}
                                                                                inline
                                                                                label={option}
                                                                                onChange={(e) => {
                                                                                    // Set field value in the formik
                                                                                    setFieldValue(
                                                                                        `mcqs[${index}].answer`,
                                                                                        e.target.value
                                                                                    );
                                                                                }}
                                                                                type="radio"
                                                                                id={`inline-radio-${index}-${idx}`}
                                                                                value={option}
                                                                            />
                                                                            {/* if No option selected then the answer is required */}
                                                                            <ErrorMessage
                                                                                name={`mcqs[${index}].answer`}
                                                                                component="div"
                                                                                className="error"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </Form>
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
                                <Button className="done-btn" type="submit" disabled={isSubmitting}>
                                    {retryQuiz ? 'Retry Quiz' : 'Submit Quiz'}
                                </Button>
                            ) : (
                                <Button className="done-btn" type="button" onClick={continueHandler}>
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
