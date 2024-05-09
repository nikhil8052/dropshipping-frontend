import { useRef, useState } from 'react';
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
import trashIcon from '../../../assets/icons/Trash.svg';
import plusIcon from '../../../assets/icons/Plus.svg';
import trashIconRed from '../../../assets/icons/Trash-rename.svg';
import PencilLine from '../../../assets/icons/PencilLine.svg';
import Modal from '@components/Modal/Modal';
import AddLectureModal from './AddLectureModal';
import { trimLongText } from '../../../utils/common';
const UploadFiles = () => {
    const inputRef = useRef();
    const videoinputRef = useRef();
    const [coachPhoto, setCoachPhoto] = useState(null);
    const [courseVideo, setCourseVideo] = useState(null);

    const [lectureModal, setLectureModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        studentId: null
    });

    const [coachData, setCoachData] = useState({
        courseDescription: ''
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            // Display an error or handle the invalid file selection
            toast.error('Invalid file selected. Please choose an image file.');
            return;
        }

        const image = new Image();
        image.src = window.URL.createObjectURL(file);
        image.onload = () => {
            const { width, height } = image;
            if (width > 1200 || height > 800) {
                // Display an error or handle the invalid file dimensions
                toast.error('Invalid image dimensions. Please upload an image with 1200x800 pixels.');
                return;
            }

            toast.success('Image uploaded successfully!', {
                icon: '🎉',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            });

            setCoachPhoto(file);
            // Upload File through API
        };
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

    //modal functions

    const handleCreateClick = () => {
        // Handle create button click event here
        setLectureModal({
            show: true,
            title: 'Add lecture',
            isEditable: false,
            studentId: null
        });
    };

    const handleCloseModal = () => {
        resetProductModal();
    };

    const resetProductModal = () => {
        setLectureModal({
            show: false,
            title: '',
            isEditable: false,
            studentId: null
        });
    };

    return (
        <>
            {lectureModal.show && (
                <Modal size="large" show={lectureModal.show} onClose={handleCloseModal} title={lectureModal.title}>
                    <AddLectureModal productModal={lectureModal} resetModal={resetProductModal} />
                </Modal>
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
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            setTimeout(() => {
                                // Implement form submission logic here
                                resetForm();
                                setSubmitting(false);
                            }, 1000);
                        }}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col xs={12} sm={12} md={12} lg={6}>
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
                                                    {coachPhoto ? (
                                                        <div className="image-renderer">
                                                            <img
                                                                src={
                                                                    typeof coachPhoto === 'string'
                                                                        ? coachPhoto
                                                                        : URL.createObjectURL(coachPhoto)
                                                                }
                                                                alt=""
                                                                style={{ borderRadius: '50%' }}
                                                            />
                                                            <span>{coachPhoto.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="image-preview">
                                                            <img src={thumbnail} alt="thumbnail" />
                                                            <div className="image-preview-text">
                                                                <span>
                                                                    Upload your course Thumbnail here.
                                                                    <strong>Important guidelines:</strong>
                                                                    1200x800 pixels or 12:8 Ratio. Supported format:
                                                                    <strong>.jpg, .jpeg, or .png</strong>
                                                                </span>

                                                                <Button
                                                                    type="submit"
                                                                    className="upload-btn"
                                                                    disabled={isSubmitting}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        inputRef.current.click();
                                                                    }}
                                                                >
                                                                    Upload
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={6}>
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
                                                                    <strong>Supported formats:</strong> MP4, WebM, Ogg,
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
                                                                    Upload
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
                                                    <img src={plusIcon} alt="menu" onClick={handleCreateClick} />
                                                    <img src={trashIcon} alt="menu" />
                                                </div>
                                            </div>
                                            {Array.from({ length: 2 }).map((_, index) => (
                                                <div className="add-lecture-item mb-3 ">
                                                    <div className="items-text d-flex gap-2">
                                                        <img src={menuIcon} alt="menu" />
                                                        <p className="items-text-title">
                                                            Add Lectures (
                                                            <span className="">
                                                                {trimLongText(
                                                                    'In this lecture basics of all the elements',
                                                                    20
                                                                )}
                                                            </span>
                                                            )
                                                        </p>
                                                    </div>
                                                    <div className="items-button">
                                                        <Button type="button" className="quiz-btn">
                                                            Quizes Added Successfully
                                                        </Button>
                                                        <Button type="button" className="quiz-lec-btn">
                                                            Lecture 1.mp4
                                                        </Button>
                                                        <img src={PencilLine} alt="PencilLine" />

                                                        <img src={trashIconRed} alt="trashIconRed" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Container>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-between gap-3">
                                            <Button type="button" className="cancel-btn" disabled={isSubmitting}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                {isSubmitting ? 'saving...' : 'Save & Next'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default UploadFiles;
