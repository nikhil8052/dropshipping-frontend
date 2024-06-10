import { useRef, useState, useEffect } from 'react';
import '../../../styles/Courses.scss';
import { Button, Col, Row, Container } from 'react-bootstrap';
import thumbnail from '../../../assets/icons/Thumbnail.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import VideoIcon from '../../../assets/icons/VideoIcon.svg';
import menuIcon from '../../../assets/icons/Menu.svg';
import plusIcon from '../../../assets/icons/Plus.svg';
import trashIconRed from '../../../assets/icons/Trash-rename.svg';
import PencilLine from '../../../assets/icons/PencilLine.svg';
import CoursesModal from './CoursesModal/CoursesModal';
import AddLectureModal from './AddLectureModal';
import { trimLongText } from '../../../utils/common';
import UploadSimple from '@icons/UploadSimple.svg';
// import axiosWrapper from '@utils/api';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import ImageCropper from '../../../components/ImageMask/ImageCropper';

const UploadFiles = ({ onNext, onBack }) => {
    const inputRef = useRef();
    const videoinputRef = useRef();
    const [coursePhoto, setCoursePhoto] = useState(null);
    const [courseVideo, setCourseVideo] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);

    const [lectureModal, setLectureModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        lectureId: null,
        initialValues: null
    });

    const [lectures, setLectures] = useState([]);
    const [cropping, setCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [coachData, setCoachData] = useState({
        courseDescription: ''
    });

    useEffect(() => {
        // Fetch data from API here for now just update the data
        setCoachData({
            courseDescription: ''
        });
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            // Display an error or handle the invalid file selection
            toast.error('Invalid file selected. Please choose an image file.');
            return;
        }

        const image = URL.createObjectURL(file);
        setImageSrc(image);
        setCropping(true);
    };

    const handleCropComplete = (croppedImage) => {
        setCoursePhoto(croppedImage);
        // Upload File through API
        setCropping(false);
        toast.success('Image uploaded successfully!', {
            icon: '🎉',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        });
    };

    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('video/')) {
            // Display an error or handle the invalid file selection
            toast.error('Invalid file selected. Please choose a video file.');
            return;
        }

        toast.success('Video uploaded successfully!', {
            icon: '🎉',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        });

        setCourseVideo(file);
        // Upload File through API
    };

    const handleCreateClick = () => {
        setLectureModal({
            show: true,
            title: 'Add Lecture',
            isEditable: false,
            lectureId: null,
            initialValues: {
                lectureName: '',
                lectureDescription: '',
                questions: [''],
                optionalQuestions: [{ question: '', option1: '', option2: '', option3: '', option4: '' }],
                file: null
            }
        });
    };

    const handleEditClick = (id) => {
        const lecture = lectures.find((lec) => lec.id === id);
        setLectureModal({
            show: true,
            title: 'Edit Lecture',
            isEditable: true,
            lectureId: id,
            initialValues: lecture
        });
    };

    const handleDeleteClick = (id) => {
        setSelectedRowId(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            // Commenting for future use
            // const data = await axiosWrapper(
            //     'delete',
            //     `${import.meta.env.VITE_JSONPLACEHOLDER}/posts/${selectedRowId}}`
            // );
            setLectures(lectures.filter((lec) => lec.id !== selectedRowId));
            toast.success('Lecture deleted successfully');
        } catch (error) {
            return;
        } finally {
            setLoadingCRUD(false);
            setShowDeleteModal(false);
        }
    };

    const handleSaveLecture = (values) => {
        if (lectureModal.isEditable) {
            setLectures((prevLectures) =>
                prevLectures.map((lec) => (lec.id === lectureModal.lectureId ? { ...lec, ...values } : lec))
            );
        } else {
            const newLecture = { ...values, id: Date.now() };
            setLectures((prevLectures) => [...prevLectures, newLecture]);
        }
        resetLectureModal();
    };

    const resetLectureModal = () => {
        setLectureModal({
            show: false,
            title: '',
            isEditable: false,
            lectureId: null,
            initialValues: null
        });
    };

    const handleUploadFilesSubmit = (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            // Implement form submission logic here
            onNext();
            resetForm();
            setSubmitting(false);
        }, 1000);
    };

    return (
        <>
            {lectureModal.show && (
                <CoursesModal
                    size="large"
                    show={lectureModal.show}
                    onClose={resetLectureModal}
                    title={lectureModal.title}
                >
                    <AddLectureModal
                        lectureModal={lectureModal}
                        resetModal={resetLectureModal}
                        onSave={handleSaveLecture}
                    />
                </CoursesModal>
            )}
            {showDeleteModal && (
                <ConfirmationBox
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    loading={loadingCRUD}
                    title="Delete Lecture"
                    body="Are you sure you want to delete this Lecture?"
                    onConfirm={handleDeleteSubmit}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-button"
                    activeBtn="delete-button"
                    activeBtnTitle="Delete"
                />
            )}
            <div className="upload-form-section">
                <div className="section-title">
                    <p>Upload Files</p>
                </div>
                <div className="upload-course-form">
                    <Formik
                        initialValues={coachData}
                        validationSchema={Yup.object({
                            courseDescription: Yup.string()
                        })}
                        onSubmit={handleUploadFilesSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col xs={12} sm={12} md={12} lg={6}>
                                        {coursePhoto ? (
                                            <></>
                                        ) : (
                                            <label className="title-thumbnail">Course Thumbnail</label>
                                        )}
                                        <Field name="coursePhoto">
                                            {({ field }) => (
                                                <>
                                                    <input
                                                        ref={inputRef}
                                                        accept=".jpg,.jpeg,.png"
                                                        {...field}
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                    />
                                                    {coursePhoto ? (
                                                        <div className="image-renderer">
                                                            <img
                                                                src={
                                                                    typeof coursePhoto === 'string'
                                                                        ? coursePhoto
                                                                        : URL.createObjectURL(coursePhoto)
                                                                }
                                                                alt=""
                                                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                                            />
                                                            <span>{coursePhoto.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="image-preview">
                                                            <img src={thumbnail} alt="thumbnail" />
                                                            <div className="image-preview-text">
                                                                <div>
                                                                    <p>Upload your course Thumbnail here.</p>
                                                                    <p>
                                                                        Supported format:
                                                                        <strong>.jpg, .jpeg, or .png</strong>
                                                                    </p>
                                                                </div>

                                                                <Button
                                                                    type="submit"
                                                                    className="upload-btn"
                                                                    disabled={isSubmitting}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        inputRef.current.click();
                                                                    }}
                                                                >
                                                                    Upload{' '}
                                                                    <img
                                                                        className="mb-1"
                                                                        src={UploadSimple}
                                                                        alt="Upload Btn"
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={6}>
                                        {courseVideo ? <></> : <label className="field-label">Course Trailer</label>}
                                        <Field name="coursePhoto">
                                            {({ field }) => (
                                                <>
                                                    <input
                                                        ref={videoinputRef}
                                                        accept="video/*"
                                                        {...field}
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={handleVideoChange}
                                                    />
                                                    {courseVideo ? (
                                                        <div className="image-renderer">
                                                            {/* Display uploaded video */}
                                                            <video controls>
                                                                <source
                                                                    src={URL.createObjectURL(courseVideo)}
                                                                    type={courseVideo.type}
                                                                />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                            <span>{courseVideo.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="image-preview">
                                                            <img src={VideoIcon} alt="" />
                                                            <div className="image-preview-text">
                                                                <span>
                                                                    Upload your course video here.
                                                                    <br />
                                                                    Supported formats: <strong>
                                                                        MP4, WebM, Ogg,
                                                                    </strong>{' '}
                                                                    etc.
                                                                </span>
                                                                <Button
                                                                    type="submit"
                                                                    className="upload-btn"
                                                                    disabled={isSubmitting}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        videoinputRef.current.click();
                                                                    }}
                                                                >
                                                                    Upload{' '}
                                                                    <img
                                                                        className="mb-1"
                                                                        src={UploadSimple}
                                                                        alt="Upload Btn"
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <label className="field-label">Course Description</label>
                                        <Field
                                            name="courseDescription"
                                            value={values.courseDescription}
                                            as="textarea"
                                            placeholder="Enter Course Description"
                                            render={({ field }) => (
                                                <ReactQuill
                                                    {...field}
                                                    value={field.value || ''}
                                                    name={field.name}
                                                    onChange={(value) => field.onChange(field.name)(value)} // Update the form value
                                                    className="field-quill-control"
                                                    modules={{ toolbar: true }}
                                                />
                                            )}
                                        />
                                        <ErrorMessage name="courseDescription" component="div" className="error" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Container>
                                        <div className="add-lecture-section">
                                            <div className="add-lecture-nav">
                                                <div className="d-flex gap-2">
                                                    <img src={menuIcon} alt="menu" />
                                                    <p>Add Lectures</p>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <img
                                                        className="cursor-pointer"
                                                        src={plusIcon}
                                                        alt="menu"
                                                        onClick={handleCreateClick}
                                                    />
                                                </div>
                                            </div>
                                            {lectures.map((lecture) => (
                                                <div key={lecture.id} className="add-lecture-item mb-3">
                                                    <div className="items-text d-flex gap-2">
                                                        <img src={menuIcon} alt="menu" />
                                                        <p className="items-text-title">
                                                            {lecture.lectureName} (
                                                            <span className="">
                                                                {trimLongText(lecture.lectureDescription, 20)}
                                                            </span>
                                                            )
                                                        </p>
                                                    </div>
                                                    <div className="items-button">
                                                        <Button type="button" className="quiz-btn">
                                                            {lecture.questions.length} Questions Added
                                                        </Button>
                                                        <Button type="button" className="quiz-lec-btn">
                                                            Lecture Video
                                                        </Button>
                                                        <img
                                                            className="cursor-pointer"
                                                            src={PencilLine}
                                                            alt="Edit"
                                                            onClick={() => handleEditClick(lecture.id)}
                                                        />
                                                        <img
                                                            className="cursor-pointer"
                                                            src={trashIconRed}
                                                            alt="Delete"
                                                            onClick={() => handleDeleteClick(lecture.id)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Container>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-between gap-3 flex-wrap">
                                            <Button
                                                type="button"
                                                className="cancel-btn"
                                                disabled={isSubmitting}
                                                onClick={onBack}
                                            >
                                                Back
                                            </Button>
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                Save & Next
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                    {cropping && (
                        <ImageCropper
                            imageSrc={imageSrc}
                            onCropComplete={handleCropComplete}
                            onCancel={() => setCropping(false)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default UploadFiles;
