import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import './auth.scss';
import LoginLeftSec from './LoginLeftSec';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state?.auth);
    const inititialValues = {
        email: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Please enter a valid email')
            .trim()
            .required('Email is required')
            .test('not-only-spaces', 'Email cannot be only spaces', (value) => /\S/.test(value))
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            navigate('/verification-code');
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    return (
        <React.Fragment>
            <div className="auth-main-wrapper">
                <Row className=" g-0">
                    <LoginLeftSec />
                    <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="auth-form-wrapper ">
                            <div className="auth-form-data ">
                                <h1 className="auth-title ">Forgot Password</h1>
                                <h3 className="auth-form-title">
                                    Enter the email address associated with your Dropship Academy X.
                                </h3>
                                <Formik
                                    initialValues={inititialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ isSubmitting }) => (
                                        <>
                                            <FormikForm>
                                                <Input
                                                    name="email"
                                                    placeholder="E.g kathrine1122@gmail.com"
                                                    label="Email Address"
                                                    type="text"
                                                />
                                                <Button className="auth-login-button" type="submit" disabled={loading}>
                                                    {isSubmitting ? (
                                                        <Spinner animation="border" size="sm" />
                                                    ) : (
                                                        'Send Code'
                                                    )}
                                                </Button>
                                            </FormikForm>
                                            <Button
                                                className="back-btn"
                                                type="button"
                                                onClick={() => navigate('/login')}
                                                disabled={isSubmitting || loading}
                                            >
                                                <FontAwesomeIcon className="me-2" icon={faArrowLeft} />
                                                Back to Login
                                            </Button>
                                        </>
                                    )}
                                </Formik>
                                <Footer />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default ForgotPassword;
