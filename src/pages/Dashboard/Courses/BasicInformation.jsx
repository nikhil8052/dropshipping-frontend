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
import Input from '../../../components/Input/Input';
import deleteIcon from '@icons/trash-2.svg';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

const BasicInformation = ({ initialData, setStepComplete, createOrUpdateCourse, resetStep, onDelete,...rest }) => {
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const currentCourse = useSelector((state) => state?.root?.currentCourse);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    
    // New state for category creation modal
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

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

    const handleDeleteClick = (e) => {
        e.stopPropagation(); 
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSubmit = async () => {
        setLoadingCRUD(true);
        try {
            if (onDelete) {
                await onDelete(rest?._id); 
            }
            setShowDeleteModal(false);
            setLoadingCRUD(false);
            navigate(`/${role}/courses`);
        } catch (error) {
            setLoadingCRUD(false);
            setShowDeleteModal(false);
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
                value: category._id
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

    const createCategory = async (categoryName) => {
        try {
            const response = await axiosWrapper(
                'POST',
                `${API_URL.CREATE_CATEGORY}`,
                { name: categoryName, createdBy: userInfo?._id },
                userToken
            );

            const createdCategory = response?.data;
            return {
                label: createdCategory.name,
                value: createdCategory._id
            };
        } catch (error) {
            return null;
        }
    };

    const handleAddNewCategory = async () => {
        if (!newCategoryName.trim()) return;
        
        setIsCreatingCategory(true);
        try {
            const newCategory = await createCategory(newCategoryName);
            if (newCategory) {
                setCategories(prev => [...prev, newCategory]);
                setShowCategoryModal(false);
                setNewCategoryName('');
            }
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const noOptionsMessage = ({ inputValue }) => {
        return inputValue ? 'No categories found' : 'Type to search categories';
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
                    <div
                        className="section-title"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                        <p>Basic Information</p>

                        {role === 'admin' && (
                            <div className="delete-boxs">
                            <button
                                type="button"
                                className="delete-icon-btn"
                                onClick={handleDeleteClick}
                                data-tooltip-id="my-tooltip2"
                                data-tooltip-content="Delete Course"
                                style={{ background: 'transparent', border: 'none' }}
                            >
                                <img src={deleteIcon} alt="Delete" className="delete-icon" />
                            </button>
                            </div>
                        )}
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label style={{ marginBottom: '5px', fontWeight: '500' }}>Course Category</label>
                                                <Button 
                                                    variant="text-dark" 
                                                    size="sm" 
                                                    style={{ padding: 0, fontSize: '0.875rem' }}
                                                    onClick={() => setShowCategoryModal(true)}
                                                >
                                                    + New Category
                                                </Button>
                                            </div>

                                            <Input
                                                name="category"
                                                component={Input}
                                                type="asyncSelect"
                                                loadOptions={loadCategories}
                                                placeholder="Select a category ..."
                                                options={categories}
                                                isMulti={true}
                                                noOptionsMessage={noOptionsMessage}
                                                formatCreateLabel={(inputValue) => `No categories found`} 
                                                isValidNewOption={() => false}
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
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ConfirmationBox
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteSubmit}
                    title="Delete Course"
                    body="Are you sure you want to delete this course? Data associated with this course will be lost."
                    loading={loadingCRUD}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-button"
                    activeBtn="delete-button"
                    cancelButtonTitle="No"
                    activeBtnTitle="Delete"
                />
            )}
            
            {/* Add New Category Modal */}
            <Modal 
                show={showCategoryModal} 
                onHide={() => setShowCategoryModal(false)} 
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Category Name</label>
                            <input
                                type="text"
                                className="field-control my-3 white-important-bg"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            className="text-black" 
                            onClick={() => setShowCategoryModal(false)}
                        >
                            Cancel
                        </Button>

                        <Button 
                            className="submit-btn" 
                            onClick={handleAddNewCategory}
                            disabled={!newCategoryName.trim() || isCreatingCategory}
                        >
                            {isCreatingCategory ? 'Creating...' : 'Create Category'}
                        </Button>
                    </Modal.Footer>
            </Modal>

            
            <Tooltip id="my-tooltip2" />
        </>
    );
};

export default BasicInformation;