import { useState } from 'react';
import '../../../styles/Courses.scss';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import viewProfile from '../../../assets/images/Ellipse 5.svg';
import { InputGroup, Button, Form, Col, Row } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import InactiveIcon from '../../../assets/icons/Icon-inactive-lec.svg';
import { lectures } from '../../../data/data';

const ViewProgress = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const [search, setSearch] = useState('');
    const role = userInfo?.role;
    const navigate = useNavigate();
    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div className="view-progress-section">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                    Courses <img src={CaretRight} alt=">" />
                </span>{' '}
                <span onClick={() => navigate(`/${role}/courses/details`)} style={{ cursor: 'pointer' }}>
                    Course Details <img src={CaretRight} alt=">" />{' '}
                </span>
                <span onClick={() => navigate(`/${role}/courses/all-students`)} style={{ cursor: 'pointer' }}>
                    All Students <img src={CaretRight} alt=">" />{' '}
                </span>
                View Progress
            </div>

            <div className="card-background">
                <div className="text-heading">
                    <h1>Design Conference</h1>
                    <div className="viewProfile-img">
                        <img src={viewProfile} alt="" />
                        <p>Dropship Academy X</p>
                    </div>
                </div>
            </div>
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
                    <h1>
                        {' '}
                        All Lectures: <span> (Note: Green labeled lectures are passed by student)</span>{' '}
                    </h1>
                </div>

                <div className="lecture-btns">
                    <Row className="g-3 flex-wrap">
                        {lectures.map((lecture, index) => (
                            <Col xs={12} sm={5} md={4} lg={4} xl={3} xxl={2} key={index}>
                                <Button type="button" className={'btn inactive'}>
                                    <img src={InactiveIcon} alt="IconLect" />
                                    <p>Lecture No. {lecture.id}</p>
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className="viewProgress-footer mx-auto">
                    <Link to={`/${role}/courses`}>
                        <Button className="done-btn" type="button">
                            Done
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ViewProgress;
