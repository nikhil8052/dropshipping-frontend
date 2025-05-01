import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import { useEffect, useState } from 'react';
import Loading from '@components/Loading/Loading';
import '../../../styles/Common.scss';
import '../../../styles/Courses.scss';
import deleteIcon from '@icons/trash-2.svg';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import TextField from '@mui/material/TextField';
import './CourseNew.scss';
import CourseCategory from './CourseCategory'; // Import the new component
import CourseAccessType from './CourseAccessType'; // Import the new component
import CourseThumbnail from './CourseThumbnail'; // Import the new component

const BasicInformation = ({ initialData, setStepComplete, createOrUpdateCourse, resetStep, onDelete, id , ...rest }) => {
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const currentCourse = useSelector((state) => state?.root?.currentCourse);

    const [publishCourseModel, setPublishCourseModel] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);

    // New state for category creation modal
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const schema = Yup.object({
        title: Yup.string().required('Please enter the course title'),
        subtitle: Yup.string().optional(),
        description: Yup.string().optional(),
        access_type: Yup.string().required('Please select an access type'),
        category: Yup.array().optional(),
        thumbnail: Yup.string().required('Please enter the thumbnail.')
        // category: Yup.array().min(1, 'Please select at least one category'),
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            setLoading(true);
            // Create the course
            const formData = {
                ...values,
                category: values.category.map((cat) => (typeof cat === 'object' ? cat.value : cat)),
                status: 'draft'
            };
            await createOrUpdateCourse(formData);

            setStepComplete('step1');
            setSubmitting(false);
            setLoading(false);
            setPublishCourseModel(false);
            resetForm();
        } catch (error) {
            setSubmitting(false);
            setLoading(false);
            resetStep();
        }
    };

    // for Confirmation model :
    const handlePublishCourseModal = () => {
        setPublishCourseModel(false);
    };
    const setShowConfirmModal = (e) => {
        e.stopPropagation();
        setPublishCourseModel(true);
    };
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="add-course-form-section">
                    <div className="add-course-form Course-form">
                        <Formik
                            initialValues={{
                                title: initialData?.title || '',
                                subtitle: initialData?.subtitle || '',
                                thumbnail: initialData?.thumbnail || '',
                                access_type: initialData?.access_type || 'category',
                                category: initialData?.category || [],
                                description: initialData?.description || ''
                            }}
                            validationSchema={Yup.object({
                                title: Yup.string().required('Please enter the course title'),
                                subtitle: Yup.string().optional(),
                                // description: Yup.string().optional(),
                                access_type: Yup.string().required('Please select an access type'),
                                category: Yup.array().optional(),
                                thumbnail: Yup.string().required('Please upload the thumbnail.'),
                                description: Yup.string().nullable()
                                // thumbnail: Yup.mixed().nullable(),
                            })}
                            // validationSchema={schema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, handleSubmit, setFieldValue,setFieldTouched, validateForm, values }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12} xs={12} className="form-group">
                                            <TextField
                                                name="title"
                                                label="Title"
                                                className="field-control"
                                                variant="outlined"
                                                id="Title-basic"
                                                type="text"
                                                value={values.title}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 100) {
                                                        setFieldValue('title', e.target.value);
                                                    }
                                                }}
                                                helperText={`${values.title?.length || 0}/100`}
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth
                                            />
                                            <ErrorMessage name="title" component="div" className="error" />
                                        </Col>

                                        <Col md={12} xs={12} className="form-group">
                                            <TextField
                                                name="subtitle"
                                                label="Subtitle"
                                                className="field-control"
                                                variant="outlined"
                                                value={values.subtitle}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 120) {
                                                        setFieldValue('subtitle', e.target.value);
                                                    }
                                                }}
                                                helperText={`${values.subtitle?.length || 0}/120`}
                                                inputProps={{ maxLength: 120 }}
                                                fullWidth
                                            />
                                            <ErrorMessage name="subtitle" component="div" className="error" />
                                        </Col>

                                        <Col md={12} xs={12} className="form-group">
                                            <TextField
                                                name="description"
                                                label="Course Description"
                                                className="field-control"
                                                variant="outlined"
                                                multiline
                                                id="Description-basic"
                                                rows={7}
                                                value={values.description}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 500) {
                                                        setFieldValue('description', e.target.value);
                                                    }
                                                }}
                                                helperText={`${values.description?.length || 0}/500`}
                                                inputProps={{ maxLength: 500 }}
                                                fullWidth
                                            />
                                            <ErrorMessage name="description" component="div" className="error" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} xs={12}>
                                            <Field name="access_type">
                                                {({ field, form }) => (
                                                    <>
                                                        <CourseAccessType
                                                            value={field.value}
                                                            onChange={(value) => form.setFieldValue(field.name, value)}
                                                        />
                                                        <ErrorMessage
                                                            name="access_type"
                                                            component="div"
                                                            className="error"
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} xs={12}>
                                            {/* Replace the old Input with the new CourseCategory component */}
                                            <Field name="category">
                                                {({ field, form }) => (
                                                    <CourseCategory
                                                        value={field.value}
                                                        onChange={(value) => form.setFieldValue(field.name, value)}
                                                        token={userToken}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="category" component="div" className="error" />
                                        </Col>
                                    </Row>

                                    <Row className="mb-4">
                                        <Col md={12}>
                                            <Field name="thumbnail">
                                                {({ field }) => (
                                                    <CourseThumbnail
                                                        value={field.value}
                                                        onChange={field.onChange(field.name)}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="thumbnail" component="div" className="error" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {/* <div className="mt-3 d-flex justify-content-between gap-3">
                                                <Button
                                                    type="button"
                                                    onClick={() => navigate(`/${role}/courses-supabase`)}
                                                    className="cancel-btn"
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Save Changes...' : 'Save & Next'}
                                                </Button>
                                            </div> */}
                                            <div className="">
                                                <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                                                    <Button
                                                        type="button"
                                                        className="cancel-btn"
                                                        onClick={() => navigate(`/${role}/courses-supabase`)}
                                                        disabled={isSubmitting}
                                                        // onClick={onBack}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        className="submit-btn"
                                                        disabled={isSubmitting}
                                                        onClick={ async () => {
                                                            const fields = ['title', 'subtitle', 'thumbnail', 'access_type', 'category', 'description'];

                                                            // Mark all fields as touched so errors appear
                                                            fields.forEach((field) => setFieldTouched(field, true, true));
                                                    
                                                            // Trigger validation
                                                            const errors = await validateForm();
                                                    
                                                            // If no errors, open modal
                                                            if (Object.keys(errors).length === 0) {
                                                                setPublishCourseModel(true);
                                                            }
                                                        }}
                                                    >
                                                        Save & Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    {publishCourseModel && (
                                        <ConfirmationBox
                                            show={publishCourseModel}
                                            onClose={handlePublishCourseModal}
                                            onConfirm={handleSubmit}
                                            title={id ? "Course Updated!" :"Course Created!"}
                                            // body="Are you sure you want to delete this course? Data associated with this course will be lost."
                                            loading={loadingCRUD}
                                            customFooterClass="custom-footer-class"
                                            nonActiveBtn="cancel-btn"
                                            activeBtn="submit-btn"
                                            cancelButtonTitle="Cancel"
                                            activeBtnTitle="Proceed"
                                            modalClassName="coursemodal publishcourse"
                                        />
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            <Tooltip id="my-tooltip2" />
        </>
    );
};

export default BasicInformation;
