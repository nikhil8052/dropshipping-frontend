import '../../../styles/Courses.scss';
import { Button } from 'react-bootstrap';
import Card from '@components/Card/Card';
import CourseSlider from './CourseSlider';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import CaretLeft from '@icons/CaretLeft.svg';

const CourseDetail = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const role = userInfo.role;

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
                    <div className="addcourse-nav mb-3">
                        <Link to={`/${role}/courses`}>Courses</Link>
                        {isDetailPage && (
                            <span>
                                <img src={CaretRight} alt=">" /> Course Details
                            </span>
                        )}
                    </div>
                )}

                <Card cardType="large">
                    <div className="card-background">
                        <div className="text-heading">
                            <h1>Design Conference</h1>
                            <p>Dropship Academy X</p>
                        </div>
                    </div>
                    <div className="lecture-details">
                        <div className="p-2">
                            <h1>Duration</h1>
                            <p>3 Weeks, 120 Hr</p>
                        </div>
                        <div className="lecture-details-2">
                            <h1>Lectures</h1>
                            <p>28 Video Lectures, 5 Assesments</p>
                        </div>
                        <div className="p-2">
                            <h1>Coach Name</h1>
                            <p>David Richerson</p>
                        </div>
                    </div>
                    <div className="carousel-lecture ">
                        <CourseSlider />
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

                                <Button type="button" className="edit-btn">
                                    Edit
                                </Button>
                            </>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
};

export default CourseDetail;
