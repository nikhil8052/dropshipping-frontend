import { useEffect, useRef, useState } from 'react';
import { Form as FormikForm, Formik, Field, ErrorMessage, FieldArray } from 'formik';
import { Row, Col, Button, ProgressBar, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-hot-toast';
import bluePlus from '@icons/blue-plus.svg';
import { FileUploader } from 'react-drag-drop-files';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import { useSelector } from 'react-redux';
import { Upload } from 'tus-js-client';
import { trimLongText } from '../../../utils/common';

const AddLectureModal = ({ lectureModal, resetModal, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const token = useSelector((state) => state?.auth?.userToken);
    const fileTypes = ['pdf', 'docx', 'mp4', 'avi', 'mov'];
    const fileRef = useRef(null);

    const [initialValues, setInitialValues] = useState(
        lectureModal.initialValues || {
            name: '',
            description: '',
            quiz: {
                mcqs: [
                    {
                        question: '',
                        options: ['', '', '', '']
                    }
                ]
            },
            file: null
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
        file: Yup.mixed().required('File is required')
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
            setInitialValues(response.data);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
            // set the correctAnswer to the last option
            values.quiz.mcqs.forEach((mcq) => {
                mcq.correctAnswer = mcq.options[3];
            });
            let formData = { ...values, courseId: lectureModal.courseId };
            if (formData.file.type === 'document') {
                formData = { ...values, courseId: lectureModal.courseId, file: formData.file.path };
            } else {
                setUploading(true);
                delete formData.file;
            }
            const query = formData.file
                ? ''
                : `?size=${values.file.size}&type=${values.file.type}&description=${formData.description}&name=${formData.name}`;

            const url = lectureModal.isEditable
                ? API_URL.UPDATE_LECTURE.replace(':id', lectureModal.lectureId) + query
                : `${API_URL.ADD_LECTURE}` + query;
            const method = lectureModal.isEditable ? 'PUT' : 'POST';
            const response = await axiosWrapper(method, url, formData, token);
            // Video upload
            if (response.data.vimeoVideoData) {
                const { upload_link: uploadLink } = response.data.vimeoVideoData.upload;
                const upload = new Upload(values.file, {
                    endpoint: uploadLink,
                    uploadUrl: uploadLink,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    metadata: {
                        filename: values.file.name,
                        filetype: values.file.type
                    },
                    onError: () => {
                        toast.error('Upload failed. Please try again.');
                        setUploading(false);
                        setSubmitting(false);
                        resetModal();
                    },
                    onProgress: (bytesUploaded, bytesTotal) => {
                        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                        setUploadProgress(percentage);
                    },
                    onSuccess: () => {
                        toast.success('Lecture Uploaded Successfully');
                        setUploading(false);
                        onSave();
                        resetModal();
                        setSubmitting(false);
                    }
                });
                upload.start();
            } else {
                setUploading(false);
                onSave();
                resetModal();
                setSubmitting(false);
            }
        } catch (error) {
            setSubmitting(false);
            setUploading(false);
            resetModal();
        }
    };

    const handleLectureUpload = async (file, setFieldValue) => {
        if (lectureModal.isEditable && initialValues?.vimeoVideoData) {
            if (!file.type.includes('video')) {
                toast.error('Please upload a video file');
                return;
            }
        }

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
        } else {
            // Set the video file as it is
            setFieldValue('file', file);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <FormikForm>
                            <Row>
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

                            <Row>
                                <Col md={12} xs={12}>
                                    <Field
                                        name="description"
                                        className="field-text-area-control mb-0"
                                        as="textarea"
                                        placeholder="Type lecture description here..."
                                        rows="6"
                                    />
                                    <div className="mb-2">
                                        <ErrorMessage name="description" component="div" className="error" />
                                    </div>
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
                                                        Please Insert MCQs for Student’s personal assessments of this
                                                        course.
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
                            <div>
                                <div
                                    className="add-quiz-file cursor-pointer "
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector('.file-uploader').click();
                                    }}
                                >
                                    <h4>{lectureModal?.isEditable ? 'Update' : 'Attach'} File</h4>
                                    <FileUploader
                                        ref={fileRef}
                                        multiple={false}
                                        handleChange={(file) => handleLectureUpload(file, setFieldValue)}
                                        name="file"
                                        types={fileTypes}
                                        classes="file-uploader d-none"
                                    />
                                    <p>
                                        {values.file ? (
                                            `File name: ${trimLongText(values.file.name, 15) || trimLongText(values.file.split('-')[1], 15)}`
                                        ) : (
                                            <div>
                                                Drag and drop a file or <strong>browse file</strong>
                                            </div>
                                        )}
                                    </p>
                                </div>
                                <ErrorMessage name="file" component="div" className="error mt-2" />
                            </div>
                            {/* Display the uploaded lecture */}

                            {lectureModal.isEditable &&
                                initialValues?.vimeoVideoData?.player_embed_url && ( // Display the uploaded lecture
                                    <div className="mt-3">
                                        <h4>Uploaded Lecture</h4>
                                        <div className="uploaded-lecture">
                                            {initialValues?.vimeoVideoData?.status !== 'available' ||
                                            initialValues?.vimeoVideoData?.transcode?.status !== 'complete' ? (
                                                <p>
                                                    Lecture is still being processed. Please check back later or upload
                                                    a new lecture
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

                            <Row>
                                <Col>
                                    <div className="mt-3 d-flex justify-content-between gap-3">
                                        <Button
                                            type="button"
                                            onClick={() => resetModal()}
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
                        </FormikForm>
                    )}
                </Formik>
            )}
        </>
    );
};

export default AddLectureModal;
