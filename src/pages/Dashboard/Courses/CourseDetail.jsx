import { useEffect, useState } from 'react';
import '../../../styles/Courses.scss';
import { Button } from 'react-bootstrap';
import Card from '@components/Card/Card';
import CourseSlider from './CourseSlider';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';

const CourseDetail = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCoach, setIsCoach] = useState(false);

    const location = useLocation();
    const isDetailPage = location.pathname === '/admin/courses/details' || '/coach/courses/details';

    useEffect(() => {
        if (userInfo) {
            const { role } = userInfo;
            setIsAdmin(role === 'admin');
            setIsCoach(role === 'coach');
        }
    }, [userInfo]);

    return (
        <>
            <div className="publish-form-section">
                <div className="addcourse-nav mb-3">
                    {isAdmin ? <Link to="/admin/courses">Courses</Link> : <Link to="/coach/courses">Courses</Link>}
                    {isDetailPage ? (
                        <span>
                            <img src={CaretRight} alt=">" /> Course Details
                        </span>
                    ) : (
                        ''
                    )}
                </div>
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
                    <div
                        className="publish-added-button-footer "
                        style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'space-between' }}
                    >
                        {isCoach ? (
                            <>
                                <Link to="/coach/courses/all-students">
                                    <Button type="button" className="publish-btn">
                                        All Students
                                    </Button>
                                </Link>

                                <Button type="button" className="edit-btn">
                                    Edit
                                </Button>
                            </>
                        ) : (
                            <Button type="button" className="edit-btn">
                                Edit
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default CourseDetail;
