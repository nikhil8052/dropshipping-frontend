import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dropDownArrow from '@icons/drop-down-black.svg';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import { useEffect, useState } from 'react';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '@components/Loading/Loading';
import '../../../styles/Common.scss';
import '../../../styles/Courses.scss';
import Input from '../../../components/Input/Input';

const BasicInformation = ({ initialData, setStepComplete, createOrUpdateCourse, resetStep }) => {
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const [categories, setCategories] = useState([]); // Stores categories
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [coachesData, setCoachesData] = useState(null);

    const schema = Yup.object({
        title: Yup.string().required('Please enter the course title'),
        subtitle: Yup.string().optional(),
        category: Yup.array()
            .of(Yup.string())
            .min(1, 'Please select at least one course category') // Ensure at least one category is selected
            .required('Please select a course category'),
        moduleManager: Yup.string().required('Please select a module manager')
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            setLoading(true);
            // Create the course
            const formData = { ...values };
            await createOrUpdateCourse(formData);

            setStepComplete('step1');
            setSubmitting(false);
            setLoading(false);
            resetForm();
        } catch (error) {
            setSubmitting(false);
            setLoading(false);
            resetStep();
        }
    };

    useEffect(() => {
        // Fetch data from API here
        if (userInfo?.role === 'COACH') {
            getCoachById();
        } else {
            getAllCoaches();
        }
    }, [userInfo?.role]);

    useEffect(() => {
        // When initialData.category changes, update the categories state to include them
        if (initialData?.category) {
            setCategories((prevCategories) => {
                const combined = [...prevCategories, ...initialData.category];
                const uniqueCategories = combined.reduce((acc, current) => {
                    if (!acc.some((item) => item.value === current.value)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                return uniqueCategories;
            });
        }
    }, [initialData?.category]);

    useEffect(() => {
        getAllCategories();
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
    // If the user is a coach, get the coach by ID
    const getCoachById = async () => {
        try {
            setLoading(true);
            const coach = await axiosWrapper(
                'GET',
                `${API_URL.GET_COACH.replace(':id', userInfo?._id)}`,
                {},
                userToken
            );
            setCoachesData([coach?.data]);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosWrapper('GET', `${API_URL.GET_ALL_CATEGORIES}`, {}, userToken);
            const mappedCategories = response?.data?.map((category) => ({
                label: category.name,
                value: category._id
            }));
            setCategories(mappedCategories);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async (inputValue) => {
        try {
            const response = await axiosWrapper('GET', `${API_URL.GET_ALL_CATEGORIES}`, {}, userToken);
            const allCategories = response?.data || [];

            // Filter categories based on input value
            const filteredCategories = allCategories.filter((category) =>
                category.name.toLowerCase().includes(inputValue.toLowerCase())
            );

            // Format the categories for react-select
            const mappedCategories = filteredCategories.map((category) => ({
                label: category.name,
                value: category._id // Assuming _id is the unique identifier for categories
            }));

            setCategories((prevCategories) => {
                const combined = [...prevCategories, ...mappedCategories];
                const uniqueCategories = combined.reduce((acc, current) => {
                    if (!acc.some((item) => item.value === current.value)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                return uniqueCategories;
            });

            return mappedCategories;
        } catch (error) {
            return [];
        }
    };

    const createCategory = async (newCategoryName) => {
        try {
            const response = await axiosWrapper(
                'POST',
                `${API_URL.CREATE_CATEGORY}`,
                { name: newCategoryName, createdBy: userInfo?._id },
                userToken
            );

            const createdCategory = response?.data; // Assuming API returns the created category

            const newCategoryOption = {
                label: createdCategory.name,
                value: createdCategory._id
            };

            // Update the category list with the new category without duplicates
            setCategories((prevCategories) => {
                if (!prevCategories.some((cat) => cat.value === newCategoryOption.value)) {
                    return [...prevCategories, newCategoryOption];
                }
                return prevCategories;
            });

            return newCategoryOption;
        } catch (error) {
            return null;
        }
    };

    const handleCreateCategory = async (inputValue, setFieldValue, currentValues) => {
        const newCategory = await createCategory(inputValue);
        if (newCategory) {
            // Update the category list with the new category
            setCategories((prev) => [...prev, newCategory]);

            // Update the selected values to include the new category
            const newSelectedValues = [...(currentValues || []), newCategory.value];
            setFieldValue('category', newSelectedValues);
        }

        return newCategory;
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
                                category: initialData?.category ? initialData.category.map((cat) => cat.value) : [],
                                moduleManager: initialData?.moduleManager || ''
                            }}
                            validationSchema={schema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
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
                                            <Input
                                                name="category"
                                                label="Course Category"
                                                component={Input}
                                                type="asyncSelect"
                                                loadOptions={loadCategories}
                                                placeholder="Select a category ..."
                                                options={categories}
                                                isMulti={true}
                                                onCreateOption={(inputValue) => {
                                                    handleCreateCategory(inputValue, setFieldValue, values.category);
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
                                                    {isSubmitting ? 'Save Changes...' : 'Save & Next'}
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
