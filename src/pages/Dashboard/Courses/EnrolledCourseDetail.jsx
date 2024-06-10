import { useEffect, useState } from 'react';
import '../../../styles/Courses.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CaretRight from '@icons/CaretRight.svg';
import { InputGroup, Button, Form, Col, Row } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import InactiveIcon from '../../../assets/icons/Icon-inactive-lec.svg';
import Input from '@components/Input/Input';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import { lectures } from '../../../data/data';

const EnrolledCourseDetail = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const role = userInfo?.role;
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filteredLectures, setFilteredLectures] = useState([]);

    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedLecture, setSelectedLecture] = useState(lectures[0]);

    const [continueQuiz, setContinueQuiz] = useState(false);
    const handleButtonClick = (index) => {
        setActiveIndex(index);
        setSelectedLecture(lectures[index]);
        setContinueQuiz(false);
    };
    const continueHandler = () => {
        setContinueQuiz(true);
    };

    const initialValues = {
        title: ''
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        setFilteredLectures(lectures);
    }, []);

    useEffect(() => {
        const handleSearch = setTimeout(() => {
            const filtered = lectures.filter((lecture) => {
                const searchCriteria = lecture.lectureName.toLowerCase() || lecture.lectureDescription.toLowerCase();
                return searchCriteria.includes(search.toLowerCase());
            });
            setFilteredLectures(filtered);
        }, 300);

        return () => {
            clearTimeout(handleSearch);
        };
    }, [search]);

    return (
        <>
            <div className="EnrolledCourseDetail">
                <div className="title-top">
                    <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                        Courses <img src={CaretRight} alt=">" />
                    </span>{' '}
                    Enrolled Course Details
                </div>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <FormikForm>
                            <div className="card-background">
                                <div className="text-heading">
                                    <h1>Design Conference</h1>
                                    <div className="viewProfile-img">
                                        <p>Dropship Academy X</p>
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
                                            <h1> All Lectures</h1>
                                        </div>

                                        <div>
                                            <div className="lecture-btns">
                                                {filteredLectures.map((lecture, index) => (
                                                    <Button
                                                        type="button"
                                                        key={index}
                                                        className={`btn ${index === activeIndex ? 'active' : 'inactive'}`}
                                                        onClick={() => handleButtonClick(index)}
                                                    >
                                                        <img src={InactiveIcon} alt="IconLect" />
                                                        <p>Lecture No. {lecture.id}</p>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={8} md={8} lg={8} xl={9}>
                                    {!continueQuiz &&
                                        selectedLecture &&
                                        (selectedLecture.lectureType === 'video' ? (
                                            <div className="lecture-curriculum">
                                                <h2 className="title">Lecture No. {selectedLecture.id}:</h2>
                                                <div className="video">
                                                    <iframe
                                                        src={selectedLecture.file}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="video-iframe w-100"
                                                    ></iframe>
                                                </div>
                                            </div>
                                        ) : (
                                            // Render the pdf file here
                                            <div className="lecture-curriculum">
                                                <h2 className="title">Lecture No. {selectedLecture.id}:</h2>
                                                <h1 className="description">{selectedLecture.lectureDescription}</h1>
                                                <p className="text-justify text-wrap">
                                                    {selectedLecture.lectureContent}
                                                </p>
                                            </div>
                                        ))}

                                    {continueQuiz && (
                                        <div className="quiz-curriculum">
                                            <h1 className="title">Quiz No {selectedLecture.id}:</h1>
                                            {selectedLecture.questions.length > 0 && (
                                                <>
                                                    <p className="title fw-bold">
                                                        Please Answer these questions for personal assessments of this
                                                        course. ({selectedLecture?.questions.length}/
                                                        {selectedLecture?.questions.length}) :
                                                    </p>
                                                    {selectedLecture?.questions.map(({ question, answer }, index) => (
                                                        <div className="add-quiz-question" key={index}>
                                                            <div className="questions">
                                                                <div className="question">
                                                                    <p>
                                                                        Q 0{index + 1}: {question}
                                                                    </p>
                                                                </div>

                                                                <>
                                                                    <Input
                                                                        name={`lecturename_optional_${index}`}
                                                                        placeholder="Please type answer here..."
                                                                        type="text"
                                                                        value={answer}
                                                                    />
                                                                    <p className="limit">0/120</p>
                                                                </>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            )}

                                            {selectedLecture.optionalQuestions.length > 0 && (
                                                <>
                                                    <p className="title mb-0 mt-2 fw-bold">
                                                        Multiple Choice Questions (
                                                        {selectedLecture?.optionalQuestions.length}/
                                                        {selectedLecture?.optionalQuestions.length}) :
                                                    </p>
                                                    {selectedLecture?.optionalQuestions.map((multipleChoice, index) => (
                                                        <div className="add-quiz-question" key={index}>
                                                            <div className="questions">
                                                                <Form>
                                                                    <Form.Label>{`Q 0${index + 1}: ${multipleChoice.question}`}</Form.Label>
                                                                    <div className="d-flex flex-wrap">
                                                                        {[
                                                                            'option1',
                                                                            'option2',
                                                                            'option3',
                                                                            'option4'
                                                                        ].map((option, idx) => (
                                                                            <div
                                                                                key={`inline-radio-${index}-${idx}`}
                                                                                className="d-flex"
                                                                            >
                                                                                <Form.Check
                                                                                    inline
                                                                                    label={multipleChoice[option]}
                                                                                    name={`option-${index}`}
                                                                                    type="radio"
                                                                                    id={`inline-radio-${index}-${idx}`}
                                                                                    value={multipleChoice[option]}
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
                                <Button
                                    className="done-btn"
                                    type="button"
                                    onClick={continueHandler}
                                    disabled={isSubmitting}
                                >
                                    {continueQuiz ? 'Done' : 'Continue To Quiz'}
                                </Button>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default EnrolledCourseDetail;
