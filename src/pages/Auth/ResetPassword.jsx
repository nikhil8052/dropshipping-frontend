import { useSelector } from 'react-redux';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Helmet } from 'react-helmet';
import './auth.scss';
import LoginLeftSec from './LoginLeftSec';
import Footer from './Footer';
import { useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state?.auth);
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    }); // State for password visibility
    const inititialValues = {
        newPassword: '',
        confirmPassword: ''
    };
    const validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('New Password is required')
            .min(4, 'Password must be at least 4 characters long')
            .max(20, 'Password must be at most 20 characters long')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/, 'Password must contain both letters and numbers'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    });

    const handleSubmit = async ({ setSubmitting }) => {
        try {
            navigate('/login');
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };
    const togglePassword = (field) => {
        setShowPassword((prevState) => ({ ...prevState, [field]: !prevState[field] }));
    };

    return (
        <>
            <Helmet>
                <title>Login | Drop Ship Academy</title>
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
                                    enableReinitialize
                                >
                                    {({ isSubmitting }) => (
                                        <FormikForm>
                                            <div className="input-password-container">
                                                <Input
                                                    name="newPassword"
                                                    placeholder="8+  character"
                                                    label="New Password"
                                                    type={showPassword.newPassword ? 'text' : 'password'}
                                                />
                                                <FontAwesomeIcon
                                                    icon={showPassword.newPassword ? faEyeSlash : faEye}
                                                    onClick={() => togglePassword('newPassword')}
                                                    className={`eye-icon-password ${showPassword.newPassword ? 'visible' : ''}`}
                                                    color="rgba(200, 202, 216, 1)"
                                                />
                                            </div>
                                            <div className="input-password-container">
                                                <Input
                                                    name="confirmPassword"
                                                    placeholder="Confirm password"
                                                    label="Confirm Password"
                                                    type={showPassword.confirmPassword ? 'text' : 'password'}
                                                />
                                                <FontAwesomeIcon
                                                    icon={showPassword.confirmPassword ? faEyeSlash : faEye}
                                                    onClick={() => togglePassword('confirmPassword')}
                                                    className={`eye-icon-password ${showPassword.confirmPassword ? 'visible' : ''}`}
                                                    color="rgba(200, 202, 216, 1)"
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
                                <Footer />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ResetPassword;
