import './CourseCard.scss';
import Form from 'react-bootstrap/Form';
const CourseCard = ({ img, title, detail, lectureNo, simple = 'true' }) => {
    return (
        <>
            <div className="course-card">
                <img src={img} className="course-img " alt="course-icon" />
                <h1 className="course-title">{title}</h1>
                <p className="course-des">{detail}</p>
                <p className="lecture-No">{lectureNo}</p>
            </div>
            {simple && (
                <div className="toggle-archive">
                    <Form>
                        <Form.Check type="switch" id="custom-switch" label="Archive" />
                    </Form>
                </div>
            )}
        </>
    );
};

export default CourseCard;
