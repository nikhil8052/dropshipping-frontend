import { useEffect, useState } from 'react';
import { Row, Col, InputGroup, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import CourseCard from '../../../components/CourseCard/CourseCard';
import Search from '../../../assets/icons/Search.svg';
import add from '@icons/add_white.svg';
import downArrow from '@icons/down-arrow.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../../styles/Courses.scss';
import '../../../styles/Common.scss';
import Pagination from '../../../components/Pagination/Pagination';
import { API_URL } from '../../../utils/apiUrl';
import axiosWrapper from '../../../utils/api';

const Courses = () => {
    const [search, setSearch] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('Your Courses');
    const [yourCourses, setYourCourses] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesData, setCoursesData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const itemsPerPage = 8;

    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1); // Reset to first page on search change
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCreateClick = () => {
        navigate(`/${role.toLowerCase()}/courses/new`);
    };

    const handleEventSelect = (eventKey, course) => {
        setSelectedEvent(course);
        setYourCourses(course === 'Your Courses');
    };

    useEffect(() => {
        // Fetch data from API here
        getAllCourses();
    }, [search, currentPage]);

    const getAllCourses = async () => {
        const response = await axiosWrapper(
            'GET',
            `${API_URL.GET_ALL_COURSES}?page=${currentPage}&limit=${itemsPerPage}&search=${search}`,
            {},
            userToken
        );
        const { data, total, limit } = response;
        const formattedData = data.map((c) => ({
            img: c?.thumbnail,
            title: c?.title,
            detail: c?.subtitle,
            lectureNo: `Lectures: ${c?.lectures.length}`,
            archive: c?.isArchived,
            _id: c?._id
        }));

        setCoursesData(formattedData);
        setTotalPages(Math.ceil(total / limit));
    };

    const handleArchiveChange = async (id, archiveStatus) => {
        const url = archiveStatus
            ? `${API_URL.UNARCHIVE_COURSE.replace(':id', id)}`
            : `${API_URL.ARCHIVE_COURSE.replace(':id', id)}`;
        await axiosWrapper('PUT', url, {}, userToken);
        getAllCourses(); // Refresh the course list
    };

    return (
        <div className="course-section">
            <div className="courses-button-wrapper">
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
                {role === 'STUDENT' ? (
                    <DropdownButton
                        title={
                            <div className="d-flex justify-content-between align-items-center gap-2">
                                <span>{selectedEvent}</span>
                                <img src={downArrow} alt="Down arrow" />
                            </div>
                        }
                        defaultValue={selectedEvent}
                        className="dropdown-button"
                    >
                        {['All Courses', 'Your Courses'].map((event) => (
                            <Dropdown.Item
                                onClick={(e) => handleEventSelect(e, event)}
                                key={event}
                                eventKey={event}
                                className="my-1 ms-2"
                            >
                                <span className="coach-name">{event}</span>
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                ) : (
                    <Button className="add-button" onClick={handleCreateClick}>
                        <img src={add} alt="" /> <span className="ms-1">Add New Course</span>
                    </Button>
                )}
            </div>
            <div className="custom-card-course">
                <Row>
                    {coursesData.map((course) => (
                        <Col key={course._id} xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <div className="custom-card-course-new">
                                {role === 'ADMIN' || role === 'COACH' ? (
                                    <CourseCard
                                        {...course}
                                        onChange={() => handleArchiveChange(course?._id, course?.archive)}
                                    />
                                ) : (
                                    <CourseCard
                                        {...course}
                                        archive={false}
                                        enroll={yourCourses ? false : true}
                                        role={role}
                                    />
                                )}
                            </div>
                        </Col>
                    ))}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </Row>
            </div>
        </div>
    );
};

export default Courses;
