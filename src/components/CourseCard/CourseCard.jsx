import './CourseCard.scss';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import enrollIcon from '../../assets/icons/enroll-icon.svg';
import lockIcon from '../../assets/icons/lock-icon.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextExpand from '@components/TextExpand/TextExpand';

const CourseCard = ({
    img,
    title,
    detail,
    lectureNo,
    archive,
    enroll,
    onChange,
    progress = 0,
    canAccessCourse,
    ...rest
}) => {
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();

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
                        <TextExpand className="course-title" value={title} width="100%" />
                        <TextExpand className="course-des" value={detail} width="100%" />
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
                                <ProgressBar now={Math.floor(progress)} />
                            </div>
                            <p className="text-end p-2">{Math.floor(progress)}% Progress</p>
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
