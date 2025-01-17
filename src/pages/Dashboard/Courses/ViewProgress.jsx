import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import viewProfile from '../../../assets/images/Ellipse 5.svg';
import { InputGroup, Button, Form, Col, Row } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import inActiveIcon from '../../../assets/icons/Icon-inactive-lec.svg';
import activeIcon from '../../../assets/icons/IconLect.svg';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import TextExpand from '@components/TextExpand/TextExpand';
import '../../../styles/Courses.scss';
import { trimLongText } from '../../../utils/common';
import bannerImage from '../../../assets/images/publish-background.svg';

const ViewProgress = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();

    const [search, setSearch] = useState('');
    const [progress, setProgress] = useState(null);
    const [filteredLectures, setFilteredLectures] = useState([]);

    const courseId = location.state?.courseId;
    const studentId = location.state?.studentId;

    const getStudentProgress = async (courseId, studentId) => {
        const url = `${API_URL.GET_STUDENT_PROGRESS.replace(':courseId', courseId).replace(':studentId', studentId)}`;
        const { data } = await axiosWrapper('GET', url, {}, token);
        setProgress(data);
        setFilteredLectures(data.lectures);
    };

    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        if (courseId && studentId) {
            getStudentProgress(courseId, studentId);
        }
    }, [courseId, studentId]);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    useEffect(() => {
        if (progress) {
            const debouncedFilter = debounce(() => {
                const filteredLectures = progress.lectures
                    .filter((lecture) => lecture.lectureTitle.toLowerCase().includes(search.toLowerCase()))
                    .slice(0, 20);
                setFilteredLectures(filteredLectures);
            }, 300);
            debouncedFilter();
        }
    }, [search, progress]);

    // Later we can add a infinite scroll to load more lectures
    return (
        <div className="view-progress-section">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                    Courses <img src={CaretRight} alt=">" />
                </span>{' '}
                <span
                    onClick={() =>
                        navigate(`/${role}/courses/details`, {
                            state: {
                                courseId: courseId
                            }
                        })
                    }
                    style={{ cursor: 'pointer' }}
                >
                    Course Details <img src={CaretRight} alt=">" />{' '}
                </span>
                <span
                    onClick={() =>
                        navigate(`/${role}/courses/all-students`, {
                            state: {
                                courseId: courseId
                            }
                        })
                    }
                    style={{ cursor: 'pointer' }}
                >
                    All Students <img src={CaretRight} alt=">" />{' '}
                </span>
                View Progress
            </div>

            <div
                className="card-background"
                style={{
                    backgroundImage: `url(${progress?.course?.banner || bannerImage})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
            >
                <div className="text-heading">
                    <TextExpand className="text-white fw-bold fs-1" value={progress?.course?.title} width="50%" />

                    <div className="viewProfile-img">
                        <img
                            className="avatar-student"
                            src={progress?.student?.avatar || viewProfile}
                            alt="student profile"
                        />
                        <p>{progress?.student?.name || 'Dropship Academy X'}</p>
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
                        {filteredLectures?.length > 0 ? (
                            filteredLectures?.map((lecture, index) => (
                                <Col xs={12} sm={5} md={4} lg={4} xl={3} xxl={2} key={index}>
                                    <Button
                                        type="button"
                                        className={lecture.isCompleted ? 'btn active ' : 'btn inactive'}
                                    >
                                        <img src={lecture.isCompleted ? activeIcon : inActiveIcon} alt="IconLect" />
                                        <p>{trimLongText(lecture.lectureTitle)}</p>
                                    </Button>
                                </Col>
                            ))
                        ) : (
                            <p className="fw-bold text-center">No lectures found</p>
                        )}
                    </Row>
                </div>
                <div className="viewProgress-footer mx-auto">
                    <Link to={`/${role}/courses`}>
                        <Button className="done-btn text-center d-flex justify-content-center" type="button">
                            Done
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ViewProgress;
