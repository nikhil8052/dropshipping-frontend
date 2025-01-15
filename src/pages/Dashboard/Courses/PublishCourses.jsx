import { Button, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CarouselWrapper from '../../../components/Carousel/CarouselWrapper';
import * as types from '../../../redux/actions/actionTypes';
import '../../../styles/Courses.scss';
import bannerImage from '../../../assets/images/publish-background.svg';

const PublishCourses = ({ onBack, initialData, setStepComplete, publishCourse }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const coachName = useSelector((state) => state?.root?.coachName);
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const lectures = initialData?.lectures || [];
    const pdfLectures = lectures.filter((lecture) => lecture.file);
    const totalQuestions = lectures.reduce((acc, item) => {
        const mcqsLength = item.quiz?.mcqs?.length;
        return acc + mcqsLength;
    }, 0);

    const handleSubmit = async () => {
        await publishCourse();
        navigate(`/${role}/courses/`);
        dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourse', data: null } });
        setStepComplete('step3');
    };

    const mapLectures = lectures.map((lecture) => {
        return {
            id: lecture._id,
            title: lecture.name,
            type: lecture.file ? 'pdf' : 'video',
            description: lecture?.description || '',
            thumbnail: lecture?.thumbnail || '',
            dataType: lecture?.dataType,
            file: lecture?.file || null,
            vimeoLink: lecture?.vimeoLink || '',
            vimeoVideoData: lecture?.vimeoVideoData || null
        };
    });

    return (
        <>
            <div className="publish-form-section">
                <div className="section-title">
                    <p>Publish Course</p>
                </div>
                <div className="publish-course-wrapper">
                    <div
                        className="card-background"
                        style={{
                            backgroundImage: `url(${initialData?.banner || bannerImage})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover'
                        }}
                    >
                        <div className="text-heading">
                            <h1>{initialData?.title}</h1>
                            <p>{coachName || 'Dropship Academy X'}</p>
                        </div>

                        <div className="category-container">
                            {initialData?.category.length > 0 &&
                                initialData?.category?.map((cat) => (
                                    <span key={cat?.value} className="category-tag">
                                        {cat?.label}
                                    </span>
                                ))}
                        </div>
                    </div>
                    <div className="lecture-details-wrapper">
                        <div className="lecture-details">
                            <div className="lecture-detailpdfLecturess-item lecture-details-2">
                                <h1>Lectures</h1>
                                <p>
                                    {lectures?.length - pdfLectures.length} Video Lectures, {pdfLectures.length}{' '}
                                    Document Lectures, {totalQuestions} Assesments
                                </p>
                            </div>
                            <div className="lecture-details-item">
                                <h1>Coach Name</h1>
                                <p>{coachName || ''}</p>
                            </div>
                        </div>
                        <div className="carousel-lecture">
                            <CarouselWrapper items={mapLectures} type="lecture" />
                        </div>
                        <Row>
                            <div className="mt-3 pb-3 d-flex justify-content-between gap-3">
                                <Button type="button" onClick={onBack} className="cancel-btn">
                                    Back
                                </Button>
                                <Button type="submit" className="submit-btn" onClick={handleSubmit}>
                                    Publish
                                </Button>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublishCourses;
