import { useSelector } from 'react-redux';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import './auth.scss';
import LoginLeftSec from './LoginLeftSec';
import Footer from './Footer';
import toast from 'react-hot-toast';
const VerificationCode = () => {
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state?.auth);
    const inititialValues = {
        otp: ''
    };

    const validationSchema = Yup.object().shape({
        otp: Yup.number().min(0).required('Please enter a valid OTP')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            navigate('/reset-password');
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    return (
        <>
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
                                    enableReinitialize
                                >
                                    {({ isSubmitting }) => (
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
                                                    onClick={() =>
                                                        toast.success('Otp sent to your email successfully.')
                                                    }
                                                >
                                                    Resend code
                                                </span>
                                            </div>
                                            <Button className="auth-login-button" type="submit" disabled={loading}>
                                                {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Verify'}
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

export default VerificationCode;
