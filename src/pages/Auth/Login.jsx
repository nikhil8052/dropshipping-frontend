import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { loginUser } from '@redux/auth/auth_actions';
import { Helmet } from 'react-helmet';
import LoginLeftSec from './LoginLeftSec';
import Footer from './Footer';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './auth.scss';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state?.auth);
    const user = useSelector((state) => state.auth);
    const userRole = user?.userInfo?.role;
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const inititialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Please enter a valid email')
            .trim()
            .required('Email is required')
            .test('not-only-spaces', 'Email cannot be only spaces', (value) => /\S/.test(value)),
        password: Yup.string()
            .required('Password is required')
            .trim()
            .test('not-only-spaces', 'Password cannot be only spaces', (value) => /\S/.test(value))
    });

    useEffect(() => {
        if (user) {
            if (userRole === 'ADMIN') {
                navigate('/admin');
            } else if (userRole === 'COACH') {
                navigate('/coach');
            } else if (userRole === 'STUDENT') {
                navigate('/buyer');
            } else {
                navigate('/login');
            }
        }
    }, [user]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            dispatch(loginUser(values));
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
                <title>Login | Dropship Academy</title>
            </Helmet>
            <div className="auth-main-wrapper">
                <div className="login-page-section">
                    <Row className=" g-0">
                        <LoginLeftSec />
                        <Col xs={12} sm={12} md={12} lg={6}>
                            <div className="auth-form-wrapper ">
                                <div className="auth-form-data ">
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
                                                        placeholder="Password"
                                                        label="Password"
                                                        type={showPassword ? 'text' : 'password'}
                                                    />

                                                    <FontAwesomeIcon
                                                        icon={showPassword ? faEyeSlash : faEye}
                                                        onClick={togglePassword}
                                                        className={`eye-icon-password ${showPassword ? 'visible' : ''}`}
                                                        color="rgba(200, 202, 216, 1)"
                                                    />
                                                </div>

                                                <div className=" d-flex flex-column ">
                                                    <Link className="auth-link ms-auto" to="/forgot-password">
                                                        Forgot password?
                                                    </Link>
                                                    <Button
                                                        className="auth-login-button"
                                                        type="submit"
                                                        disabled={loading}
                                                    >
                                                        {isSubmitting ? (
                                                            <Spinner animation="border" size="sm" />
                                                        ) : (
                                                            'Login'
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormikForm>
                                        )}
                                    </Formik>
                                    <Footer />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Login;
