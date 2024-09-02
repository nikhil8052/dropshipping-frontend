import { useEffect, useState } from 'react';
import { InputGroup, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import add from '@icons/add_white.svg';
import downArrow from '@icons/down-arrow.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../../components/Pagination/Pagination';
import { API_URL } from '../../../utils/apiUrl';
import * as types from '../../../redux/actions/actionTypes';
import axiosWrapper from '../../../utils/api';
import '../../../styles/Common.scss';
import '../../../styles/Courses.scss';
import { Helmet } from 'react-helmet';
import GenericCard from '../../../components/GenericCard/GenericCard';

const Courses = () => {
    const [search, setSearch] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('Your Courses');
    const [coursesFilter, setCoursesFilter] = useState('All Courses');
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesData, setCoursesData] = useState([]);
    const dispatch = useDispatch();
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
        navigate(`/${role?.toLowerCase()}/courses/new`, {
            state: { isEdit: false, courseId: null }
        });
    };

    const handleEventSelect = (eventKey, course) => {
        setSelectedEvent(course);
    };

    const handleCoursesFilter = (eventKey, course) => {
        setCoursesFilter(course);
    };

    useEffect(() => {
        // Fetch data from API here
        getAllCourses();
        dispatch({ type: types.LOGOUT });
    }, [search, currentPage, selectedEvent, coursesFilter]);

    const getAllCourses = async () => {
        const method = 'GET';
        let url = `${API_URL.GET_ALL_COURSES}?page=${currentPage}&limit=${itemsPerPage}&search=${search}`;
        if (selectedEvent) {
            url = `${url}&isEnrolled=${selectedEvent === 'Your Courses' ? true : false}`;
        }

        if (coursesFilter) {
            url = `${url}&isActive=${coursesFilter}`;
        }

        const response = await axiosWrapper(method, url, {}, userToken);
        const { data, total, limit } = response;

        const formattedData = data.map((course) => {
            const baseCourseData = {
                img: course?.thumbnail,
                title: course?.title,
                detail: course?.subtitle,
                lectureNo: `Lectures: ${course?.lectures.length}`,
                archive: course?.isArchived,
                coachName: course?.moduleManager?.name,
                enroll: course?.enrolledStudents.includes(userInfo?._id),
                _id: course?._id
            };

            if (role === 'STUDENT' && course?.enrolledStudents.includes(userInfo?._id)) {
                const progress = calcProgress(course, userInfo?._id);
                return { ...baseCourseData, progress };
            }

            return baseCourseData;
        });
        setCoursesData(formattedData);
        setTotalPages(Math.ceil(total / limit));
    };

    const handleArchiveChange = async (e, id, archiveStatus) => {
        const courseIndex = coursesData.findIndex((c) => c._id === id);
        const copyCourse = [...coursesData];

        try {
            e.stopPropagation();
            const url = archiveStatus
                ? `${API_URL.UNARCHIVE_COURSE.replace(':id', id)}`
                : `${API_URL.ARCHIVE_COURSE.replace(':id', id)}`;
            await axiosWrapper('PUT', url, {}, userToken);

            copyCourse[courseIndex].archive = !archiveStatus;
            setCoursesData(copyCourse);
        } catch (error) {
            copyCourse[courseIndex].archive = archiveStatus;
            setCoursesData(copyCourse);
        }
    };

    // Admin | Coach Side
    // 1. Enroll student to course when creating a new student (DONE)
    // 2. Keep record of courses Roadmap in student (i.e student can not start other courses before finishing the previous one like proper indexing) (DONE)

    // Student Side
    // 1. Get All Courses (DONE)
    // 2. Get All Enrolled Courses (DONE)
    // Enrolled Courses
    // a. Get Course Details By Id (Video | PDF) (DONE)
    // b. Get Lecture Preview (Video | PDF) (disable other lectures until the previous one is completed with quiz completion)
    // c. Perform a quiz Api (if quiz marks are less than 50% then student can not proceed to the next lecture and have a retry option for the quiz)
    // d. Update the progress of the lecture (i.e. 1/10 lectures completed)

    const calcProgress = (course, studentId) => {
        const lectures = course.lectures || [];
        const totalLectures = lectures.length;

        // Count completed lectures
        const completedLectures = lectures.filter((lecture) => {
            const completedBy = lecture.completedBy || [];
            return completedBy.includes(studentId) || completedBy.some((item) => item._id === studentId);
        }).length;

        // Calculate the completion percentage for this course
        return totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
    };

    return (
        <div className="course-section">
            <Helmet>
                <title>Courses | Dropship Academy</title>
            </Helmet>
            <div className="courses-button-wrapper">
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
                    <div className="d-flex gap-2 flex-wrap">
                        <DropdownButton
                            title={
                                <div className="d-flex justify-content-between align-items-center gap-2">
                                    <span>{coursesFilter}</span>
                                    <img src={downArrow} alt="Down arrow" />
                                </div>
                            }
                            defaultValue={coursesFilter}
                            className="dropdown-button"
                        >
                            {['All Courses', 'Active Courses', 'Inactive Courses'].map((event) => (
                                <Dropdown.Item
                                    onClick={(e) => handleCoursesFilter(e, event)}
                                    key={event}
                                    eventKey={event}
                                    className="my-1 ms-2"
                                >
                                    <span className="coach-name">{event}</span>
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <Button className="add-button" onClick={handleCreateClick}>
                            <img src={add} alt="" /> <span className="ms-1">Add New Course</span>
                        </Button>
                    </div>
                )}
            </div>
            <div className="custom-card-course">
                {coursesData.length === 0 ? (
                    <div className="no-data-wrapper">No Data Found.</div>
                ) : (
                    <>
                        {coursesData.map((course, index) => {
                            const previousCourse = coursesData[index - 1];
                            const previousCourseProgress = previousCourse ? previousCourse.progress : 100;
                            // The student can access the current course only if the previous course is completed 100%
                            const canAccessCourse = previousCourseProgress === 100;

                            return (
                                <GenericCard
                                    key={index}
                                    {...course}
                                    onChange={(e) => handleArchiveChange(e, course?._id, course?.archive)}
                                    canAccessCourse={canAccessCourse}
                                />
                            );
                        })}
                    </>
                )}
            </div>
            {coursesData.length !== 0 && (
                <Pagination
                    customClass={coursesData.length < itemsPerPage ? 'card-position' : ''}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default Courses;
