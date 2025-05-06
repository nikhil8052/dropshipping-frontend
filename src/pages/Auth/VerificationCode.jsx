import { useSelector } from 'react-redux';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import './auth.scss';
import LoginLeftSec from './LoginLeftSec';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosWrapper from '@utils/api';
import { API_URL } from '../../utils/apiUrl';

const VerificationCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location?.state?.email;
    const { loading } = useSelector((state) => state?.auth);
    const initialValues = {
        otp: ''
    };

    const validationSchema = Yup.object().shape({
        otp: Yup.string().required('Please enter a valid OTP')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Call API to send verification code
            const response = await axiosWrapper('PUT', API_URL.VERIFY_OTP, { ...values, email });

            navigate('/reset-password', {
                state: {
                    user: response.data.user,
                    token: response.data.token
                }
            });
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    const resendOtpCode = async () => {
        // Call API to send verification code
        await axiosWrapper('PUT', API_URL.SEND_OTP_ON_EMAIL, { email });
    };

    return (
        <>
            <div className="auth-main-wrapper">
                <div className="login-page-section">
                    <div className="login-page">
                        <LoginLeftSec />
                        <Col className='login-center'>
                            <div className="auth-form-wrapper ">
                                <div className="auth-form-data ">
                                    <h1 className="auth-title ">Enter Your Verification Code</h1>
                                    <h3 className="auth-form-title">
                                        Please enter verification code which we sent you on your email for confirmation.
                                    </h3>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                        enableReinitialize
                                    >
                                        {({ isSubmitting }) => (
                                            <>
                                                <FormikForm>
                                                    <div className="verification-input">
                                                        <Input
                                                            name="otp"
                                                            placeholder="E.g 225465822"
                                                            label="Verification Code"
                                                            type="text"
                                                            inputType="number"
                                                        />
                                                        <span
                                                            className="resend-code cursor-pointer"
                                                            onClick={resendOtpCode}
                                                        >
                                                            Resend code
                                                        </span>
                                                    </div>
                                                    <Button
                                                        className="auth-login-button"
                                                        type="submit"
                                                        disabled={loading}
                                                    >
                                                        {isSubmitting ? (
                                                            <Spinner animation="border" size="sm" />
                                                        ) : (
                                                            'Verify'
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
                                </div>
                            </div>
                        </Col>
                        <div className="copyright">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerificationCode;
