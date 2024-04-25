import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Row, Container, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
//import { loginUser } from '@redux/auth/auth_actions'; use this function for original login call
import { loginWithoutAPI } from '@redux/auth/auth_slice';
import './auth.scss';
import LoginLeftSec from './LoginLeftSec';
const VerificationCode = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state?.auth);
    const inititialValues = {
        email: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('Email is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            dispatch(loginWithoutAPI(values));
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
                                <h1 className="auth-title ">Enter Your Verification Code</h1>
                                <h3 className="auth-form-title">
                                    Please enter verification code which we sent you on your email for confirmation.
                                </h3>
                                <Formik
                                    initialValues={inititialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <FormikForm>
                                            <Input
                                                name="Verification Code"
                                                placeholder="E.g 225465822"
                                                label="Verification Code"
                                                type="text"
                                            />
                                            <Link className="auth-link ms-auto" to="/reset-password">
                                                <Button className="auth-login-button" type="submit" disabled={loading}>
                                                    {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Veirfy'}
                                                </Button>
                                            </Link>
                                        </FormikForm>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default VerificationCode;
