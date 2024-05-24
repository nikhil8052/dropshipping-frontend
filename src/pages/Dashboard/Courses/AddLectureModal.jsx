import { useEffect, useState } from 'react';
import { Form as FormikForm, Formik, Field, ErrorMessage, FieldArray } from 'formik';
import { Row, Col, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-hot-toast';
import bluePlus from '@icons/blue-plus.svg';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddLectureModal = ({ lectureModal, resetModal, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const fileTypes = ['JPEG', 'PNG', 'GIF', 'pdf', 'docx'];

    const [initialValues, setInitialValues] = useState(
        lectureModal.initialValues || {
            lectureName: '',
            lectureDescription: '',
            questions: [''],
            optionalQuestions: [{ question: '', option1: '', option2: '', option3: '', option4: '' }],
            file: null
        }
    );

    const validationSchema = Yup.object().shape({
        lectureName: Yup.string().required('Lecture name is required'),
        lectureDescription: Yup.string().required('Lecture description is required'),
        questions: Yup.array(),
        optionalQuestions: Yup.array().of(
            Yup.object().shape({
                question: Yup.string(),
                option1: Yup.string(),
                option2: Yup.string(),
                option3: Yup.string(),
                option4: Yup.string()
            })
        ),
        file: Yup.mixed()
    });

    useEffect(() => {
        if (lectureModal.isEditable) fetchLectureDetail(lectureModal.lectureId);
    }, [lectureModal.lectureId, lectureModal.isEditable]);

    const fetchLectureDetail = async () => {
        try {
            setLoading(true);
            // Dummy API call
            await delayedSetLecture();
            setInitialValues(lectureModal.initialValues);
            // return lectureId;
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const delayedSetLecture = async () => {
        await new Promise((resolve) => {
            setTimeout(() => {
                setInitialValues(lectureModal.initialValues);
                resolve();
            }, 1000);
        });
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            // Commenting for future use
            // const { method, endpoint } = getRequestMeta(lectureModal.isEditable);
            // Submit request here
            // const data = await axiosWrapper(method, endpoint, values);
            toast.success(lectureModal.isEditable ? 'Lecture updated successfully' : 'Lecture created successfully');
            onSave(values);
        } catch (error) {
            setSubmitting(false);
        } finally {
            resetModal();
        }
    };

    // const getRequestMeta = (isEditable) => {
    //     if (isEditable) {
    //         return { method: 'PUT', endpoint: '/lectures/some-id' };
    //     }
    //     return { method: 'POST', endpoint: '/lectures' };
    // };

    const handleFileChange = (file) => {
        setFile(file);
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
                                        name="lectureName"
                                        className="field-control"
                                        type="text"
                                        placeholder="Type lecture name..."
                                    />
                                    <ErrorMessage name="lectureName" component="div" className="error" />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} xs={12}>
                                    <Field
                                        name="lectureDescription"
                                        className="field-text-area-control"
                                        as="textarea"
                                        placeholder="Type lecture description here..."
                                        rows="6"
                                    />
                                    <ErrorMessage name="lectureDescription" component="div" className="error" />
                                </Col>
                            </Row>

                            <div className="quiz-wrapper">
                                <div className="add-quiz-title">
                                    <p> Add Quiz</p>
                                </div>
                                <div className="quiz-fields-container">
                                    <FieldArray name="questions">
                                        {({ push, remove }) => (
                                            <div className="add-quiz-fields">
                                                <div className="add-quiz-label">
                                                    <p>
                                                        Please Insert questions for Student’s personal assessments of
                                                        this course.
                                                    </p>
                                                    <span onClick={() => push('')}>
                                                        <img src={bluePlus} alt="bluePlus" /> Add new
                                                    </span>
                                                </div>
                                                <div className="add-quiz-question">
                                                    {values.questions.map((_, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-3">
                                                            <Field
                                                                name={`questions[${index}]`}
                                                                className="field-control"
                                                                type="text"
                                                                placeholder="Please Type Question Here..."
                                                            />
                                                            <ErrorMessage
                                                                name={`questions[${index}]`}
                                                                component="div"
                                                                className="error"
                                                            />
                                                            <Button
                                                                type="button"
                                                                className="btn btn-link minus-btn"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <FontAwesomeIcon icon={faMinus} color="black" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>

                                    <FieldArray name="optionalQuestions">
                                        {({ push, remove }) => (
                                            <div className="add-quiz-fields">
                                                <div className="add-quiz-label">
                                                    <p>
                                                        Please Insert MCQs for Student’s personal assessments of this
                                                        course.
                                                    </p>
                                                    <span
                                                        onClick={() =>
                                                            push({
                                                                question: '',
                                                                option1: '',
                                                                option2: '',
                                                                option3: '',
                                                                option4: ''
                                                            })
                                                        }
                                                    >
                                                        <img src={bluePlus} alt="bluePlus" /> Add new
                                                    </span>
                                                </div>
                                                {values.optionalQuestions.map((_, index) => (
                                                    <div key={index} className="add-quiz-question mb-3">
                                                        <div className="d-flex align-items-center mb-3">
                                                            <Field
                                                                name={`optionalQuestions[${index}].question`}
                                                                className="field-control"
                                                                type="text"
                                                                placeholder="Please Type Question Here..."
                                                            />
                                                            <ErrorMessage
                                                                name={`optionalQuestions[${index}].question`}
                                                                component="div"
                                                                className="error"
                                                            />
                                                            <Button
                                                                type="button"
                                                                className="btn btn-link minus-btn"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <FontAwesomeIcon icon={faMinus} color="black" />
                                                            </Button>
                                                        </div>
                                                        <div className="quiz-multiple-choice">
                                                            <Field
                                                                name={`optionalQuestions[${index}].option1`}
                                                                className="field-control"
                                                                type="text"
                                                                placeholder="Type option 1"
                                                            />
                                                            <Field
                                                                name={`optionalQuestions[${index}].option2`}
                                                                className="field-control"
                                                                type="text"
                                                                placeholder="Type option 2"
                                                            />
                                                            <Field
                                                                name={`optionalQuestions[${index}].option3`}
                                                                className="field-control"
                                                                type="text"
                                                                placeholder="Type option 3"
                                                            />
                                                            <div className="correct-answer">
                                                                <Field
                                                                    name={`optionalQuestions[${index}].option4`}
                                                                    className="field-control"
                                                                    type="text"
                                                                    placeholder="Type Correct Answer"
                                                                />
                                                            </div>
                                                        </div>
                                                        <ErrorMessage
                                                            name={`optionalQuestions[${index}].option4`}
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

                            <div className="add-quiz-file">
                                <h4>Attach File</h4>
                                <FileUploader
                                    multiple={true}
                                    handleChange={(file) => {
                                        setFieldValue('file', file);
                                        handleFileChange(file);
                                    }}
                                    name="file"
                                    types={fileTypes}
                                />
                                <p>{file ? `File name: ${file[0].name}` : 'Drag and drop a file or browse file'}</p>
                            </div>

                            <Row>
                                <Col>
                                    <div className="mt-3 d-flex justify-content-between gap-3">
                                        <Button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="cancel-btn"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <Loading centered size="sm" />
                                            ) : lectureModal.isEditable ? (
                                                'Update'
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </FormikForm>
                    )}
                </Formik>
            )}
        </>
    );
};

export default AddLectureModal;
