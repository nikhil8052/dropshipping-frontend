import './CourseCard.scss';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import enrollIcon from '../../assets/icons/enroll-icon.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CourseCard = ({ img, title, detail, lectureNo, archive, enroll, onChange, ...rest }) => {
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;

    return (
        <>
            <div className="course-card">
                <Link
                    to={
                        role !== 'STUDENT' || !enroll
                            ? `/${role.toLowerCase()}/courses/details`
                            : `/${role.toLowerCase()}/courses/enrolled-course`
                    }
                    state={{
                        courseId: rest?._id
                    }}
                >
                    <div className="mb-3 p-2">
                        <img src={img} className="course-img " alt="course-icon" />
                        <h1 className="course-title">{title}</h1>
                        <p className="course-des">{detail}</p>
                        <p className="lecture-No">{lectureNo}</p>
                    </div>
                </Link>
                {role === 'ADMIN' && (
                    <div className="toggle-archive">
                        <Form>
                            <Form.Check
                                onChange={onChange}
                                checked={archive}
                                type="switch"
                                id="custom-switch"
                                label="Archive"
                            />
                        </Form>
                    </div>
                )}
                {enroll && (
                    <>
                        <div className="progress-section  ">
                            <div>
                                <ProgressBar now={60} />
                            </div>
                            <p className="text-end p-2">60% Progress</p>
                        </div>
                        <div className="enroll-icon">
                            <img src={enrollIcon} alt="enrollIcon" />
                            <p className="">Enrolled</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CourseCard;
