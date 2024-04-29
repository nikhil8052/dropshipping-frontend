import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@components/Card/Card';
import CourseCard from '../../../components/CourseCard/CourseCard';
import eventImg from '../../../assets/images/Event-Image.svg';
import '../../../styles/Courses.scss';
import { InputGroup, Button, Form } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import add from '@icons/add.svg';
import PublishCourses from './PublishCourses';
import AddNewCourse from './AddNewCourse';
import UploadFiles from './UploadFiles';
import ClipboardText from '@icons/ClipboardText.svg';
import Stack from '@icons/Stack.svg';
import task_alt from '@icons/task_alt.svg';

const Courses = () => {
    const [search, setSearch] = useState('');
    const [newStudent, setNewStudent] = useState(false);

    const [selectedTab, setSelectedTab] = useState(1);

    // Function to handle tab selection
    const handleTabClick = (tabId) => {
        setSelectedTab(tabId);
    };

    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };
    const courseCards = [
        {
            id: 1,
            title: 'Total budget',
            detail: '7500$',
            lectureNo: '1',
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
            title: 'Valued products',
            detail: '750',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 4,
            title: 'active users',
            detail: '1.5K',
            lectureNo: '1',

            img: eventImg
        },
        {
            id: 5,
            title: 'Total budget',
            detail: '7500$',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 6,
            title: 'Expenses',
            detail: '1500$',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 7,
            title: 'Valued products',
            detail: '750',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 8,
            title: 'active users',
            detail: '1.5K',
            lectureNo: '1',

            img: eventImg
        }
    ];

    const handleCreateClick = () => {
        // Handle create button click event here
        setNewStudent(true);
    };

    // Function to render content based on the selected tab
    const renderTabContent = () => {
        switch (selectedTab) {
            case 1:
                return <AddNewCourse />;
            case 2:
                return <UploadFiles />;
            case 3:
                return <PublishCourses />;
            default:
                return null;
        }
    };

    return (
        <>
            {newStudent ? (
                <div className="addcourse-section">
                    <div className="addcourse-nav">
                        <p>
                            Courses<span> </span> Add New Courses
                        </p>
                    </div>
                    <Row>
                        <div className="course-tabs">
                            <div
                                className={`tab ${selectedTab === 1 ? 'active' : ''} `}
                                onClick={() => handleTabClick(1)}
                            >
                                <img src={Stack} alt="course-icon" />
                                Basic Information
                            </div>
                            <div
                                className={`tab ${selectedTab === 2 ? 'active' : ''}`}
                                onClick={() => handleTabClick(2)}
                            >
                                <img src={ClipboardText} alt="course-icon" />
                                Upload Files
                            </div>
                            <div
                                className={`tab ${selectedTab === 3 ? 'active' : ''}`}
                                onClick={() => handleTabClick(3)}
                            >
                                <img src={task_alt} alt="course-icon" />
                                Publish Course
                            </div>
                        </div>
                        <div className="tab-content">{renderTabContent()}</div>
                    </Row>
                </div>
            ) : (
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
                                            <img src={add} alt="" srcset="" />{' '}
                                            <span className="ms-2">Add New Course</span>
                                        </Button>
                                    </Col>
                                </div>
                            </Row>

                            <Row>
                                {courseCards.map((cousre) => (
                                    <Col key={cousre.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                        <div className="custom-card-course">
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
            )}
        </>
    );
};

export default Courses;
