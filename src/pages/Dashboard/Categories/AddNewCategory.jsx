import { useEffect, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_URL } from '../../../utils/apiUrl';
import axiosWrapper from '../../../utils/api';
import Loading from '@components/Loading/Loading';
import '../../../styles/Coaches.scss';
import '../../../styles/Common.scss';
import { FORMATS, TOOLBAR_CONFIG } from '../../../utils/common';

import Input from '@components/Input/Input';

const NewCategory = () => {
    const location = useLocation();
    const categoryId = location.state?.categoryId;
    const [loading, setLoading] = useState(false);
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (categoryId) {
            getSingleCategoryById(categoryId);
        }
    }, [categoryId]);

    const getSingleCategoryById = async (id) => {
        try {
            setLoading(true);
            const response = await axiosWrapper('GET', API_URL.GET_CATEGORY.replace(':id', id), {}, token);
            const category = response.data;
            // const parser = new DOMParser();
            // const htmlDoc = parser.parseFromString(category.description, 'text/html');
            // const description = htmlDoc.body.textContent;
            setCategoryData({
                name: category.name,
                // description: description
            });
        } catch (error) {
            console.error('Error fetching category:', error);
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Category name is required')
            .trim('Name cannot include leading or trailing spaces')
            .strict(true),
        // description: Yup.string()
        //     .trim('Description cannot include leading or trailing spaces')
        //     .strict(true)
    });

    const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            setLoading(true);
            setSubmitting(true);
            
            const payload = {
                name: values.name,
                // description: values.description,
                createdBy: userInfo?._id
            };

            const url = categoryId 
                ? API_URL.UPDATE_CATEGORY.replace(':id', categoryId) 
                : API_URL.CREATE_CATEGORY;
            
            const method = categoryId ? 'PUT' : 'POST';

            const response = await axiosWrapper(method, url, payload, token);
            
            if (response?.data) {
                // toast.success(categoryId ? 'Category updated!' : 'Category created!');
                navigate(`/${role}/category`);
                resetForm();
                
                if (!categoryId) {
                    return {
                        label: response.data.name,
                        value: response.data._id
                    };
                }
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="new-coach-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/category`)} style={{ cursor: 'pointer' }}>
                    Categories <img src={CaretRight} alt=">" />
                </span>{' '}
                {categoryId ? 'Edit Category' : 'Add New Category'}
            </div>
            <div className="new-coach-page new-category-page new-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 new-coach-title">{categoryId ? 'Edit Category' : 'Add New Category'}</h4>
                    <Formik
                        initialValues={categoryData}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={12} className="mb-3">

                                        <label className="field-label">Category Name</label>
                                        <Field
                                            name="name"
                                            className="field-control mb-3"
                                            type="text"
                                            placeholder="Enter category name"
                                        />
                                        <ErrorMessage name="name" component="div" className="error" />
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col md={12}>
                                        <Input
                                            className="field-quill-control"
                                            type="richTextEditor"
                                            name="description"
                                            label="Description (optional)"
                                            placeholder="Enter category description..."
                                            modules={{
                                                toolbar: TOOLBAR_CONFIG
                                            }}
                                            formats={FORMATS}
                                        />
                                    </Col>
                                </Row> */}
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-end gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => navigate(`/${role}/category`)}
                                                className="cancel-btn"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="submit-btn"
                                                disabled={loading || isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    categoryId ? (
                                                        'Saving Changes...'
                                                    ) : (
                                                        <Loading />
                                                    )
                                                ) : categoryId ? (
                                                    'Save Changes'
                                                ) : (
                                                    'Add Category'
                                                )}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </div>
        </div>
    );
};

export default NewCategory;