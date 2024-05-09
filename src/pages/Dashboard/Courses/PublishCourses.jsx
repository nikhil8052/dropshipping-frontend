import { useEffect, useState } from 'react';
import '../../../styles/Courses.scss';
import { Button, Row } from 'react-bootstrap';
import Card from '@components/Card/Card';
import CourseSlider from './CourseSlider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PublishCourses = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            const { role } = userInfo;
            setIsAdmin(role === 'admin');
        }
    }, [userInfo]);

    const handleSubmit = () => {
        if (isAdmin) {
            navigate('/admin/courses/details');
        } else {
            // Handle create button click event here
            navigate('/coach/courses/details');
        }
    };

    return (
        <>
            <div className="publish-form-section">
                <div className="section-title">
                    <p>Publish Course</p>
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
                </Card>

                <Row>
                    <div className="mt-3 d-flex justify-content-between gap-3">
                        <Button type="button" onClick={() => navigate(-1)} className="cancel-btn">
                            Cancel
                        </Button>
                        <Button type="submit" className="submit-btn" onClick={handleSubmit}>
                            Publish
                        </Button>
                    </div>
                </Row>
            </div>
        </>
    );
};

export default PublishCourses;
