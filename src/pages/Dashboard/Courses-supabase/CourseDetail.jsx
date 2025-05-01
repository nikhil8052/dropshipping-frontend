
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
import FolderStructureView from './CoursesModal/FolderStructureView';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../Courses-supabase/CourseNew.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Loading from '@components/Loading/Loading';

const CourseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const token = useSelector((state) => state?.auth?.userToken);
    const [course, setCourse] = useState(0);
    const [courseSlug, setCourseSlug] = useState('developer');
    const [selectedLecture, setSelectedLecture] = useState(0);
    const [loading, setLoading] = useState(true);

    //  new for folder structure :
    const [topics, setTopics] = useState([]);
    const [unassignedLectures, setUnassignedLectures] = useState([]);



    const role = userInfo?.role;
    const courseId = location.state?.courseId;
    const isDetailPage =
        location.pathname === '/admin/courses-supabase/details' ||
        location.pathname === '/coach/courses-supabase/details';


        useEffect(() => {
            const processCourseData = (courseData) => {
              // Process folders into topics
              const processedTopics = courseData.folders?.map(folder => ({
                id: folder.id,
                name: folder.name,
                lectures: folder.lectures || []
              })) || [];
          
              // Process unassigned lectures
              const unassigned = courseData.lectures?.filter((lecture) => {
                return lecture.folder_id === null || lecture.folder_id === '';
              }) || [];
              
              setTopics(processedTopics);
              setUnassignedLectures(unassigned);
            };
          
            if (course) {
              processCourseData(course);
            }
          }, [course]);
          
    const getCourseById = async (id) => {
        setLoading(true);
        const { data } = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_COURSE.replace(':id', id)}`, {}, token);
        const courseSlug = createSlug(data.title);
        setCourseSlug(courseSlug);
        console.log(data);
        const mapLectures = data.lectures.map((lecture) => {
            // const description = textParser(lecture?.description);
            return {
                id: lecture.id,
                name: lecture.name,
                transcript: lecture?.transcript || '',
                folder_id: lecture.folder_id,
                type: lecture.file ? 'pdf' : 'video',
                description: lecture?.description,
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

        if (data.lectures.length > 0) {
            const name = data.lectures[0].name;
            const slug = createSlug(name);
            const segments = location.pathname.split('/').filter(Boolean);
            const lastSegment = segments[segments.length - 1];
            if (lastSegment !== slug) {
                segments.push(slug);
                const newUrl = `/${segments.join('/')}`;
                navigate(newUrl, { replace: true }); // Ensure leading slash & avoid history stacking
            }
        }

        // Optionally set the first lecture as selected
        if (mapLectures.length > 0) {
            setSelectedLecture(mapLectures[0]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (courseId) {
            getCourseById(courseId);
        }
    }, [courseId]);

    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    };

    const handleLectureSelect = (lecture) => {
        console.log(lecture);
        const name = lecture?.title != null ? lecture.title : lecture?.name;
        if (lecture) {
            const slug = createSlug(name);
            // Get URL segments
            const segments = location.pathname.split('/').filter(Boolean); // Remove empty segments
            const lastSegment = segments[segments.length - 1]; // Get last part of the URL
            if (lastSegment !== slug) {
                // Replace last segment with the new slug
                if (segments.length > 1) {
                    segments[segments.length - 1] = slug; // Replace last segment
                } else {
                    segments.push(slug); // If only one segment, just add it
                }
                const newUrl = `/${segments.join('/')}`;
                navigate(newUrl, { replace: true }); // Ensure leading slash
            }
        }
        setSelectedLecture(lecture);
    };
    const unescapeHtml = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      };
    
    const [copied, setCopied] = useState(false);
      
    const handleCopy = async () => {
        const courseId = course.id;
        const { data } = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_COURSE.replace(':id', courseId)}`, {}, token);
        const courseSlug = createSlug(data.title);
        const slug = createSlug(selectedLecture?.name);
        const baseUrl = import.meta.env.VITE__APP_URL;

        const link = `${baseUrl}/student/courses/enrolled-course/${courseSlug}/${slug}?m=direct&cid=${courseId}&lid=${selectedLecture?.id}`;
        console.log(link, ' LINK ');
        navigator.clipboard.writeText(link);
        setCopied(true);
        alert('Link has been copied to clipboard');
    };
    
    return (
        <>
        {loading ? (
            <Loading />
        ) : (
        <div className="publish-form-section">

            {role === 'STUDENT' ? (
                <Link to={`/${role?.toLowerCase()}/courses-supabase`}>
                    <Button type="button" className="back-button">
                        <img src={CaretLeft} alt="Back" />
                        Back
                    </Button>
                </Link>
            ) : (
                <div className="title-top mb-3">
                    {isDetailPage && (
                        <span
                            onClick={() => navigate(`/${role?.toLowerCase()}/courses-supabase`)}
                            style={{ cursor: 'pointer' }}
                        >
                            Courses <img src={CaretRight} alt=">" />{' '}
                        </span>
                    )}
                    Course Details
                </div>
            )}
            
            <div className="publish-course-wrapper">
                <div className="row">
                    {/* <div className="col-md-4 col-sm-12">
                        <div className="carousel-lecture">
                            <CarouselWrapper
                                items={course?.lectures || []}
                                courseId={course.id}
                                courseSlug={courseSlug}
                                type="lecture"
                                onItemClick={handleLectureSelect}
                            />
                        </div>
                    </div> */}
                    <div className="col-md-4 col-sm-12">
                    <FolderStructureView 
                        topics={topics}
                        unassignedLectures={unassignedLectures}
                        onLectureSelect={handleLectureSelect}
                    />
                    </div>
                    <div className="col-md-8 col-sm-12">
                        <div className="corse-detail-box">
                            {selectedLecture ? (
                                <>
                                    {/* <div className="corse-head-sec">
                                    <h3>{selectedLecture?.name}</h3>
                                    </div> */}
                                    <div className="product-details d-flex  justify-content-between">
                                        <h3>{selectedLecture?.name}</h3>
                                        <div>
                                            <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCopy} onClick={handleCopy} />
                                        </div>
                                    </div>
                                    <div className="modal-description">
                                         <div
                                            className="content"
                                            dangerouslySetInnerHTML={{
                                                __html: unescapeHtml(selectedLecture.description) || ''
                                            }}
                                            />
                                    </div>
                                    {/* {selectedLecture?.transcript && (
                                        <>
                                        <h3>Transcript</h3>
                                        <div
                                            className="content"
                                            dangerouslySetInnerHTML={{
                                                __html: unescapeHtml(selectedLecture.transcript) || ''
                                            }}
                                            />
                                        </>
                                    )} */}

                                    {/* {selectedLecture?.dataType === 'file' ? (
                                        <>
                                            <h5>{selectedLecture?.name}</h5>
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
                                    )} */}
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
                    {(userInfo?.role === 'ADMIN' || course?.createdBy?.id === userInfo?.id) && (
                        <>
                            <Button
                                onClick={() =>
                                    navigate(`/${role?.toLowerCase()}/courses-supabase/all-students`, {
                                        state: { courseId: course.id }
                                    })
                                }
                                type="button"
                                className="publish-btn"
                            >
                                All Students
                            </Button>
                            {/* <Button
                                onClick={() =>
                                    navigate(`/${role?.toLowerCase()}/courses-supabase/edit`, {
                                        state: { isEdit: true, courseId: course.id }
                                    })
                                }
                                type="button"
                                className="edit-btn"
                            >
                                Edit
                            </Button> */}
                            <Button
                                onClick={() =>
                                {
                                    navigate(`/${role?.toLowerCase()}/courses-supabase/edit`, {
                                        state: { 
                                            isEdit: true, 
                                            courseId: course.id,
                                            activeKey: "upload-files"
                                        }
                                        })
                                }
                                    
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
        )}
        </>
    );
};

export default CourseDetail;
