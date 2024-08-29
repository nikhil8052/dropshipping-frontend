import { Card, Form } from 'react-bootstrap';
import CustomProgressBar from '../CustomProgressBar/CustomProgressBar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextExpand from '@components/TextExpand/TextExpand';
import enrollIcon from '../../assets/icons/enroll-icon.svg';
import lockIcon from '../../assets/icons/lock-icon.svg';
import './GenericCard.scss';

const GenericCard = ({
    img,
    title,
    coachName,
    progress = 0,
    archive,
    onChange,
    enroll,
    detail,
    canAccessCourse,
    ...rest
}) => {
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const navigate = useNavigate();

    return (
        <Card
            className="generic-card cursor-pointer"
            onClick={(e) => {
                const isToggleClick = e.target.className === 'form-check-input';
                if (isToggleClick) return;
                navigate(
                    role === 'student' && enroll && canAccessCourse
                        ? `/${role}/courses/enrolled-course`
                        : `/${role}/courses/details`,
                    {
                        state: {
                            courseId: rest?._id
                        }
                    }
                );
            }}
        >
            <Card.Img variant="top" src={img} className="card-image" />
            <Card.Body className="card-body">
                <Card.Title className="card-title">
                    <TextExpand className="course-title" value={title} width="100%" />
                </Card.Title>
                <Card.Text className="card-coach">
                    <TextExpand className="course-des" value={detail} width="100%" />
                </Card.Text>
                <Card.Text className="card-coach">Coach: {coachName}</Card.Text>

                {role === 'admin' && (
                    <div className="card-archive">
                        <span>{archive ? 'Inactive' : 'Active'}</span>
                        <Form.Check
                            className="archive-toggle-btn"
                            onChange={onChange}
                            checked={archive}
                            type="switch"
                            id="custom-switch"
                        />
                    </div>
                )}
                {role === 'student' && enroll && (
                    <>
                        <CustomProgressBar progress={progress} />
                        <div className="enroll-icon">
                            <img src={!canAccessCourse ? lockIcon : enrollIcon} alt="enrollIcon" />
                            <p className="">{!canAccessCourse ? 'Locked' : 'Enrolled'}</p>
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default GenericCard;
