import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import CaretRight from '@icons/CaretRight.svg';
import CaretLeft from '@icons/CaretLeft.svg';
import CarouselWrapper from '../../../components/Carousel/CarouselWrapper';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import '../../../styles/Courses.scss';
import { textParser, stripHtmlTags } from '../../../utils/utils';
// import bannerImage from '../../../assets/images/publish-background.svg';
import PdfModal from '../../../components/PdfRenderer/PdfViewer';

const CourseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const [course, setCourse] = useState(0);
    const [courseSlug, setCourseSlug] = useState('developer');
    const [selectedLecture, setSelectedLecture] = useState(0);
    
    const role = userInfo?.role;
    const courseId = location.state?.courseId;
    const isDetailPage =
        location.pathname === '/admin/courses/details' || location.pathname === '/coach/courses/details';

    
    const getCourseById = async (id) => {
        const { data } = await axiosWrapper('GET', `${API_URL.GET_COURSE.replace(':id', id)}`, {}, token);
        const courseSlug=createSlug(data.title);
        setCourseSlug(courseSlug);
    
        const mapLectures = data.lectures.map((lecture) => {
            const description = textParser(lecture?.description);
            return {
                id: lecture._id,
                title: lecture.name,
                type: lecture.file ? 'pdf' : 'video',
                description: description,
                thumbnail: lecture?.thumbnail || '',
                dataType: lecture?.dataType,
                file: lecture?.file || null,
                vimeoLink: lecture?.vimeoLink || '',
                vimeoVideoData: lecture?.vimeoVideoData || null
            };
        });
        const pdfLectures = data.lectures?.filter((lecture) => lecture?.file);
        const totalQuestions = data.lectures?.reduce((acc, item) => {
            const mcqsLength = item.quiz?.mcqs?.length || 0;
            return acc + mcqsLength;
        }, 0);

        setCourse({ ...data, lectures: mapLectures, pdfLectures, totalQuestions });

        if(data.lectures.length > 0 ){
            var name = data.lectures[0].name;
            const slug = createSlug(name);
            let segments = location.pathname.split("/").filter(Boolean);
            const lastSegment = segments[segments.length - 1]; 
            if (lastSegment !== slug) {
                segments.push(slug); 
                const newUrl = `/${segments.join("/")}`;
                navigate(newUrl, { replace: true }); // Ensure leading slash & avoid history stacking
            }
        }

        // Optionally set the first lecture as selected
        if (mapLectures.length > 0) {
            setSelectedLecture(mapLectures[0]);
            
        }
    };

    useEffect(() => {
        if (courseId) {
            getCourseById(courseId);
        }
    }, [courseId]);

    const createSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    const handleLectureSelect = (lecture) => {
        var name = lecture?.title;
        if( lecture ){
            const slug = createSlug(name);
            // Get URL segments
            let segments = location.pathname.split("/").filter(Boolean); // Remove empty segments
            const lastSegment = segments[segments.length - 1]; // Get last part of the URL
            if (lastSegment !== slug) {
                // Replace last segment with the new slug
                if (segments.length > 1) {
                segments[segments.length - 1] = slug; // Replace last segment
                } else {
                segments.push(slug); // If only one segment, just add it
                }
                const newUrl = `/${segments.join("/")}`;
                navigate(newUrl, { replace: true }); // Ensure leading slash
            }
        }
        setSelectedLecture(lecture);
    };

    return (
        <div className="publish-form-section">
            {role === 'STUDENT' ? (
                <Link to={`/${role?.toLowerCase()}/courses`}>
                    <Button type="button" className="back-button">
                        <img src={CaretLeft} alt="Back" />
                        Back
                    </Button>
                </Link>
            ) : (
                <div className="title-top mb-3">
                    {isDetailPage && (
                        <span onClick={() => navigate(`/${role?.toLowerCase()}/courses`)} style={{ cursor: 'pointer' }}>
                            Courses <img src={CaretRight} alt=">" />{' '}
                        </span>
                    )}
                    Course Details
                </div>
            )}

            <div className="publish-course-wrapper">
                <div className="row">
                    <div className="col-md-4 col-sm-12">
                        <div className="carousel-lecture">
                            <CarouselWrapper
                                items={course?.lectures || []}
                                courseId={course._id}
                                courseSlug={courseSlug}
                                type="lecture"
                                onItemClick={handleLectureSelect}
                            />
                        </div>
                    </div>
                    <div className="col-md-8 col-sm-12">
                        <div className="corse-detail-box">
                            {selectedLecture ? (
                                <>
                                    <h3>{selectedLecture?.title}</h3>
                                    {selectedLecture?.dataType === 'file' ? (
                                        <>
                                            <h5>{selectedLecture?.title}</h5>
                                            <PdfModal file={selectedLecture?.file} />
                                            <hr />
                                            <p>{stripHtmlTags(selectedLecture?.description)}</p>
                                        </>
                                    ) : (
                                        <>
                                            <iframe
                                                src={
                                                    selectedLecture?.vimeoLink ||
                                                    selectedLecture?.vimeoVideoData?.player_embed_url
                                                }
                                                width="100%"
                                                height="400"
                                                frameBorder="0"
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen
                                                title="Lecture"
                                            />
                                            <hr />
                                            <div className="modal-description">
                                                <div
                                                    className="content"
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedLecture?.description
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <p>Select a lecture to preview</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {role !== 'STUDENT' && (
                <div
                    className="publish-added-button-footer"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    {(userInfo?.role === 'ADMIN' || course?.createdBy?._id === userInfo?._id) && (
                        <>
                            <Button
                                onClick={() =>
                                    navigate(`/${role?.toLowerCase()}/courses/all-students`, {
                                        state: { courseId: course._id }
                                    })
                                }
                                type="button"
                                className="publish-btn"
                            >
                                All Students
                            </Button>
                            <Button
                                onClick={() =>
                                    navigate(`/${role?.toLowerCase()}/courses/edit`, {
                                        state: { isEdit: true, courseId: course._id }
                                    })
                                }
                                type="button"
                                className="edit-btn"
                            >
                                Edit
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
