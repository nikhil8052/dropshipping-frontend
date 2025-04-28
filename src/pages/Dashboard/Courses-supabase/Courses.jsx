import { useEffect, useState, useCallback } from 'react';
import { InputGroup, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import Search from '../../../assets/icons/Search.svg';
import add from '@icons/add_white.svg';
import downArrow from '@icons/down-arrow.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../../../utils/apiUrl';
import axiosWrapper from '../../../utils/api';
import '../../../styles/Common.scss';
import '../../../styles/Courses.scss';
import { Helmet } from 'react-helmet';
import GenericCard from '../../../components/GenericCard/GenericCardSupabase';
// import GenericCard from '../../../components/GenericCard/GenericCard';
import { precisionRound } from '../../../utils/common';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as types from '../../../redux/actions/actionTypes';

const Courses = () => {

    const [search, setSearch] = useState('');
    const [coursesFilter, setCoursesFilter] = useState('All Courses');
    const [allCourses, setAllCourses] = useState([]); // Store all fetched courses
    const [displayedCourses, setDisplayedCourses] = useState([]); // Courses currently displayed
    const [hasMore, setHasMore] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const itemsPerBatch = 12; // Number of courses to load per scroll

    // Debounce search input to prevent excessive API calls
    const debounce = (func, delay) => {
        let debounceTimer;
        return function (...args) {
            const context = this;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const onFilterTextChange = (event) => {
        const value = event.target.value;
        debouncedSearch(value);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearch(value);
            setDisplayedCourses([]); // Clear displayed courses
            setHasMore(true);
            setHasLoaded(false);
        }, 500),
        []
    );

    const handleCreateClick = () => {
        dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourse', data: null } });

        navigate(`/${role?.toLowerCase()}/courses-supabase/new`, {
            state: { isEdit: false, courseId: null }
        });
    };

    const handleCoursesFilter = (eventKey, course) => {
        setCoursesFilter(course);
        setDisplayedCourses([]); // Clear displayed courses
        setHasMore(true);
        setHasLoaded(false);
    };

    useEffect(() => {
        // Fetch all courses when search or filter changes
        getAllCourses();
    }, [search, coursesFilter]);

    const getAllCourses = async () => {
        setLoading(true);
        try {
            // const page = Math.floor(displayedCourses.length / itemsPerBatch) + 1;
            // let constructedUrl = `${API_URL.SUPABASE_GET_ALL_COURSES}?search=${encodeURIComponent(search)}&page=${page}&limit=${itemsPerBatch}`;

            let constructedUrl = `${API_URL.SUPABASE_GET_ALL_COURSES}?search=${encodeURIComponent(search)}`;

            if (role === 'STUDENT') {
                constructedUrl += '&isEnrolled=true';
            }

            if (coursesFilter && coursesFilter !== 'All Courses') {
                const isActive = coursesFilter === 'Active Courses' ? true : false;
                constructedUrl += `&isActive=${isActive}`;
            }

            const response = await axiosWrapper('GET', constructedUrl, {}, userToken);
            const { data } = response; // Assuming response contains all courses without pagination

            console.log( data , " All Courses ")
            // Format the fetched data
            const formattedData = data.map((course) => {
                const baseCourseData = {
                    img: course?.thumbnail,
                    title: course?.title,
                    description: course?.description,
                    detail: course?.subtitle,
                    // lectureNo: `Lectures: ${course?.lectures.length}`,
                    lectureNo: `Lectures: 0`,
                    archive: course?.isArchived,
                    coachName: course?.moduleManager,
                    // coachName: course?.moduleManager?.name,
                    
                    // enroll: course?.enrolledStudents.includes(userInfo?._id),
                    _id: course?.id
                };

                if (role === 'STUDENT' && course?.enrolledStudents.includes(userInfo?._id)) {
                    const progress = calcProgress(course, userInfo?._id);
                    return { ...baseCourseData, progress: precisionRound(progress, 0) };
                }

                return baseCourseData;
            });

            // Remove duplicates if any (optional, as backend should handle it)
            const uniqueCourses = Array.from(new Map(formattedData.map((item) => [item._id, item])).values());

            setAllCourses(uniqueCourses);
            setDisplayedCourses(uniqueCourses.slice(0, itemsPerBatch));
            setHasMore(uniqueCourses.length > itemsPerBatch);
            setHasLoaded(true);
        } catch (error) {
            setHasMore(false);
            setHasLoaded(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreData = () => {
        if (loading) return; // Prevent multiple fetches

        const currentLength = displayedCourses.length;
        const moreCourses = allCourses.slice(currentLength, currentLength + itemsPerBatch);
        if (moreCourses.length === 0) {
            setHasMore(false);
            return;
        }

        setDisplayedCourses((prevCourses) => [...prevCourses, ...moreCourses]);
        if (currentLength + moreCourses.length >= allCourses.length) {
            setHasMore(false);
        }
    };

    const handleArchiveChange = async (e, id, archiveStatus) => {
        const courseIndex = allCourses.findIndex((c) => c._id === id);
        const updatedAllCourses = [...allCourses];

        e.stopPropagation();
        const url = archiveStatus
            ? `${API_URL.UNARCHIVE_COURSE.replace(':id', id)}`
            : `${API_URL.ARCHIVE_COURSE.replace(':id', id)}`;
        await axiosWrapper('PUT', url, {}, userToken);

        updatedAllCourses[courseIndex].archive = !archiveStatus;
        setAllCourses(updatedAllCourses);

        // Update displayedCourses as well
        const displayedIndex = displayedCourses.findIndex((c) => c._id === id);
        if (displayedIndex !== -1) {
            const updatedDisplayedCourses = [...displayedCourses];
            updatedDisplayedCourses[displayedIndex].archive = !archiveStatus;
            setDisplayedCourses(updatedDisplayedCourses);
        }
    };

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

    
    const handleDelete = async (courseId) => {
        setLoading(true);
        try {
            await axiosWrapper('DELETE', `${API_URL.DELETE_COURSE.replace(':id', courseId)}`, {}, userToken);
            setLoading(false);
            getAllCourses();
        } catch (error) {
            setLoading(false);
        }
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
                {role !== 'STUDENT' && (
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
            {hasLoaded && allCourses.length === 0 ? (
                <div className="no-data-wrapper">No Data Found.</div>
            ) : (
                <InfiniteScroll
                    className="custom-card-course"
                    dataLength={displayedCourses.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                >
                    {displayedCourses.map((course) => (
                        <GenericCard
                            key={course._id}
                            {...course}
                            onDelete={handleDelete}
                            onChange={(e) => handleArchiveChange(e, course._id, course.archive)}
                            canAccessCourse={true} // Adjust logic as needed
                        />
                    ))}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default Courses;
