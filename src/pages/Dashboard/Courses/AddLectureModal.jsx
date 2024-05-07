import { useEffect, useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-toastify';
import Card from '@components/Card/Card';
import '../../../styles/Courses.scss';
import bluePlus from '../../../assets/icons/blue-plus.svg';

import { FileUploader } from 'react-drag-drop-files';

const AddLectureModal = ({ productModal, resetModal }) => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);
    const [questionCount, setQuestionCount] = useState(1);
    const [optionalQuestion, setOptionalQuestion] = useState(1);
    const fileTypes = ['JPEG', 'PNG', 'GIF', 'pdf', 'docx'];

    const initialValues = {
        title: product.title || '',
        briefSummary: product.briefSummary || '',
        price: product.price || '',
        seller: product.seller || '',
        description: product.description || ''
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        briefSummary: Yup.string().required('Brief summary is required'),
        price: Yup.number().typeError('Price must be a number').required('Price is required'),
        seller: Yup.string().required('Please select a user'),
        description: Yup.string().required('Description is required')
    });

    useEffect(() => {
        if (productModal.isEditable) fetchProductDetail(productModal.productId);
    }, [productModal.productId, productModal.isEditable]);

    const fetchProductDetail = async (productId) => {
        try {
            setLoading(true);
            // just a dummy API call
            // const data = await axiosWrapper('get', `some-base-url/product/${productId}`);

            //imitating a get request

            await delayedSetProduct();
            return productId;
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    //just a dummy function to set product state
    const delayedSetProduct = async () => {
        await new Promise((resolve) => {
            setTimeout(() => {
                setProduct({
                    title: 'Scotch tape',
                    briefSummary: 'A fine binding tape',
                    price: '123',
                    seller: 'babar azam',
                    description: 'Here is brief description about the product'
                });
                resolve();
            }, 1000); // Wait for 2000 milliseconds (2 seconds)
        });
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            const { method, endpoint } = getRequestMeta(productModal.isEditable);
            // submit request here
            // const data = await axiosWrapper(method, endpoint, values);
            toast.success(productModal.isEditable ? 'Item updated successfully' : 'Item created successfully');
            return { method, endpoint };
        } catch (error) {
            setSubmitting(false);
        } finally {
            resetModal();
        }
    };

    const getRequestMeta = (isEditable) => {
        if (isEditable) {
            return { method: 'PUT', endpoint: '/products/some-id' };
        }
        return { method: 'POST', endpoint: '/products' };
    };

    const sellerOptions = [
        { value: 'paul smith', label: 'Paul Smith' },
        { value: 'babar azam', label: 'Babar Azam' },
        { value: 'virat kohli', label: 'Virat Kohli' }
    ];

    //
    const handleChange = (file) => {
        setFile(file);
    };

    const addNewQuestion = () => {
        setQuestionCount((prevCount) => prevCount + 1); // Increment question count
    };
    const addNewOptionalQuestion = () => {
        setOptionalQuestion((prevCount) => prevCount + 1); // Increment question count
    };
    return (
        <Container>
            {loading ? (
                <Loading />
            ) : (
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <FormikForm>
                            <div className="add-lecture-form">
                                <Input name="lecturename" placeholder="Type lecture name..." type="text" />
                                <Input
                                    name="description"
                                    placeholder="Type lecture description here..."
                                    type="textarea"
                                />
                                <Card cardType="large">
                                    <div className="add-quiz-title">
                                        <p> ADD quiz</p>
                                    </div>
                                    <div className="add-quiz-fields">
                                        <div className="add-quiz-label ">
                                            <p>
                                                Please Insert questions for Student’s personal assessments of this
                                                course. (3/3)
                                            </p>
                                            <span onClick={addNewQuestion}>
                                                <img src={bluePlus} alt="bluePlus"></img> Add new
                                            </span>
                                        </div>
                                        {[...Array(questionCount)].map((_, index) => (
                                            <div className="add-quiz-question">
                                                <Input
                                                    name="lecturename"
                                                    placeholder="What is the main feature of this course?"
                                                    type="text"
                                                />
                                                <Input
                                                    name="lecturename"
                                                    placeholder="What is the scope of this course?"
                                                    type="text"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-quiz-fields">
                                        <div className="add-quiz-label ">
                                            <p>
                                                Please Insert MCQs for Student’s personal assessments of this course.
                                                (3/3)
                                            </p>
                                            <span onClick={addNewOptionalQuestion}>
                                                <img src={bluePlus} alt="bluePlus"></img> Add new
                                            </span>
                                        </div>
                                        {[...Array(optionalQuestion)].map((_, index) => (
                                            <div className="add-quiz-question">
                                                <div className="questions">
                                                    <Input
                                                        name="lecturename"
                                                        placeholder="Please Type Question Here..."
                                                        type="text"
                                                    />
                                                    <p className="limit">0/120</p>
                                                </div>

                                                <div className="quiz-multiple-choice">
                                                    <Input name="option1" placeholder="Type option 1" type="text" />
                                                    <Input name="option2" placeholder="Type option 3" type="text" />
                                                    <Input name="option3" placeholder="Type option 3" type="text" />
                                                    <div className="correct-answer">
                                                        <Input
                                                            name="option4"
                                                            placeholder="Type Correct Ans"
                                                            type="text"
                                                            className="correct-answer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-quiz-file">
                                        <h4>Attach File</h4>
                                        <FileUploader
                                            multiple={true}
                                            handleChange={handleChange}
                                            name="file"
                                            types={fileTypes}
                                            label="hello"
                                        />
                                        <p>
                                            {file ? `File name: ${file[0].name}` : 'Drag an drop a file or browse file'}
                                        </p>
                                    </div>
                                </Card>
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
                                                ) : productModal.isEditable ? (
                                                    'Update'
                                                ) : (
                                                    'Save'
                                                )}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            )}
        </Container>
    );
};

export default AddLectureModal;
