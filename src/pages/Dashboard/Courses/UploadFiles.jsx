import { useRef, useState } from 'react';
import '../../../styles/Courses.scss';
import { Button, Col, Row, Container } from 'react-bootstrap';
import courseThumbnail from '../../../assets/icons/Thumbnail.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
import { FORMATS, TOOLBAR_CONFIG } from '../../../utils/common';
import { getFileObjectFromBlobUrl } from '../../../utils/utils';
import UploadSimple from '@icons/UploadSimple.svg';
import Loading from '@components/Loading/Loading';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import ImageCropper from '../../../components/ImageMask/ImageCropper';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import * as types from '../../../redux/actions/actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import cross from '@icons/red-cross.svg';
import Input from '../../../components/Input/Input';

const UploadFiles = ({ onNext, onBack, initialData, setStepComplete, updateCourseData }) => {
    const inputRef = useRef();
    const videoinputRef = useRef();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const currentCourse = useSelector((state) => state?.root?.currentCourse);
    const [showDeleteModal, setShowDeleteModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        lectureId: null,
        initialValues: null
    });
    const token = useSelector((state) => state?.auth?.userToken);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [lectureModal, setLectureModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        lectureId: null,
        initialValues: null
    });

    const [loadingThum, setLoadingThumb] = useState(false);
    const [loadingVideo, setLoadingVideo] = useState(false);
    // Course Banner
    const [loadingBanner, setLoadingBanner] = useState(false);
    const bannerInputRef = useRef();
    const [bannerCropping, setBannerCropping] = useState(false);
    const [bannerImageSrc, setBannerImageSrc] = useState(null);

    const [cropping, setCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    const { trailer, description, thumbnail, banner } = initialData;

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

    const handleCropComplete = async (croppedImage) => {
        setLoadingThumb(true);
        const file = await getFileObjectFromBlobUrl(croppedImage, 'courseThumbnail.jpeg');
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        updateCourseData({
            thumbnail: mediaFile.data[0].path
        });
        setCropping(false);
        setLoadingThumb(false);
    };

    const handleVideoChange = async (e) => {
        setLoadingVideo(true);
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('video/')) {
            // Display an error or handle the invalid file selection
            toast.error('Invalid file selected. Please choose a video file.');
            return;
        }

        // Upload File through API
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        updateCourseData({
            trailer: mediaFile.data[0].path
        });
        setLoadingVideo(false);
    };

    const handleBannerChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Invalid file selected. Please choose an image file.');
            return;
        }

        const image = URL.createObjectURL(file);
        setBannerImageSrc(image);
        setBannerCropping(true);
    };

    const handleBannerCropComplete = async (croppedImage) => {
        setLoadingBanner(true);
        const file = await getFileObjectFromBlobUrl(croppedImage, 'courseBanner.jpeg');
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        updateCourseData({ banner: mediaFile.data[0].path });
        setLoadingBanner(false);
        setBannerCropping(false);
    };

    const handleCreateClick = () => {
        setLectureModal({
            show: true,
            title: 'Add Lecture',
            isEditable: false,
            courseId: currentCourse,
            lectureId: null,
            initialValues: {
                name: '',
                description: '',
                quiz: {
                    mcqs: [
                        {
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: ''
                        }
                    ]
                },
                file: null
            }
        });
    };

    const handleEditClick = (id) => {
        const lecture = initialData?.lectures.find((lec) => lec._id === id);
        setLectureModal({
            show: true,
            title: 'Edit Lecture',
            isEditable: true,
            lectureId: id,
            initialValues: lecture
        });
    };

    const handleDeleteClick = (id) => {
        setShowDeleteModal({
            show: true,
            title: 'Delete Lecture',
            isEditable: false,
            lectureId: id,
            initialValues: null
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal({
            show: false,
            title: 'Delete Lecture',
            isEditable: false,
            lectureId: null,
            initialValues: null
        });
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            await axiosWrapper(
                'DELETE',
                `${API_URL.DELETE_LECTURE.replace(':id', showDeleteModal.lectureId)}`,
                {},
                token
            );
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
        } catch (error) {
            return;
        } finally {
            setLoadingCRUD(false);
            setShowDeleteModal({
                show: false,
                title: 'Delete Lecture',
                isEditable: false,
                lectureId: null,
                initialValues: null
            });
        }
    };

    const handleSaveLecture = () => {
        dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'lectureUpdate', data: true } });
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

    const handleUploadFilesSubmit = async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true);
        const formData = { ...values };
        if (currentCourse) {
            await axiosWrapper('PUT', `${API_URL.UPDATE_COURSE.replace(':id', currentCourse)}`, formData, token);
            // Handle next
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
            setStepComplete('step2');
            setSubmitting(false);
            setLoading(false);
            onNext();
            resetForm();
        }
    };

    const resetCropper = () => {
        setCropping(false);
        updateCourseData({
            thumbnail: ''
        });
        setImageSrc(null);
        inputRef.current.value = null;
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
            {showDeleteModal.show && (
                <ConfirmationBox
                    show={showDeleteModal.show}
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
            {loading ? (
                <Loading />
            ) : (
                <div className="upload-form-section">
                    <div className="section-title">
                        <p>Upload Files12</p>
                    </div>
                    <div className="upload-course-form">
                        <Formik
                            initialValues={{
                                description: description || '',
                                thumbnail: thumbnail || '',
                                trailer: trailer || '',
                                banner: banner || ''
                            }}
                            validationSchema={Yup.object({
                                description: Yup.string().required('Description is required'),
                                thumbnail: Yup.string().required('Thumbnail is required'),
                                trailer: Yup.string().optional(),
                                banner: Yup.string().optional()
                            })}
                            onSubmit={handleUploadFilesSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, handleSubmit }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Col xs={12} sm={12} md={12} lg={6}>
                                            {thumbnail ? (
                                                <></>
                                            ) : (
                                                <label className="title-thumbnail">Course Thumbnail</label>
                                            )}
                                            <Field name="thumbnail">
                                                {() => (
                                                    <>
                                                        <input
                                                            ref={inputRef}
                                                            accept=".jpg,.jpeg,.png"
                                                            type="file"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                        />
                                                        {loadingThum ? (
                                                            <Loading />
                                                        ) : thumbnail ? (
                                                            <div className="image-renderer">
                                                                <img
                                                                    src={
                                                                        typeof thumbnail === 'string'
                                                                            ? thumbnail
                                                                            : URL.createObjectURL(thumbnail)
                                                                    }
                                                                    alt=""
                                                                    style={{
                                                                        borderRadius: '50%',
                                                                        objectFit: 'cover',
                                                                        width: '200px',
                                                                        height: '128px'
                                                                    }}
                                                                />
                                                                <span>Course Thumbnail</span>
                                                                <div
                                                                    className="align-self-start"
                                                                    style={{
                                                                        marginLeft: 'auto'
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={cross}
                                                                        onClick={() => {
                                                                            updateCourseData({ thumbnail: null });
                                                                            if (inputRef.current) {
                                                                                inputRef.current.value = '';
                                                                            }
                                                                        }}
                                                                        className="reset-image"
                                                                        alt="reset"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="image-preview">
                                                                    <img src={courseThumbnail} alt="thumbnail" />
                                                                    <div className="image-preview-text">
                                                                        <div>
                                                                            <p>Upload your course Thumbnail here.</p>
                                                                            <p>
                                                                                Supported format:{' '}
                                                                                <strong>.jpg, .jpeg, or .png</strong>{' '}
                                                                                etc.
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
                                                                <ErrorMessage
                                                                    name="thumbnail"
                                                                    component="div"
                                                                    className="error"
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={6}>
                                            {trailer ? <></> : <label className="field-label">Course Trailer</label>}
                                            <Field name="trailer">
                                                {() => (
                                                    <>
                                                        <input
                                                            ref={videoinputRef}
                                                            accept="video/*"
                                                            type="file"
                                                            style={{ display: 'none' }}
                                                            onChange={handleVideoChange}
                                                        />
                                                        {loadingVideo ? (
                                                            <Loading />
                                                        ) : trailer ? (
                                                            <div className="image-renderer">
                                                                {/* Display uploaded video */}
                                                                <video controls>
                                                                    <source
                                                                        src={
                                                                            typeof initialData?.trailer === 'string'
                                                                                ? initialData?.trailer
                                                                                : URL.createObjectURL(
                                                                                      initialData?.trailer
                                                                                  )
                                                                        }
                                                                    />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                                <span>Course Trailer</span>
                                                                <div
                                                                    className="align-self-start"
                                                                    style={{ marginLeft: 'auto' }}
                                                                >
                                                                    <img
                                                                        src={cross}
                                                                        onClick={() => {
                                                                            updateCourseData({ trailer: null });
                                                                            if (videoinputRef.current) {
                                                                                videoinputRef.current.value = '';
                                                                            }
                                                                        }}
                                                                        className="reset-image"
                                                                        alt="reset"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="image-preview">
                                                                    <img src={VideoIcon} alt="" />
                                                                    <div className="image-preview-text">
                                                                        <span>
                                                                            Upload your course Video here.
                                                                            <br />
                                                                            Supported format:{' '}
                                                                            <strong>MP4, WebM, or Ogg</strong> etc.
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
                                                                <ErrorMessage
                                                                    name="trailer"
                                                                    component="div"
                                                                    className="error"
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </Col>
                                    </Row>
                                    {/* Course Banner */}
                                    <Row className="mb-3">
                                        <Col xs={12} sm={12} md={12} lg={6}>
                                            {banner ? <></> : <label className="field-label">Course Banner</label>}
                                            <Field name="banner">
                                                {() => (
                                                    <>
                                                        <input
                                                            ref={bannerInputRef}
                                                            accept=".jpg,.jpeg,.png"
                                                            type="file"
                                                            style={{ display: 'none' }}
                                                            onChange={handleBannerChange}
                                                        />
                                                        {loadingBanner ? (
                                                            <Loading />
                                                        ) : banner ? (
                                                            <div className="image-renderer">
                                                                <img
                                                                    src={
                                                                        typeof banner === 'string'
                                                                            ? banner
                                                                            : URL.createObjectURL(banner)
                                                                    }
                                                                    alt=""
                                                                    style={{
                                                                        borderRadius: '8px',
                                                                        objectFit: 'cover',
                                                                        height: '128px'
                                                                    }}
                                                                />
                                                                <span>Course Banner</span>
                                                                <div
                                                                    className="align-self-start"
                                                                    style={{ marginLeft: 'auto' }}
                                                                >
                                                                    <img
                                                                        src={cross}
                                                                        onClick={() => {
                                                                            updateCourseData({ banner: null });
                                                                            if (bannerInputRef.current) {
                                                                                bannerInputRef.current.value = '';
                                                                            }
                                                                        }}
                                                                        className="reset-image"
                                                                        alt="reset"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="image-preview">
                                                                    <img src={courseThumbnail} alt="banner" />
                                                                    <div className="image-preview-text">
                                                                        <p>Upload your course Banner here.</p>
                                                                        <p>
                                                                            Supported format:{' '}
                                                                            <strong> .jpg, .jpeg, or .png</strong> etc.
                                                                        </p>
                                                                        <Button
                                                                            type="submit"
                                                                            className="upload-btn"
                                                                            disabled={isSubmitting}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                bannerInputRef.current.click();
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
                                                                <ErrorMessage
                                                                    name="banner"
                                                                    component="div"
                                                                    className="error"
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Input
                                                className="field-quill-control"
                                                type="richTextEditor"
                                                name="description"
                                                label="Course Description"
                                                modules={{
                                                    toolbar: TOOLBAR_CONFIG
                                                }}
                                                formats={FORMATS}
                                            />
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
                                                {initialData?.lectures?.map((lecture) => (
                                                    <div key={lecture._id} className="add-lecture-item mb-3">
                                                        <div className="items-text d-flex gap-2">
                                                            <img src={menuIcon} alt="menu" />

                                                            <p className="items-text-title">{lecture.name}</p>
                                                        </div>
                                                        <div className="items-button">
                                                            <Button type="button" className="quiz-btn">
                                                                {lecture.quiz.mcqs.length} Questions Added
                                                            </Button>
                                                            <Button type="button" className="quiz-lec-btn">
                                                                Lecture {lecture?.file ? 'File' : 'Video'}
                                                            </Button>
                                                            <img
                                                                className="cursor-pointer"
                                                                src={PencilLine}
                                                                alt="Edit"
                                                                onClick={() => handleEditClick(lecture._id)}
                                                            />
                                                            <img
                                                                className="cursor-pointer"
                                                                src={trashIconRed}
                                                                alt="Delete"
                                                                onClick={() => handleDeleteClick(lecture._id)}
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
                                onCancel={resetCropper}
                            />
                        )}
                        {bannerCropping && (
                            <ImageCropper
                                imageSrc={bannerImageSrc}
                                onCropComplete={handleBannerCropComplete}
                                onCancel={() => {
                                    setBannerCropping(false);
                                    setBannerImageSrc(null);
                                }}
                                aspect={16 / 10}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default UploadFiles;
