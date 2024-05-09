import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@components/Card/Card';
import CourseCard from '../../../components/CourseCard/CourseCard';
import eventImg from '../../../assets/images/Event-Image.svg';
import '../../../styles/Courses.scss';
import { InputGroup, Button, Form } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import add from '@icons/add.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Courses = () => {
    const [search, setSearch] = useState('');
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
                                            <img src={Search} alt="Search" />
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
                                    <Button
                                        className="add-button ms-md-auto d-flex justify-content-even align-items-center"
                                        onClick={handleCreateClick}
                                    >
                                        <img src={add} alt="" /> <span className="ms-2">Add New Course</span>
                                    </Button>
                                </Col>
                            </div>
                        </Row>

                        <Row>
                            {courseCards.map((cousre) => (
                                <Col key={cousre.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                    <div className="custom-card-course-new">
                                        <Card cardType="small">
                                            <CourseCard {...cousre} />
                                        </Card>
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
