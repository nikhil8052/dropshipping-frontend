import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import CaretLeft from '@icons/CaretLeft.svg';
import CarouselWrapper from '../../../components/Carousel/CarouselWrapper';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import '../../../styles/Courses.scss';
import { textParser } from '../../../utils/utils';

const CourseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const [course, setCourse] = useState({});

    const role = userInfo?.role;
    const courseId = location.state?.courseId;
    const isDetailPage = location.pathname === '/admin/courses/details' || '/coach/courses/details';

    const getCourseById = async (id) => {
        const { data } = await axiosWrapper('GET', `${API_URL.GET_COURSE.replace(':id', id)}`, {}, token);

        const mapLectures = data.lectures.map((lecture) => {
            const description = textParser(lecture?.description);
            return {
                id: lecture._id,
                title: lecture.name,
                type: lecture.file ? 'pdf' : 'video',
                description: description,
                thumbnail: lecture?.thumbnail || '',
                dataType: lecture?.dataType,
                file: lecture?.file || null,
                vimeoLink: lecture?.vimeoLink || '',
                vimeoVideoData: lecture?.vimeoVideoData || null
            };
        });
        const pdfLectures = data.lectures?.filter((lecture) => lecture?.file);
        const totalQuestions = data.lectures?.reduce((acc, item) => {
            const mcqsLength = item.quiz?.mcqs?.length;
            return acc + mcqsLength;
        }, 0);

        setCourse({ ...data, lectures: mapLectures, pdfLectures, totalQuestions });
    };
    useEffect(() => {
        if (courseId) {
            getCourseById(courseId);
        }
    }, [courseId]);

    return (
        <>
            <div className="publish-form-section">
                {role === 'STUDENT' ? (
                    <Link to={`/${role?.toLowerCase()}/courses`}>
                        <Button type="button" className="back-button">
                            <img src={CaretLeft} />
                            Back
                        </Button>
                    </Link>
                ) : (
                    <div className="title-top mb-3">
                        {isDetailPage && (
                            <span
                                onClick={() => navigate(`/${role?.toLowerCase()}/courses`)}
                                style={{ cursor: 'pointer' }}
                            >
                                Courses <img src={CaretRight} alt=">" />{' '}
                            </span>
                        )}
                        Course Details
                    </div>
                )}

                <div className="publish-course-wrapper">
                    <div className="card-background">
                        <div className="text-heading">
                            <h1>{course?.title || 'Design Conference'}</h1>
                            <p>{course?.createdBy?.name || 'Dropship Academy X'}</p>
                        </div>
                        {/* Map the categories here */}

                        <div className="category-container">
                            {course?.category?.map((cat) => (
                                <span key={cat._id} className="category-tag">
                                    {cat.name}
                                </span>
                            )) || <span className="no-categories">No categories available</span>}
                        </div>
                    </div>
                    <div className="lecture-details-wrapper">
                        <div className="lecture-details">
                            <div className="lecture-details-item lecture-details-2">
                                <h1>Lectures</h1>
                                <p>
                                    {course.lectures?.length - course.pdfLectures?.length} Video Lectures,{' '}
                                    {course.pdfLectures?.length} Document Lectures, {course?.totalQuestions} Assesments
                                </p>
                            </div>
                            <div className="lecture-details-item">
                                <h1>Coach Name</h1>
                                <p>{course?.createdBy?.name}</p>
                            </div>
                        </div>
                        <div className="carousel-lecture">
                            <CarouselWrapper items={course?.lectures || []} type="lecture" />
                        </div>
                        {role !== 'STUDENT' && (
                            <div
                                className="publish-added-button-footer "
                                style={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                                <>
                                    {/* <Link to={}>
                                        <Button type="button" className="publish-btn">
                                            All Students
                                        </Button>
                                    </Link> */}
                                    {userInfo?.role !== 'ADMIN' && course?.createdBy?._id !== userInfo?._id ? (
                                        <></>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() =>
                                                    navigate(`/${role?.toLowerCase()}/courses/all-students`, {
                                                        state: { courseId: course._id }
                                                    })
                                                }
                                                type="button"
                                                className="publish-btn"
                                            >
                                                All Students
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    navigate(`/${role?.toLowerCase()}/courses/edit`, {
                                                        state: { isEdit: true, courseId: course._id }
                                                    })
                                                }
                                                type="button"
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Button>
                                        </>
                                    )}
                                </>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
