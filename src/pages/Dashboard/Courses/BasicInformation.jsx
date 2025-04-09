import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import { useEffect, useState } from 'react';
import Loading from '@components/Loading/Loading';
import '../../../styles/Common.scss';
import '../../../styles/Courses.scss';
import Input from '../../../components/Input/Input';

const BasicInformation = ({ initialData, setStepComplete, createOrUpdateCourse, resetStep }) => {
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const currentCourse = useSelector((state) => state?.root?.currentCourse);

    const schema = Yup.object({
        title: Yup.string().required('Please enter the course title'),
        subtitle: Yup.string().optional(),
        category: Yup.array()
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            setLoading(true);
            // Create the course
            const formData = { ...values, category: values.category.map((cat) => cat.value) };
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
                return [...prevCategories, newCategoryOption];
            });

            return newCategoryOption;
        } catch (error) {
            return null;
        }
    };

    const handleCreateCategory = async (inputValue, setFieldValue, currentValues) => {
        const newCategory = await createCategory(inputValue);
        if (newCategory) {
            const newSelectedValues = [...(currentValues || []), newCategory];
            setFieldValue('category', newSelectedValues);
        }

        return newCategory;
    };

    const deleteCourse = async () => {
        try{

            if( currentCourse ){
                const url = `${API_URL.DELETE_COURSE.replace(':id', currentCourse)}`
               const  response = await axiosWrapper(
                    'DELETE',
                     url,
                    {},
                    userToken
                );
                navigate(`/${role}/courses`);
         
            }
            
    
        }catch(error){
            console.log(error);
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
                        {
                            currentCourse && (
                                <button type="button" className='btn btn-secondary' onClick={deleteCourse}> Delete </button>
                            )
                        }
                    </div>
                    <div className="add-course-form">
                        <Formik
                            initialValues={{
                                title: initialData?.title || '',
                                subtitle: initialData?.subtitle || '',
                                category: initialData?.category || []
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
