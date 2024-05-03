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
const Login = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state?.auth);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const inititialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('Email is required'),
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
                <title>Login | Drop Ship Academy</title>
            </Helmet>
            <div className="auth-main-wrapper">
                <Row className=" g-0">
                    <LoginLeftSec />
                    <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="auth-form-wrapper ">
                            <div className="auth-form-data ">
                                {/* <img className="auth-logo" src={logoImg} alt="auth-logo" /> */}
                                <h1 className="auth-title ">Login</h1>
                                <h3 className="auth-form-title">Please enter your account details.</h3>
                                <Formik
                                    initialValues={inititialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <FormikForm>
                                            <Input
                                                name="email"
                                                placeholder="E.g kathrine1122@gmail.com"
                                                label="Email Address"
                                                type="text"
                                            />
                                            <div className="input-password-container">
                                                <Input
                                                    name="password"
                                                    placeholder="password"
                                                    label="Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                />
                                                <img
                                                    className={`eye-icon-password ${showPassword ? 'visible' : ''}`}
                                                    src={eyeIcon}
                                                    alt="eye-logo"
                                                    onClick={togglePassword}
                                                />
                                            </div>

                                            <div className=" d-flex flex-column ">
                                                <Link className="auth-link ms-auto" to="/forgot-password">
                                                    Forgot password
                                                </Link>
                                                <Button className="auth-login-button" type="submit" disabled={loading}>
                                                    {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Login'}
                                                </Button>
                                            </div>
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

export default Login;
