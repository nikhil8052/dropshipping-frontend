import './CourseCard.scss';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import enrollIcon from '../../assets/icons/enroll-icon.svg';
import lockIcon from '../../assets/icons/lock-icon.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { trimLongText } from '../../utils/common';

const CourseCard = ({
    img,
    title,
    detail,
    lectureNo,
    archive,
    enroll,
    onChange,
    previousCourseProgress,
    currentCourseProgress,
    canAccessCourse,
    ...rest
}) => {
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();

    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleExpand = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling to the Link
        setIsExpanded(!isExpanded);
    };

    const trimmedText = trimLongText(detail, 20);
    const displayText = isExpanded ? detail : trimmedText;

    // check if the previous course is 100% complete then it can move to next course
    return (
        <>
            <div className="course-card">
                <Link
                    to={
                        role === 'student' && enroll && canAccessCourse
                            ? `/${role}/courses/enrolled-course`
                            : `/${role}/courses/details`
                    }
                    state={{
                        courseId: rest?._id
                    }}
                >
                    <div className="mb-3 p-2">
                        <img src={img} className="course-img " alt="course-icon" />
                        <h1 className="course-title">{title}</h1>
                        <p className="course-des">
                            {displayText}
                            {detail.length > 20 && (
                                <span className="show-more" onClick={handleToggleExpand}>
                                    {isExpanded ? 'Show Less' : 'Show More'}
                                </span>
                            )}
                        </p>
                        <p className="lecture-No">{lectureNo}</p>
                    </div>
                </Link>
                {role === 'admin' && (
                    <div className="toggle-archive">
                        <Form>
                            <Form.Check
                                onChange={onChange}
                                checked={archive}
                                type="switch"
                                id="custom-switch"
                                label={archive ? 'Inactive' : 'Active'}
                            />
                        </Form>
                    </div>
                )}
                {role === 'student' && enroll && (
                    <>
                        <div className="progress-section  ">
                            <div>
                                <ProgressBar now={currentCourseProgress} />
                            </div>
                            <p className="text-end p-2">{currentCourseProgress.toFixed(2)}% Progress</p>
                        </div>
                        <div className="enroll-icon">
                            <img src={!canAccessCourse ? lockIcon : enrollIcon} alt="enrollIcon" />
                            <p className="">{!canAccessCourse ? 'Locked' : 'Enrolled'}</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CourseCard;
