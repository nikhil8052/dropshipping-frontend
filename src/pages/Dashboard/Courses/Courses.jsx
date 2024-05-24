import { useState } from 'react';
import { Row, Col, InputGroup, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import CourseCard from '../../../components/CourseCard/CourseCard';
import eventImg from '../../../assets/images/Event-Image.svg';
import Search from '../../../assets/icons/Search.svg';
import add from '@icons/add_white.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Courses = () => {
    const [search, setSearch] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('Your Courses');
    const [yourCourses, setYourCourses] = useState(false);
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const role = userInfo?.role;
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
            setYourCourses(false);
        } else {
            setYourCourses(true);
        }
    };

    return (
        <>
            <div className="course-section">
                <Row>
                    <div className="course-topbar">
                        <Col lg={4} md={12} xs={12} sm={12}>
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
                        <Col md={6} xs={12} sm={12}>
                            {role === 'student' ? (
                                <div className="ms-auto  d-flex justify-content-end ">
                                    <DropdownButton
                                        title={
                                            <div className=" d-flex   justify-content-between align-items-center">
                                                <span className="ms-2">{selectedEvent}</span>
                                            </div>
                                        }
                                        defaultValue={selectedEvent}
                                        className="dropdown-button-fix"
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
                                    className="add-button ms-sm-auto d-flex  justify-content-even  align-items-center"
                                    onClick={handleCreateClick}
                                >
                                    <img src={add} alt="" /> <span className="ms-2">Add New Courses</span>
                                </Button>
                            )}
                        </Col>
                    </div>
                </Row>
                <div className="custom-card-course">
                    <Row>
                        {courseCards.map((cousre) => (
                            <Col key={cousre.id} xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                                <div className="custom-card-course-new">
                                    {role === 'admin' || role === 'coach' ? (
                                        <CourseCard {...cousre} archive={true} role={role} />
                                    ) : (
                                        <CourseCard
                                            {...cousre}
                                            archive={false}
                                            enroll={yourCourses ? false : true}
                                            role={role}
                                        />
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </>
    );
};

export default Courses;
