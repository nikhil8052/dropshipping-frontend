import { useState } from 'react';
import { Form as FormikForm, Formik, Field, ErrorMessage } from 'formik';
import { Row, Col, Button } from 'react-bootstrap';

import Loading from '@components/Loading/Loading';
import axiosWrapper from '../../../../utils/api';
import { API_URL } from '../../../../utils/apiUrl';
import { useSelector } from 'react-redux';

const AddTopicModal = ({ topicModal, resetModal, onSave }) => {

    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        topicName: '',
    });
    const token = useSelector((state) => state?.auth?.userToken);
    const courseId = topicModal?.courseId;

    const handleSubmit = async (values, {setSubmitting}) => {
        // You can also do any API call here
        setLoading(true);
        setSubmitting(true);
        const url= API_URL.COURSE_ADD_FOLDER.replace(':id', courseId)
        const method = 'POST';
        const response = await axiosWrapper(method, url, values, token);
        setLoading(false);

        resetModal();
        setSubmitting(false);
        onSave();


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
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <FormikForm>
                                <Row className="mt-3">
                                    <Col md={12} xs={12}>
                                        <Field
                                            name="topicName"
                                            className="field-control mb-2"
                                            type="text"
                                            placeholder="Type Folder Name..."
                                        />
                                        <div className="mb-2">
                                            <ErrorMessage name="topicName" component="div" className="error" />
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mt-2">
                                    <Col>
                                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            )}
        </>
    );
};

export default AddTopicModal;
