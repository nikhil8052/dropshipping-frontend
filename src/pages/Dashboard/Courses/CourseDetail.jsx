import '../../../styles/Courses.scss';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import CaretLeft from '@icons/CaretLeft.svg';
import { lessons } from '../../../data/data';
import CarouselWrapper from '../../../components/Carousel/CarouselWrapper';

const CourseDetail = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const role = userInfo?.role;
    const navigate = useNavigate();

    const location = useLocation();
    const isDetailPage = location.pathname === '/admin/courses/details' || '/coach/courses/details';

    return (
        <>
            <div className="publish-form-section">
                {role === 'student' ? (
                    <Link to={`/${role}/courses`}>
                        <Button type="button" className="back-button">
                            <img src={CaretLeft} />
                            Back
                        </Button>
                    </Link>
                ) : (
                    <div className="title-top mb-3">
                        {isDetailPage && (
                            <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                                Courses <img src={CaretRight} alt=">" />{' '}
                            </span>
                        )}
                        Course Details
                    </div>
                )}

                <div className="publish-course-wrapper">
                    <div className="card-background">
                        <div className="text-heading">
                            <h1>Design Conference</h1>
                            <p>Dropship Academy X</p>
                        </div>
                    </div>
                    <div className="lecture-details-wrapper">
                        <div className="lecture-details">
                            <div className="lecture-details-item">
                                <h1>Duration</h1>
                                <p>3 Weeks, 120 Hr</p>
                            </div>
                            <div className="lecture-details-item lecture-details-2">
                                <h1>Lectures</h1>
                                <p>28 Video Lectures, 5 Assesments</p>
                            </div>
                            <div className="lecture-details-item">
                                <h1>Coach Name</h1>
                                <p>David Richerson</p>
                            </div>
                        </div>
                        <div className="carousel-lecture">
                            <CarouselWrapper items={lessons} type="lecture" />
                        </div>
                        {role !== 'student' && (
                            <div
                                className="publish-added-button-footer "
                                style={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                                <>
                                    <Link to={`/${role}/courses/all-students`}>
                                        <Button type="button" className="publish-btn">
                                            All Students
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() =>
                                            navigate(`/${role}/courses/new`, {
                                                state: { isEdit: true }
                                            })
                                        }
                                        type="button"
                                        className="edit-btn"
                                    >
                                        Edit
                                    </Button>
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
