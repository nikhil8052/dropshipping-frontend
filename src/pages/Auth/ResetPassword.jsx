import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Row, Container, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import eyeIcon from '../../assets/icons/Eye.svg';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
//import { loginUser } from '@redux/auth/auth_actions'; use this function for original login call
import { Helmet } from 'react-helmet';
import { loginWithoutAPI } from '@redux/auth/auth_slice';
import './auth.scss';
import LoginLeftSec from './LoginLeftSec';
const ResetPassword = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state?.auth);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const inititialValues = {
        password: ''
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Password is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            dispatch(
                loginWithoutAPI({
                    ...values,
                    role: values.email?.toLowerCase().includes('admin')
                        ? 'admin'
                        : values.email?.toLowerCase().includes('coach')
                          ? 'coach'
                          : 'student'
                })
            );
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Login | Template</title>
            </Helmet>
            <div className="auth-main-wrapper">
                <Row className=" g-0">
                    <LoginLeftSec />
                    <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="auth-form-wrapper ">
                            <div className="auth-form-data ">
                                <h1 className="auth-title ">Reset Password</h1>
                                <h3 className="auth-form-title">
                                    You new password must be different from your previous <br />
                                    used passwords for your account security.
                                </h3>
                                <Formik
                                    initialValues={inititialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <FormikForm>
                                            <div className="input-password-container">
                                                <Input
                                                    name="Newpassword"
                                                    placeholder="8+  character"
                                                    label="New Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                />
                                                <img
                                                    className={`eye-icon-password ${showPassword ? 'visible' : ''}`}
                                                    src={eyeIcon}
                                                    alt="eye-logo"
                                                    onClick={togglePassword}
                                                />
                                            </div>
                                            <div className="input-password-container">
                                                <Input
                                                    name="ConfirmPassword"
                                                    placeholder="password"
                                                    label="Confirm Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                />
                                                <img
                                                    className={`eye-icon-password ${showPassword ? 'visible' : ''}`}
                                                    src={eyeIcon}
                                                    alt="eye-logo"
                                                    onClick={togglePassword}
                                                />
                                            </div>

                                            <Button className="auth-login-button" type="submit" disabled={loading}>
                                                {isSubmitting ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : (
                                                    'Update Password'
                                                )}
                                            </Button>
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

export default ResetPassword;
