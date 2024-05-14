import { useState } from 'react';
import { Row, Col, InputGroup, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import Card from '@components/Card/Card';
import CourseCard from '../../../components/CourseCard/CourseCard';
import eventImg from '../../../assets/images/Event-Image.svg';
import '../../../styles/Courses.scss';
import Search from '../../../assets/icons/Search.svg';
import add from '@icons/add.svg';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Courses = () => {
    const [search, setSearch] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('All courses');
    const [yourCourses, setYourCourses] = useState(false);
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const role = userInfo.role;
    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    const courseCards = [
        {
            id: 1,
            title: 'Design Conference',
            detail: 'Coach: David Everson',
            lectureNo: 'Lectures: 28',
            img: eventImg
        },
        {
            id: 2,
            title: 'Design Conference',
            detail: 'Coach: David Everson',
            lectureNo: 'Lectures: 28',
            img: eventImg
        },
        {
            id: 3,
            title: 'Structured Query',
            detail: 'Dropship Academy X',
            lectureNo: 'Lectures: 28',
            img: eventImg
        },
        {
            id: 4,
            title: 'Advance programing',
            detail: 'Dropship Academy X',
            lectureNo: 'Lectures: 28',

            img: eventImg
        },
        {
            id: 5,
            title: 'Blogs creation',
            detail: 'Dropship Academy X',
            lectureNo: 'Lectures: 28',
            img: eventImg
        },
        {
            id: 6,
            title: 'Web Design',
            detail: 'Dropship Academy X',
            lectureNo: 'Lectures: 28',
            img: eventImg
        },
        {
            id: 7,
            title: 'Web Design',
            detail: 'Dropship Academy X',
            lectureNo: 'Lectures: 28',
            img: eventImg
        },
        {
            id: 8,
            title: 'Web Design',
            detail: 'Dropship Academy X',
            lectureNo: 'Lectures: 28',
            img: eventImg
        }
    ];

    const handleCreateClick = () => {
        if (role === 'admin') {
            navigate('/admin/courses/new');
        } else {
            // Handle create button click event here
            navigate('/coach/courses/new');
        }
    };
    const handleEventSelect = (eventKey, course) => {
        setSelectedEvent(course);
        if (course === 'Your Courses') {
            setYourCourses(true);
        } else {
            setYourCourses(false);
        }
    };

    return (
        <>
            <div className="cousre-section">
                <div className="custom-card-course">
                    <Card cardType="large">
                        <Row>
                            <div className="course-topbar">
                                <Col xs={12} sm={12} md={6}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <img src={Search} alt={search ? 'Search' : 'Search'} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            className="search-input"
                                            type="text"
                                            name="Search"
                                            label="Search"
                                            onChange={onFilterTextChange}
                                            placeholder="Search"
                                        />
                                    </InputGroup>
                                </Col>
                                <Col xs={12} sm={12} md={6}>
                                    {role === 'student' ? (
                                        <div className="ms-auto d-flex justify-content-end ">
                                            <DropdownButton
                                                title={
                                                    <div className=" d-flex  justify-content-between align-items-center">
                                                        <span className="ms-2">{selectedEvent}</span>
                                                    </div>
                                                }
                                                defaultValue={selectedEvent}
                                                className="dropdown-button coach-btn w-100"
                                            >
                                                {['All Courses', 'Your Courses'].map((event) => (
                                                    <Dropdown.Item
                                                        onClick={(e) => handleEventSelect(e, event)}
                                                        key={event}
                                                        eventKey={event}
                                                        className="my-1 ms-2 w-100"
                                                    >
                                                        <span className="coach-name"> {event}</span>
                                                    </Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </div>
                                    ) : (
                                        <Button
                                            className="add-button ms-md-auto d-flex justify-content-even align-items-center"
                                            onClick={handleCreateClick}
                                        >
                                            <img src={add} alt="" /> <span className="ms-2">Add New Courses</span>
                                        </Button>
                                    )}
                                </Col>
                            </div>
                        </Row>

                        <Row>
                            {courseCards.map((cousre) => (
                                <Col key={cousre.id} xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                                    <div className="custom-card-course-new">
                                        {role === 'admin' || role === 'coach' ? (
                                            <Link to={`/${role}/courses/all-students`}>
                                                <CourseCard {...cousre} archive={true} />
                                            </Link>
                                        ) : (
                                            <CourseCard
                                                {...cousre}
                                                archive={false}
                                                enroll={yourCourses ? true : false}
                                            />
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Courses;
