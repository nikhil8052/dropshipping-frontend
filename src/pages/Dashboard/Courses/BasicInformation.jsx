import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dropDownArrow from '@icons/drop-down-black.svg';
import { courseCategory } from '../../../data/data';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import { useEffect, useState } from 'react';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '@components/Loading/Loading';
import '../../../styles/Common.scss';
import '../../../styles/Courses.scss';

const BasicInformation = ({ initialData, setStepComplete, createOrUpdateCourse }) => {
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role.toLowerCase();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [coachesData, setCoachesData] = useState(null);

    const schema = Yup.object({
        title: Yup.string().required('Please enter the course title'),
        subtitle: Yup.string().required('Please enter the course subtitle'),
        category: Yup.string().required('Please select a course category'),
        moduleManager: Yup.string().required('Please select a module manager')
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setLoading(true);
        // Create the course
        const formData = { ...values };
        await createOrUpdateCourse(formData);

        setStepComplete('step1');
        setSubmitting(false);
        setLoading(false);
        resetForm();
    };

    useEffect(() => {
        // Fetch data from API here
        getAllCoaches();
    }, []);

    const getAllCoaches = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);
            const coaches = await axiosWrapper('GET', API_URL.GET_ALL_COACHES, {}, userToken);
            setCoachesData(coaches?.data);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="add-course-form-section">
                    <div className="section-title">
                        <p>Basic Information</p>
                    </div>
                    <div className="add-course-form">
                        <Formik
                            initialValues={{
                                title: initialData?.title || '',
                                subtitle: initialData?.subtitle || '',
                                category: initialData?.category || '',
                                moduleManager: initialData?.moduleManager || ''
                            }}
                            validationSchema={schema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, handleSubmit }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12} xs={12}>
                                            <label className="field-label">Title</label>
                                            <Field
                                                name="title"
                                                className="field-control"
                                                type="text"
                                                placeholder="You course title"
                                            />
                                            <ErrorMessage name="title" component="div" className="error" />

                                            <label className="field-label">Subtitle</label>
                                            <Field
                                                name="subtitle"
                                                className="field-control"
                                                type="text"
                                                placeholder="You course subtitle"
                                            />
                                            <ErrorMessage name="subtitle" component="div" className="error" />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12} xs={12}>
                                            <label className="field-label">Course Category</label>
                                            {/* eslint-disable */}
                                            <Field
                                                name="category"
                                                className="field-select-control"
                                                type="text"
                                                component={({ field, form }) => {
                                                    const handleSelect = (eventKey) => {
                                                        const selectedField = courseCategory.find(
                                                            (category) => category.id.toString() === eventKey
                                                        );
                                                        form.setFieldValue(field.name, selectedField.label);
                                                    };

                                                    return (
                                                        <>
                                                            <DropdownButton
                                                                title={
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span>
                                                                            {field.value || 'Select a category ...'}
                                                                        </span>
                                                                        <img src={dropDownArrow} alt="arrow" />
                                                                    </div>
                                                                }
                                                                id={field.name}
                                                                onSelect={handleSelect}
                                                                className="dropdown-button w-100"
                                                            >
                                                                {courseCategory.map((category) => (
                                                                    <Dropdown.Item
                                                                        key={category.id}
                                                                        eventKey={category.id}
                                                                        className="my-1 ms-2 w-100"
                                                                    >
                                                                        <span className="category-name">
                                                                            {category.label}
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                            {form.touched[field.name] && form.errors[field.name] && (
                                                                <div className="error mt-2">
                                                                    {form.errors[field.name]}
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                }}
                                            />
                                            <label className="field-label mt-3">Module Manager</label>
                                            {/* eslint-disable */}
                                            <Field
                                                name="moduleManager"
                                                className="field-select-control"
                                                type="text"
                                                component={({ field, form }) => {
                                                    const handleSelect = (eventKey) => {
                                                        const selectedCoach = coachesData?.find(
                                                            (coach) => coach._id.toString() === eventKey
                                                        );

                                                        form.setFieldValue(field.name, selectedCoach?._id);
                                                    };

                                                    return (
                                                        <>
                                                            <DropdownButton
                                                                title={
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span>
                                                                            {coachesData?.find(
                                                                                (coach) => coach._id === field.value
                                                                            )?.name || 'Select...'}
                                                                        </span>
                                                                        <img src={dropDownArrow} alt="arrow" />
                                                                    </div>
                                                                }
                                                                id={field.name}
                                                                onSelect={handleSelect}
                                                                className="dropdown-button coach-btn w-100"
                                                            >
                                                                <Dropdown.Header>
                                                                    All Coaches ({coachesData?.length})
                                                                </Dropdown.Header>
                                                                {coachesData?.map((coach) => (
                                                                    <Dropdown.Item
                                                                        key={coach._id}
                                                                        eventKey={coach._id}
                                                                        className="my-1 ms-2"
                                                                    >
                                                                        {coach.avatar ? (
                                                                            <img
                                                                                src={coach.avatar}
                                                                                className="avatar-student"
                                                                                alt={coach.name}
                                                                            />
                                                                        ) : (
                                                                            <FontAwesomeIcon
                                                                                size="lg"
                                                                                icon={faCircleUser}
                                                                                color="rgba(200, 202, 216, 1)"
                                                                                className="me-2"
                                                                            />
                                                                        )}
                                                                        <span className="coach-name">{coach.name}</span>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                            {form.touched[field.name] && form.errors[field.name] && (
                                                                <div className="error">{form.errors[field.name]}</div>
                                                            )}
                                                        </>
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <div className="mt-3 d-flex justify-content-between gap-3">
                                                <Button
                                                    type="button"
                                                    onClick={() => navigate(`/${role}/courses`)}
                                                    className="cancel-btn"
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Save Changes...' : 'Save & next'}
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </>
    );
};

export default BasicInformation;
