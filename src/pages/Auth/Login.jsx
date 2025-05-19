import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
// import { Form as FormikForm, Formik, ErrorMessage  } from 'formik';
import { loginUser } from '@redux/auth/auth_actions';
import { Helmet } from 'react-helmet';
import LoginLeftSec from './LoginLeftSec';
import Footer from './Footer';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './auth.scss';
import Rightloginimg from '@images/rightimg2.png';
import { TextField } from '@mui/material';
import { Field, Formik, Form as FormikForm, ErrorMessage } from 'formik';

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
                navigate('/admin/courses-supabase');
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
                    <div className="login-page">
                        <LoginLeftSec />
                        <Col className="login-center">
                            <div className="auth-form-wrapper">
                                {/* <div className='left-img col-md-6'>
                                 <img src={Rightloginimg} alt="" />
                                </div> */}
                                <div className="auth-form-data">
                                    <h1 className="auth-title ">Login</h1>
                                    {/* <h3 className="auth-form-title">Please enter your account details.</h3> */}
                                    <Formik
                                        initialValues={inititialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ isSubmitting }) => (
                                            <FormikForm>
                                                {/* Email Field */}
                                                <Field name="email">
                                                    {({ field, meta }) => (
                                                        <TextField
                                                            {...field}
                                                            label="E-mail adres"
                                                            placeholder="E-mail"
                                                            type="email"
                                                            fullWidth
                                                            variant="outlined"
                                                            // error={meta.touched && Boolean(meta.error)}
                                                            // helperText={meta.touched && meta.error}
                                                            margin="normal"
                                                            InputProps={{
                                                                className: 'custom-input-transparent'
                                                            }}
                                                        />
                                                    )}
                                                </Field>

                                                {/* Password Field with toggle */}
                                                <div className="input-password-container">
                                                    <Field name="password">
                                                        {({ field, meta }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Wachtwoord"
                                                                placeholder="Wachtwoord"
                                                                type={showPassword ? 'text' : 'password'}
                                                                fullWidth
                                                                variant="outlined"
                                                                // error={meta.touched && Boolean(meta.error)}
                                                                // helperText={meta.touched && meta.error}
                                                                margin="normal"
                                                                InputProps={{
                                                                    className: 'custom-input-ktransparent'
                                                                }}
                                                                
                                                            />
                                                        )}
                                                    </Field>

                                                    <FontAwesomeIcon
                                                        icon={showPassword ? faEyeSlash : faEye}
                                                        onClick={togglePassword}
                                                        className={`eye-icon-password ${showPassword ? 'visible' : ''}`}
                                                        color="rgba(200, 202, 216, 1)"
                                                    />
                                                </div>

                                                <div className="d-flex flex-column">
                                                    <Link className="auth-link ms-auto" to="/forgot-password">
                                                        Wachtwoord vergeten?
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
                                </div>
                            </div>
                        </Col>
                        <div className="copyright">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Login;
