import { useEffect, useRef, useState } from 'react';
import { Form as FormikForm, Formik, Field, ErrorMessage, FieldArray } from 'formik';
import { Row, Col, Button, ProgressBar, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-hot-toast';
import bluePlus from '@icons/blue-plus.svg';
import { FileUploader } from 'react-drag-drop-files';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import courseThumbnail from '../../../assets/icons/Thumbnail.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import { useSelector } from 'react-redux';
import { Upload } from 'tus-js-client';
import { FORMATS, TOOLBAR_CONFIG, trimLongText } from '../../../utils/common';
import { getFileObjectFromBlobUrl, stripHtmlTags } from '../../../utils/utils';
import cross from '@icons/red-cross.svg';
import UploadSimple from '@icons/UploadSimple.svg';
import ImageCropper from '../../../components/ImageMask/ImageCropper';
import '../../../styles/Courses.scss';
import Input from '@components/Input/Input';

const AddLectureModal = ({ lectureModal, resetModal, onSave }) => {

   
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const token = useSelector((state) => state?.auth?.userToken);
    const fileTypes = ['pdf', 'mp4', 'avi', 'mov'];
    const inputRef = useRef();
    const fileRef = useRef(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [cropping, setCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [loadingThum, setLoadingThumb] = useState(false);
    const [thumbnail, setThumbnail] = useState('');
    const [dataType, setDataType] = useState('');

    const [initialValues, setInitialValues] = useState(
        lectureModal.initialValues || {
            name: '',
            description: '',
            isTopic:false,
            topicId: '',
            topics: [],
            quiz: {
                mcqs: [
                    {
                        question: '',
                        options: ['', '', '', '']
                    }
                ]
            },
            file: null,
            vimeoLink: null,
            vimeoVideoData: null
        }
    );

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Lecture name is required'),
        description: Yup.string().required('Lecture description is required'),
        quiz: Yup.object()
            .optional()
            .shape({
                mcqs: Yup.array()
                    .optional()
                    .of(
                        Yup.object().shape({
                            question: Yup.string().when('options', {
                                is: (options) => options && options.length > 0,
                                then: () => Yup.string().required('Question is required when options are provided'),
                                otherwise: () => Yup.string().optional()
                            }),
                            options: Yup.array()
                                .of(Yup.string().optional())
                                // Commenting for future edge case handle
                                .test('unique-options', 'Options must be unique', (options) => {
                                    // Set for lower case as well
                                    const uniqueOptions = new Set(options.map((option) => option?.toLowerCase()));
                                    return uniqueOptions.size === options.length;
                                })
                        })
                    )
            }),
        file: Yup.mixed().nullable(), // Allowing it to be null
        vimeoLink: Yup.string()
            .optional()
            .nullable()
            // .matches(/^https:\/\/player\.vimeo\.com\/video\/\d+$/, 'Please provide a valid Vimeo link')
            .matches(
                /^https:\/\/(player\.)?vimeo\.com(\/video)?\/\d+$/,
                'Please provide a valid Vimeo link in the format https://vimeo.com/{id} or https://player.vimeo.com/video/{id}'
            )
            .test('file-or-link', 'Either file or Vimeo link is required', function (value) {
                const { file } = this.parent;
                const isVimeo = initialValues.vimeoVideoData;
                return !!isVimeo || !!file || !!value;
            })
    });

    useEffect(() => {
        if (lectureModal.isEditable) fetchLectureDetail(lectureModal.lectureId);
    }, [lectureModal.lectureId, lectureModal.isEditable]);

    const fetchLectureDetail = async () => {
        try {
            setLoading(true);
            const response = await axiosWrapper(
                'GET',
                API_URL.GET_LECTURE.replace(':id', lectureModal.lectureId),
                {},
                token
            );

            const description = stripHtmlTags(response.data?.description);

            const lectureDetail = {
                name: response.data?.name,
                description: description,
                quiz: response.data?.quiz,
                file: response.data?.file,
                vimeoLink: response.data.vimeoLink,
                vimeoVideoData: response.data?.vimeoVideoData,
                _id: response.data?._id
            };
            setInitialValues(lectureDetail);
            setThumbnail(response.data?.thumbnail);
            setDataType(response.data?.dataType);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    // Commenting for future use
    // const handleSubmit = async (values, { setSubmitting }) => {
    //     setSubmitting(true);
    //     try {
    //         // set the correctAnswer to the last option
    //         values.quiz.mcqs.forEach((mcq) => {
    //             mcq.correctAnswer = mcq.options[3];
    //         });

    //         let formData = { ...values, courseId: lectureModal.courseId };

    //         if (formData.file && formData?.file.type === 'document') {
    //             formData = { ...values, courseId: lectureModal.courseId, file: formData.file.path };
    //             formData.dataType = 'file';
    //         } else if (formData?.vimeoLink) {
    //             if (thumbnail) {
    //                 const filePath = 'uploads' + thumbnail.split('/uploads')[1];
    //                 formData.thumbnail = filePath;
    //             }
    //             formData.dataType = 'vimeoLink';
    //             delete formData.file;
    //         } else {
    //             if (thumbnail) {
    //                 const filePath = 'uploads' + thumbnail.split('/uploads')[1];
    //                 formData.thumbnail = filePath;
    //             }

    //             formData.dataType = 'video';
    //             if (lectureModal.isEditable && values.file.name !== initialValues?.vimeoVideoData?.fileInfo?.name) {
    //                 setUploading(false);
    //             } else {
    //                 setUploading(true);
    //             }

    //             delete formData.file;
    //         }

    //         const query =
    //             formData.file || formData?.vimeoLink
    //                 ? ''
    //                 : (values.file &&
    //                       `?size=${values.file.size}&type=${values.file.type}&description=${formData.description}&name=${formData.name}&fileName=${values.file.name}`) ||
    //                   '';

    //         const url = lectureModal.isEditable
    //             ? API_URL.UPDATE_LECTURE.replace(':id', lectureModal.lectureId) + query
    //             : `${API_URL.ADD_LECTURE}` + query;

    //         const method = lectureModal.isEditable ? 'PUT' : 'POST';

    //         const response = await axiosWrapper(method, url, formData, token);
    //         // Video upload
    //         // check if the file is not a new file then do not call the upload function

    //         if (response.data.vimeoVideoData) {
    //             const { upload_link: uploadLink } = response.data.vimeoVideoData.upload;
    //             const upload = new Upload(values.file, {
    //                 endpoint: uploadLink,
    //                 uploadUrl: uploadLink,
    //                 retryDelays: [0, 3000, 5000, 10000, 20000],
    //                 metadata: {
    //                     filename: values.file.name,
    //                     filetype: values.file.type
    //                 },
    //                 onError: () => {
    //                     toast.error('Upload failed. Please try again.');
    //                     setUploading(false);
    //                     setSubmitting(false);
    //                     resetModal();
    //                 },
    //                 onProgress: (bytesUploaded, bytesTotal) => {
    //                     const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    //                     setUploadProgress(percentage);
    //                 },
    //                 onSuccess: () => {
    //                     toast.success('Lecture Uploaded Successfully');
    //                     setUploading(false);
    //                     onSave();
    //                     resetModal();
    //                     setSubmitting(false);
    //                 }
    //             });
    //             upload.start();
    //         } else {
    //             setUploading(false);
    //             onSave();
    //             resetModal();
    //             setSubmitting(false);
    //         }
    //     } catch (error) {
    //         setSubmitting(false);
    //         setUploading(false);
    //         resetModal();
    //     }
    // };

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);

        try {
            // Prepare form data
            const formData = prepareFormData(values);

            // Build query string if needed
            const query = formData.file || formData.vimeoLink ? '' : createQueryString(values.file, formData);

            // Get the appropriate API URL
            const url = getApiUrl(lectureModal.isEditable, lectureModal.lectureId, query);
            const method = lectureModal.isEditable ? 'PUT' : 'POST';

            // Make the API call
            const response = await axiosWrapper(method, url, formData, token);

            // Handle Vimeo upload if needed
            if (response.data.vimeoVideoData) {
                if (response?.new) {
                    setUploading(true);
                }
                await handleVimeoUpload(response.data.vimeoVideoData.upload.upload_link, values.file);
            } else {
                finalizeUpload(false);
                setSubmitting(false);
            }
        } catch (error) {
            if (
                error?.desc === "The requested video couldn't be found." ||
                error.desc === 'Video not found in that account'
            ) {
                // Exception (do not close the modal)
                return null;
            } else {
                handleError();
                setSubmitting(false);
            }
        }
    };

    // Helper functions
    const prepareFormData = (values) => {
        values.quiz.mcqs.forEach((mcq) => {
            mcq.correctAnswer = mcq.options[3]; // Set correctAnswer to the last option
        });

        let formData = { ...values, courseId: lectureModal.courseId };

        if (dataType === 'file') {
            formData = { ...formData, file: formData.file.path, dataType };
        } else if (dataType === 'video') {
            formData = prepareVideoData(formData, values.file);
        } else {
            formData = prepareVimeoData(formData);
        }

        return formData;
    };

    const prepareVimeoData = (formData) => {
        // Check if the Vimeo link exists and is in the vimeo.com format
        if (formData.vimeoLink && formData.vimeoLink.includes('https://vimeo.com')) {
            // Extract the Vimeo ID from the link
            const vimeoId = formData.vimeoLink.split('https://vimeo.com/')[1];
            // Reformat the link to the embedded format
            formData.vimeoLink = `https://player.vimeo.com/video/${vimeoId}`;
        }

        if (thumbnail && thumbnail.includes('/uploads')) {
            formData.thumbnail = extractFilePath(thumbnail);
        }
        delete formData.file;
        formData.dataType = 'vimeoLink';

        return formData;
    };

    const prepareVideoData = (formData, file) => {
        if (thumbnail && thumbnail.includes('/uploads')) {
            formData.thumbnail = extractFilePath(thumbnail);
        }
        formData.dataType = 'video';

        if (lectureModal.isEditable && file.name !== initialValues?.vimeoVideoData?.fileInfo?.name) {
            setUploading(false);
        } else {
            setUploading(true);
        }

        delete formData.file;
        return formData;
    };

    const createQueryString = (file, formData) => {
        return (
            file &&
            `?size=${file.size}&type=${file.type}&description=${formData.description}&name=${formData.name}&fileName=${file.name}`
        );
    };

    const getApiUrl = (isEditable, lectureId, query) => {
        return isEditable
            ? `${API_URL.UPDATE_LECTURE.replace(':id', lectureId)}${query}`
            : `${API_URL.ADD_LECTURE}${query}`;
    };

    const handleVimeoUpload = async (uploadLink, file) => {
        const upload = new Upload(file, {
            endpoint: uploadLink,
            uploadUrl: uploadLink,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
                filename: file.name,
                filetype: file.type
            },
            onError: () => handleError(),
            onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                setUploadProgress(percentage);
            },
            onSuccess: () => finalizeUpload(true)
        });

        upload.start();
    };

    const extractFilePath = (thumbnail) => 'uploads' + thumbnail.split('/uploads')[1];

    const finalizeUpload = (showToast) => {
        if (showToast) {
            toast.success('Lecture Uploaded Successfully');
        }
        setUploading(false);
        onSave();
        resetModal();
    };

    const handleError = () => {
        // Commenting for late use
        // We will just not close the lecture modal on error and not reset the form.
        setUploading(false);
        onSave();
        resetModal();
    };

    // On update lecture we can update it with pdf or vimeo link or anything else

    const handleLectureUpload = async (file, setFieldValue) => {
        if (!file.type.includes('video')) {
            const formData = new FormData();
            formData.append('files', file);
            formData.append('name', file.name);

            const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
            const path = mediaFile.data[0].path;
            setFieldValue('file', {
                path: path,
                name: path.split('-')[1],
                type: 'document'
            });
            // set data type for the file
            setDataType('file');
        } else {
            // Set the video file as it is
            setDataType('video');
            setFieldValue('file', file);
        }
    };

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

    const resetCropper = () => {
        setCropping(false);
        setThumbnail('');
        setImageSrc(null);
        inputRef.current.value = null;
    };

    const handleCropComplete = async (croppedImage) => {
        setLoadingThumb(true);
        const file = await getFileObjectFromBlobUrl(croppedImage, 'lectureThumbnail.jpeg');
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        setThumbnail(mediaFile.data[0].path);
        setCropping(false);
        setLoadingThumb(false);
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        resetModal();
        setShowCancelModal(false);
    };

    const handleCloseModal = () => {
        setShowCancelModal(false);
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="upload-course-form">
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <FormikForm>
                                <Row className="mt-3">
                                    <Col md={12} xs={12}>
=                                        <div className="form-check mb-3">
                                            <Field
                                                type="checkbox"
                                                name="isTopic"
                                                id="isTopic"
                                                checked={values.isTopic}
                                                onChange={(e) => {
                                                  setFieldValue('isTopic', e.target.checked);
                                                }}
                                            />
                                            <label className="form-check-label" >
                                                Add to folder
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                                {values.isTopic && (
                                    <Col md={12} xs={12}>
                                    <label htmlFor="topicSelect" className="form-label">
                                        Select Folder
                                    </label>
                                    <select
                                        id="topicSelect"
                                        name="topicId"
                                      
                                        value={values.topicId}
                                        onChange={(e) => setFieldValue('topicId', e.target.value)}
                                    >
                                        <option value="">-- Select Folder --</option>
                                        {lectureModal.topics.map((topic) => (
                                            <option key={topic._id} value={topic._id}>
                                            {topic.title}
                                            </option>
                                        ))}
                                    </select>
                                    </Col>
                                )}
                                <Row className="mt-3">
                                    <Col md={12} xs={12}>
                                        <Field
                                            name="name"
                                            className="field-control mb-2"
                                            type="text"
                                            placeholder="Type lecture name..."
                                        />
                                        <div className="mb-2">
                                            <ErrorMessage name="name" component="div" className="error" />
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Input
                                            className="field-quill-control"
                                            type="richTextEditor"
                                            name="description"
                                            placeholder="Type lecture description here..."
                                            modules={{
                                                toolbar: TOOLBAR_CONFIG
                                            }}
                                            formats={FORMATS}
                                        />
                                    </Col>
                                </Row>

                                <div className="quiz-wrapper">
                                    <div className="add-quiz-title">
                                        <p> Add Quiz</p>
                                    </div>
                                    <div className="quiz-fields-container">
                                        <FieldArray name="quiz.mcqs">
                                            {({ push, remove }) => (
                                                <div className="add-quiz-fields">
                                                    <div className="add-quiz-label mb-2">
                                                        <p>
                                                            Please Insert MCQs for Student’s personal assessments of
                                                            this course.
                                                        </p>
                                                        <span
                                                            onClick={() =>
                                                                push({
                                                                    question: '',
                                                                    options: ['', '', '', ''],
                                                                    correctAnswer: ''
                                                                })
                                                            }
                                                        >
                                                            <img src={bluePlus} alt="bluePlus" /> Add new
                                                        </span>
                                                    </div>
                                                    {values.quiz.mcqs.map((_, index) => (
                                                        <div key={index} className="add-quiz-question">
                                                            <div className="d-flex align-items-center">
                                                                <Field
                                                                    name={`quiz.mcqs[${index}].question`}
                                                                    className="field-control"
                                                                    type="text"
                                                                    placeholder="Please Type Question Here..."
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-link minus-btn"
                                                                    onClick={() => {
                                                                        remove(index);
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faMinus} color="black" />
                                                                </Button>
                                                            </div>
                                                            <div className="d-flex align-items-center mb-2">
                                                                <ErrorMessage
                                                                    name={`quiz.mcqs[${index}].question`}
                                                                    component="div"
                                                                    className="error"
                                                                />
                                                            </div>
                                                            <div className="quiz-multiple-choice">
                                                                {['option1', 'option2', 'option3', 'option4'].map(
                                                                    (option, optIndex) => (
                                                                        <>
                                                                            <Field
                                                                                key={optIndex}
                                                                                name={`quiz.mcqs[${index}].options[${optIndex}]`}
                                                                                // Also set the correct answer value
                                                                                className={`field-control ${optIndex === 3 ? 'correctAnswer' : ''}`}
                                                                                type="text"
                                                                                placeholder={
                                                                                    optIndex === 3
                                                                                        ? 'Correct option'
                                                                                        : `Type option ${optIndex + 1}`
                                                                                }
                                                                            />
                                                                        </>
                                                                    )
                                                                )}
                                                            </div>
                                                            <ErrorMessage
                                                                name={`quiz.mcqs[${index}].options`}
                                                                component="div"
                                                                className="error"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>
                                </div>
                                {!values?.vimeoLink && (
                                    <>
                                        <div>
                                            <div
                                                className="add-quiz-file cursor-pointer "
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.querySelector('.file-uploader').click();
                                                }}
                                            >
                                                <h4>{lectureModal?.isEditable ? 'Update' : 'Attach'} File</h4>

                                                {(values?.file || initialValues?.vimeoVideoData) && (
                                                    <div
                                                        className="align-self-start"
                                                        style={{
                                                            marginLeft: 'auto'
                                                        }}
                                                    >
                                                        <img
                                                            src={cross}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setInitialValues((pre) => ({
                                                                    ...pre,
                                                                    file: null,
                                                                    vimeoVideoData: null
                                                                }));
                                                                if (fileRef.current) {
                                                                    fileRef.current.value = '';
                                                                }
                                                                setFieldValue('file', null);
                                                            }}
                                                            className="reset-image "
                                                            alt="reset"
                                                        />
                                                    </div>
                                                )}

                                                <FileUploader
                                                    ref={fileRef}
                                                    multiple={false}
                                                    handleChange={(file) => handleLectureUpload(file, setFieldValue)}
                                                    name="file"
                                                    types={fileTypes}
                                                    classes="file-uploader d-none"
                                                />
                                                <p>
                                                    {values?.file || initialValues?.vimeoVideoData ? (
                                                        `File name: ${trimLongText(values?.file?.name, 15) || trimLongText(values?.file?.split('-')[1], 15) || trimLongText(initialValues?.vimeoVideoData?.fileInfo?.name) || ''}`
                                                    ) : (
                                                        <div>
                                                            Drag and drop a file or <strong>browse file</strong>
                                                        </div>
                                                    )}
                                                </p>
                                            </div>
                                            <ErrorMessage name="file" component="div" className="error mt-2" />
                                        </div>
                                    </>
                                )}

                                {!values?.file && !values?.vimeoLink && (
                                    <hr className="hr-text gradient" data-content="OR" />
                                )}
                                {/* Or Upload link here */}
                                {!values?.file && (
                                    <div className="mt-1">
                                        <label htmlFor="vimeoLink" className="field-label">
                                            Vimeo Video Link
                                        </label>
                                        <Field
                                            name="vimeoLink"
                                            className="field-control mb-2"
                                            type="text"
                                            placeholder="https://vimeo.com/1009858724"
                                        />
                                        <div className="mb-2">
                                            <ErrorMessage name="vimeoLink" component="div" className="error" />
                                        </div>
                                    </div>
                                )}
                                {(values?.vimeoLink ||
                                    ((values?.file || initialValues?.vimeoVideoData) &&
                                        values?.file?.type !== 'document')) &&
                                    dataType !== 'file' && (
                                        <Row className="mt-3">
                                            <Col>
                                                {thumbnail ? (
                                                    <></>
                                                ) : (
                                                    <label className="title-thumbnail">Lecture Thumbnail</label>
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
                                                                        onError={(e) => {
                                                                            e.target.onerror = null; // Prevent infinite loop in case the default image fails too
                                                                            e.target.src =
                                                                                'https://i.vimeocdn.com/video/default'; // Set default image
                                                                        }}
                                                                    />
                                                                    <span>Lecture Thumbnail</span>
                                                                    <div
                                                                        className="align-self-start"
                                                                        style={{
                                                                            marginLeft: 'auto'
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={cross}
                                                                            onClick={() => {
                                                                                if (inputRef.current) {
                                                                                    inputRef.current.value = '';
                                                                                }
                                                                                setThumbnail('');
                                                                            }}
                                                                            className="reset-image"
                                                                            alt="reset"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null; // Prevent infinite loop in case the default image fails too
                                                                                e.target.src =
                                                                                    'https://i.vimeocdn.com/video/default'; // Set default image
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="image-preview">
                                                                        <img src={courseThumbnail} alt="thumbnail" />
                                                                        <div className="image-preview-text">
                                                                            <div>
                                                                                <p>
                                                                                    Upload your lecture Thumbnail here.
                                                                                </p>
                                                                                <p>
                                                                                    Supported format:
                                                                                    <strong>
                                                                                        .jpg, .jpeg, or .png
                                                                                    </strong>
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
                                        </Row>
                                    )}
                                {/* Display the uploaded lecture */}
                                {/* Uploaded state of video lecture */}
                                {lectureModal.isEditable &&
                                    initialValues?.vimeoVideoData?.player_embed_url && ( // Display the uploaded lecture
                                        <div className="mt-3">
                                            <h4>Uploaded Lecture</h4>
                                            <div className="uploaded-lecture">
                                                {initialValues?.vimeoVideoData?.status !== 'available' ||
                                                    initialValues?.vimeoVideoData?.transcode?.status !== 'complete' ? (
                                                    <p>
                                                        Lecture is still being processed. Please check back later or
                                                        upload a new lecture
                                                    </p>
                                                ) : initialValues?.vimeoVideoData?.player_embed_url ? (
                                                    <iframe
                                                        src={initialValues?.vimeoVideoData?.player_embed_url}
                                                        width="100%"
                                                        height="400"
                                                        frameBorder="0"
                                                        allow="autoplay; fullscreen; picture-in-picture"
                                                        allowFullScreen
                                                        title="Lecture"
                                                    />
                                                ) : (
                                                    <p>No lecture uploaded yet</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                {/* Uploaded state of vimeo link lecture */}
                                {lectureModal.isEditable &&
                                    initialValues?.vimeoLink && ( // Display the uploaded lecture
                                        <div className="mt-3">
                                            <h4>Uploaded Lecture</h4>
                                            <div className="uploaded-lecture">
                                                <iframe
                                                    src={initialValues?.vimeoLink}
                                                    width="100%"
                                                    height="400"
                                                    frameBorder="0"
                                                    allow="autoplay; fullscreen; picture-in-picture"
                                                    allowFullScreen
                                                    title="Lecture"
                                                />
                                            </div>
                                        </div>
                                    )}
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-between gap-3">
                                            <Button
                                                type="button"
                                                onClick={handleCancelClick}
                                                className="cancel-btn"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                {lectureModal.isEditable ? 'Update' : 'Save'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                                <Modal show={uploading} backdrop="static" keyboard={false} centered>
                                    <Modal.Body className="d-flex flex-column align-items-center">
                                        <h5 className="mb-3">Uploading File</h5>
                                        <ProgressBar
                                            now={uploadProgress}
                                            label={`${uploadProgress}%`}
                                            striped
                                            animated
                                            className="w-100 mb-3"
                                        />
                                        <p>{values.file ? `File: ${trimLongText(values.file.name, 15)}` : ''}</p>
                                    </Modal.Body>
                                </Modal>

                                <Modal show={showCancelModal} onHide={handleCloseModal} centered backdrop="static">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Confirm Cancel</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Are you sure you want to cancel? The lecture data will be lost.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseModal}>
                                            No, go back
                                        </Button>
                                        <Button variant="danger" onClick={handleConfirmCancel}>
                                            Yes, Cancel
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            )}
            {cropping && (
                <ImageCropper imageSrc={imageSrc} onCropComplete={handleCropComplete} onCancel={resetCropper} />
            )}
        </>
    );
};

export default AddLectureModal;
