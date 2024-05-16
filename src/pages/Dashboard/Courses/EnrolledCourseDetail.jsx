import { useState } from 'react';
import '../../../styles/Courses.scss';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CaretRight from '@icons/CaretRight.svg';
import { InputGroup, Button, Form, Col, Row, Spinner } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import ActiveIcon from '../../../assets/icons/IconLect.svg';
import InactiveIcon from '../../../assets/icons/Icon-inactive-lec.svg';
import Card from '@components/Card/Card';
import Input from '@components/Input/Input';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import { lessons, quizzesData } from '../../../data/data';

const EnrolledCourseDetail = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const { role } = userInfo;
    const location = useLocation();
    const isenrolledCourse = location.pathname === `/${role}/courses/enrolled-course`;
    const [search, setSearch] = useState('');
    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    // Create state to manage the active state of each button
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedLesson, setSelectedLesson] = useState(lessons[1]);
    const [selectedQuiz, setSelectedQuiz] = useState(quizzesData[1]);

    const [continueQuiz, setContinueQuiz] = useState('');
    const handleButtonClick = (index) => {
        // Set the clicked button to active
        setActiveIndex(index);
        // Add the lesson object with its lecture ID
        setSelectedLesson(lessons[index]);
        //
        setSelectedQuiz(quizzesData[index]);
    };
    const continueHandler = () => {
        setContinueQuiz(true);
        setSelectedLesson(lessons[null]);
    };

    const initialValues = {
        title: ''
    };

    const validationSchema = Yup.object().shape({
        title: ''
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="EnrolledCourseDetail">
                <div className="addcourse-nav mb-3">
                    <Link to={`/${role}/courses`}> Courses</Link>
                    {isenrolledCourse && (
                        <span>
                            <img src={CaretRight} alt=">" /> Enrolled Course Details
                        </span>
                    )}
                </div>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <FormikForm>
                            <Card cardType="large">
                                <div className="card-background">
                                    <div className="text-heading">
                                        <h1>Design Conference</h1>
                                        <div className="viewProfile-img">
                                            {/* <img src={viewProfile} alt="" /> */}
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
                                                    {lessons.map((lesson, index) => (
                                                        <Button
                                                            type="button"
                                                            key={index}
                                                            className={`btn ${index === activeIndex ? 'active' : 'inactive'}`}
                                                            onClick={() => handleButtonClick(index)}
                                                        >
                                                            <img
                                                                src={index === activeIndex ? ActiveIcon : InactiveIcon}
                                                                alt="IconLect"
                                                            />
                                                            <p>Lecture No. {lesson.lectureNo}</p>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={8} md={8} lg={8} xl={9}>
                                        {selectedLesson ? (
                                            <div className="lecture-curriculum">
                                                <h2 className="title">{selectedLesson?.title}</h2>
                                                {selectedLesson?.video ? (
                                                    <>
                                                        <h1 className="description">{selectedLesson?.description}</h1>
                                                        <div className="video">
                                                            <div className="outline">
                                                                <p className="outline-heading"> Outline :</p>
                                                                {selectedLesson?.outlines.map((outlines, index) => (
                                                                    <li key={index}>{outlines}</li>
                                                                ))}
                                                                <p className="outline-detail">
                                                                    {selectedLesson?.detail}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <iframe
                                                            src="https://www.youtube.com/embed/rqGNDT_utao"
                                                            title="YouTube video player"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            className="video-iframe w-100"
                                                            height={400}
                                                        ></iframe>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {continueQuiz && (
                                                    <div className="quiz-curriculum">
                                                        <h1 className="title">{selectedQuiz?.title} :</h1>
                                                        <h2 className="description">
                                                            {selectedQuiz?.description} ({' '}
                                                            {selectedQuiz?.questions.length}/
                                                            {selectedQuiz?.questions.length} )
                                                        </h2>
                                                        {selectedQuiz?.questions.map((ques, index) => (
                                                            <div className="add-quiz-question" key={index}>
                                                                <div className="questions">
                                                                    <div className="question">
                                                                        <p>{ques?.questionText}</p>
                                                                    </div>
                                                                    {index < 2 ? (
                                                                        <>
                                                                            <Input
                                                                                name={`lecturename_optional_${index}`}
                                                                                placeholder="Please Type Question Here..."
                                                                                type="text"
                                                                            />
                                                                            <p className="limit">0/120</p>
                                                                        </>
                                                                    ) : (
                                                                        <Form>
                                                                            <div key={`inline-radio-${index} d-flex `}>
                                                                                {[1, 2, 3, 4].map((option, key) => (
                                                                                    <Form.Check
                                                                                        key={`inline-radio-${index}-${option}`}
                                                                                        inline
                                                                                        label={`Option ${key}`}
                                                                                        name={`option_${index}`}
                                                                                        type={'radio'}
                                                                                        id={`inline-radio-${index}-${option}`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        </Form>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </Col>
                                </Row>
                                <div className="viewProgress-footer mx-auto">
                                    <Link to={`/${role}/courses`}>
                                        <Button className="skip-btn" type="button">
                                            {isSubmitting ? <Spinner animation="border" size="sm" /> : ' Skip'}
                                        </Button>
                                    </Link>
                                    <Button className="done-btn" type="button" onClick={continueHandler}>
                                        Continue To Quiz
                                    </Button>
                                </div>
                            </Card>
                        </FormikForm>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default EnrolledCourseDetail;
