import { useEffect, useState } from 'react';
import '../../../styles/Courses.scss';
import Card from '@components/Card/Card';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import viewProfile from '../../../assets/images/Ellipse 5.svg';
import { InputGroup, Button, Form } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import ActiveIcon from '../../../assets/icons/IconLect.svg';
import InactiveIcon from '../../../assets/icons/Icon-inactive-lec.svg';
import { Col, Row } from 'react-bootstrap';

const ViewProgress = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCoach, setIsCoach] = useState(false);
    const [search, setSearch] = useState('');

    const location = useLocation();
    const isViewlPage = location.pathname === '/coach/courses/view-progress';

    useEffect(() => {
        if (userInfo) {
            const { role } = userInfo;
            setIsAdmin(role === 'admin');
            setIsCoach(role === 'coach');
        }
    }, [userInfo]);
    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    // Create dummy object data with lecture numbers up to 40
    const lectureData = Array.from({ length: 40 }, (_, index) => ({
        lectureNo: index + 1,
        isActive: index < 20,
        icon: index < 20 ? ActiveIcon : InactiveIcon // Use activeIcon for active buttons and inactiveIcon for inactive buttons
    }));

    return (
        <div className="view-progress-section">
            <div className="addcourse-nav mb-3">
                {isAdmin ? <Link to="/admin/courses">Courses</Link> : <Link to="/coach/courses">Courses</Link>}
                {isViewlPage ? (
                    <span>
                        <img src={CaretRight} alt=">" /> View Progress
                    </span>
                ) : (
                    ''
                )}
            </div>

            <Card cardType="large">
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
                            onChange={onFilterTextChange}
                            placeholder="Search"
                        />
                    </InputGroup>
                    <div className="title-lecture-btns">
                        <h1> All Lectures</h1>
                        <span>(Note: Green labeled lectures are passed by student)</span>
                    </div>

                    <div className="d-flex lecture-btns">
                        {lectureData.map((lecture, index) => (
                            <Col xs={12} sm={4} md={4} lg={3} xl={2} xxl={2}>
                                <Button
                                    type="button"
                                    key={index}
                                    className={`btn ${lecture.isActive ? 'active' : 'inactive'}`}
                                >
                                    <img src={lecture.icon} alt="IconLect" />
                                    <p>Lecture No. {lecture.lectureNo}</p>
                                </Button>
                            </Col>
                        ))}
                    </div>
                    <div className="viewProgress-footer mx-auto">
                        <Button className="done-btn" type="button">
                            Done
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ViewProgress;
