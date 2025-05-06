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
import { precisionRound } from '../../../utils/common';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as types from '../../../redux/actions/actionTypes';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CourseSkeletonCard from '../../../components/CourseSkeletonCard';


const Courses = () => {
    const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    );

    const handleDragEnd = async (event) => {

   
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            const newDisplayedCourses = newItems
                .map((id) => displayedCourses.find((course) => course._id === id))
                .filter(Boolean);

            setDisplayedCourses(newDisplayedCourses);
            const courses = newDisplayedCourses.map((course, index) => ({
                course_id: course._id,
                sequence_id: index + 1
            }));
            const response = await axiosWrapper('POST', API_URL.SUPABASE_REORDER_COURSE_VIEW, { courses }, userToken);

        }
    };

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
    const itemsPerBatch = 50; // Number of courses to load per scroll
    function SortableItem({ course, id, onDelete }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition: isDragging ? 'none' : 'transform 300ms ease', // Animate only others
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: isDragging ? 999 : 'auto',
            opacity: isDragging ? 0.7 : 1,
            boxShadow: isDragging ? '0 8px 20px rgba(0, 161, 215, 0.16)' : 'none'
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <GenericCard
                    key={course._id}
                    {...course}
                    onDelete={() => onDelete(course._id)}
                    onChange={(e) => handleArchiveChange(e, course._id, course.archive)}
                    canAccessCourse={true}
                />
            </div>
        );
    }

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
        setDisplayedCourses([]);
        setHasMore(true);
        setHasLoaded(false);
    };

    useEffect(() => {
        // Fetch all courses when search or filter changes
        getAllCourses();
    }, [search, coursesFilter]);

    // const getAllCourses = async () => {
    //     setLoading(true);

    //     try {
    //         let constructedUrl = `${API_URL.SUPABASE_GET_ALL_COURSES}?search=${encodeURIComponent(search)}`;

    //         if (role === 'STUDENT') {
    //             constructedUrl += '&isEnrolled=true';
    //         }

    //         if (coursesFilter && coursesFilter !== 'All Courses') {
    //             const isActive = coursesFilter === 'Active Courses' ? true : false;
    //             constructedUrl += `&isActive=${isActive}`;
    //         }

    //         const response = await axiosWrapper('GET', constructedUrl, {}, userToken);
    //         const { data } = response;
    //         console.log(data)
    //         const formattedData = data.map((course) => {
    //             const baseCourseData = {
    //                 img: course?.thumbnail,
    //                 title: course?.title,
    //                 progress: 34,
    //                 description: course?.description,
    //                 detail: course?.subtitle,
    //                 lectureNo: 'Lectures: 0',
    //                 archive: course?.isArchived,
    //                 coachName: course?.moduleManager,
    //                 _id: course?.id
    //             };

    //             // if (role === 'STUDENT' && course?.enrolledStudents.includes(userInfo?._id)) {
    //             //     const progress = calcProgress(course, userInfo?._id);
    //             //     return { ...baseCourseData, progress: precisionRound(progress, 0) };
    //             // }

    //             return baseCourseData;
    //         });

    //         const uniqueCourses = Array.from(new Map(formattedData.map((item) => [item._id, item])).values());

    //         setAllCourses(uniqueCourses);
    //         const initialDisplayedCourses = uniqueCourses.slice(0, itemsPerBatch);
    //         setDisplayedCourses(initialDisplayedCourses);
    //         // Update items state with actual course IDs
    //         setItems(initialDisplayedCourses.map((c) => c._id));
    //         setHasMore(uniqueCourses.length > itemsPerBatch);
    //         setHasLoaded(true);
    //     } catch (error) {
    //         setHasMore(false);
    //         setHasLoaded(true);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const getAllCourses = async () => {
        setLoading(true);

        try {
            let constructedUrl = `${API_URL.SUPABASE_GET_ALL_COURSES}?search=${encodeURIComponent(search)}`;

            if (role === 'STUDENT') {
                constructedUrl += '&isEnrolled=true';
            }

            if (coursesFilter && coursesFilter !== 'All Courses') {
                const isActive = coursesFilter === 'Active Courses' ? true : false;
                constructedUrl += `&isActive=${isActive}`;
            }

            const response = await axiosWrapper('GET', constructedUrl, {}, userToken);
            const { data } = response;
            console.warn(data);

            const formattedData = data.map((course) => {
                // Step 1: Calculate Completion Percentage
                const calculateCompletionPercentage = () => {
                    if (!course?.lectures || course?.lectures.length === 0) return 0;

                    const completedLectures = course.lectures.filter(lecture =>
                        lecture.lecture_progress?.some(progress => progress.is_completed)
                    ).length;

                    return (completedLectures / course.lectures.length) * 100;
                };

                const completionPercentage = calculateCompletionPercentage();

                const baseCourseData = {
                    img: course?.thumbnail,
                    title: course?.title,
                    progress: completionPercentage,
                    description: course?.description,
                    detail: course?.subtitle,
                    lectureNo: `Lectures: ${course?.lectures?.length || 0}`,
                    archive: course?.isArchived,
                    coachName: course?.moduleManager,
                    _id: course?.id
                };

                // Return the formatted course data with calculated progress
                return baseCourseData;
            });

            // Remove duplicates by course _id
            const uniqueCourses = Array.from(new Map(formattedData.map((item) => [item._id, item])).values());

            setAllCourses(uniqueCourses);

            // Step 2: Pagination Handling
            const initialDisplayedCourses = uniqueCourses.slice(0, itemsPerBatch);
            setDisplayedCourses(initialDisplayedCourses);
            setItems(initialDisplayedCourses.map((c) => c._id));
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
        setItems(displayedCourses.map((c) => c._id));
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
            await axiosWrapper('DELETE', `${API_URL.SUPABASE_DELETE_COURSE.replace(':id', courseId)}`, {}, userToken);
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
                            {[
                                'All Courses',
                                'Active Courses',
                                'Inactive Courses',
                                'Name A - Z',
                                'Name Z - A',
                                'Newly Added',
                                'Old Entries'
                            ].map((event) => (
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
            {loading && !hasLoaded ? (
                <div className="custom-card-course">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <CourseSkeletonCard key={index} />
                    ))}
                </div>
            ) : (
                // Your DndContext + SortableContext + InfiniteScroll goes here
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={displayedCourses.map((c) => c._id)} strategy={rectSortingStrategy}>
                        <InfiniteScroll
                            className="custom-card-course"
                            dataLength={displayedCourses.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={<p style={{ textAlign: 'center' }}>Loading more courses...</p>}
                        >
                            {displayedCourses.map((course) => (
                                <SortableItem
                                    key={course._id}
                                    course={course}
                                    onDelete={handleDelete}
                                    id={course._id}
                                />
                            ))}
                            {role !== 'STUDENT' && (
                                <div
                                    className="add-course-card"
                                    onClick={handleCreateClick}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px dashed #b1b1b0',
                                        borderRadius: '12px',
                                        height: '200px',
                                        cursor: 'pointer',
                                        height: '100%',
                                        padding: '20px 0px',
                                        gap: '10px'
                                    }}
                                >
                                    <img
                                        src={add}
                                        alt="Add"
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            filter: 'brightness(0) saturate(100%) invert(96%) sepia(5%) saturate(218%) hue-rotate(189deg) brightness(98%) contrast(91%)'
                                        }}
                                    />
                                    <span style={{ color: '#b1b1b0' }}>New Course</span>
                                </div>
                            )}
                        </InfiniteScroll>
                    </SortableContext>
                </DndContext>
                // <InfiniteScroll
                //     className="custom-card-course"
                //     dataLength={displayedCourses.length}
                //     next={fetchMoreData}
                //     hasMore={hasMore}
                // >
                //     {displayedCourses.map((course) => (
                //         <GenericCard
                //             key={course._id}
                //             {...course}
                //             onDelete={handleDelete}
                //             onChange={(e) => handleArchiveChange(e, course._id, course.archive)}
                //             canAccessCourse={true} // Adjust logic as needed
                //         />
                //     ))}

                // </InfiniteScroll>
            )}
        </div>
    );
};

export default Courses;
