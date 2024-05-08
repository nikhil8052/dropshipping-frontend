import { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Image, InputGroup } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import profile from '@images/user-img.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import UploadSimple from '@icons/UploadSimple.svg';

const Settings = () => {
    const inputRef = useRef();
    const [profilePhoto, setProfilePhoto] = useState(profile || null);
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Dummy data for now
        setProfileData({
            name: 'John Doe',
            email: ' John.Doe@example.com',
            phoneNumber: '+31- 612 345 678'
        });
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    }, []);

    const profileValidationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phoneNumber: Yup.string().required('Phone number is required')
    });

    const passwordValidationSchema = Yup.object({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string().required('New password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirmation of the new password is required')
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            // Display an error or handle the invalid file selection
            toast.error('Invalid file selected. Please choose an image file.');
            return;
        }

        const image = new Image();
        image.src = window.URL.createObjectURL(file);
        image.onload = () => {
            const { width, height } = image;
            if (width > 1200 || height > 800) {
                // Display an error or handle the invalid file dimensions
                toast.error('Invalid image dimensions. Please upload an image with 1200x800 pixels.');
                return;
            }

            toast.success('Image uploaded successfully!', {
                icon: '🎉',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            });

            setProfilePhoto(file);
            // Upload File through API
        };
    };

    const handleProfileSubmit = (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            // Implement form submission logic here
            resetForm();
            setSubmitting(false);
            navigate('/admin');
        }, 1000);
    };

    const handlePasswordSubmit = (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            // Implement form submission logic here
            resetForm();
            setSubmitting(false);
            navigate('/admin');
        }, 1000);
    };

    // Function to toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPasswords((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };
    return (
        <div className="settings-page">
            <Container fluid className="p-3">
                <Formik
                    initialValues={profileData}
                    validationSchema={profileValidationSchema}
                    onSubmit={handleProfileSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col>
                                    <label className="profile-title">Profile</label>
                                    <Field name="coachPhoto">
                                        {({ field }) => (
                                            <>
                                                <input
                                                    ref={inputRef}
                                                    accept=".jpg,.jpeg,.png"
                                                    {...field}
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileChange}
                                                />

                                                <Row className="d-flex flex-column">
                                                    <Col
                                                        xs={6}
                                                        md={3}
                                                        lg={3}
                                                        className="d-flex justify-content-start ms-5"
                                                    >
                                                        <Image
                                                            src={
                                                                typeof profilePhoto === 'string'
                                                                    ? profilePhoto
                                                                    : URL.createObjectURL(profilePhoto)
                                                            }
                                                            className="profile-image"
                                                        />
                                                    </Col>
                                                    <Col xs={6} md={3} lg={3} className="d-flex justify-content-start">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                inputRef.current.click();
                                                            }}
                                                            className="upload-image-btn"
                                                            variant="outline-primary"
                                                        >
                                                            Upload New Image <img src={UploadSimple} alt="" srcSet="" />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <hr
                                                    style={{
                                                        color: 'rgba(233, 233, 233, 1)'
                                                    }}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} xs={12}>
                                    <label className="field-label">Name</label>
                                    <Field name="name" className="field-control" type="text" placeholder="John Doe" />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </Col>
                                <Col md={6} xs={12}>
                                    <label className="field-label">Email Address</label>
                                    <Field
                                        name="email"
                                        className="field-control"
                                        type="email"
                                        placeholder="john.doe@gmail.com"
                                    />
                                    <ErrorMessage name="email" component="div" className="error" />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} xs={12}>
                                    <label className="field-label">Phone No</label>
                                    <Field
                                        name="phoneNumber"
                                        className="field-control"
                                        type="text"
                                        placeholder="+31- 612 345 678"
                                    />
                                    <ErrorMessage name="phoneNumber" component="div" className="error" />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className="mt-3 d-flex justify-content-start gap-3">
                                        <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Updating...' : 'Update'}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
                <hr
                    style={{
                        color: 'rgba(233, 233, 233, 1)'
                    }}
                />
                {/* Password section */}

                <Formik
                    initialValues={passwordData}
                    validationSchema={passwordValidationSchema}
                    onSubmit={handlePasswordSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <label className="profile-title mb-3">Password</label>

                            <Row>
                                <Col md={6} xs={12}>
                                    <label className="field-label">Current Password</label>
                                    <InputGroup>
                                        <Field
                                            name="currentPassword"
                                            className="field-control"
                                            type={showPasswords.current ? 'text' : 'password'}
                                            placeholder="*************"
                                        />
                                        <FontAwesomeIcon
                                            icon={showPasswords.current ? faEyeSlash : faEye}
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="eye-icon"
                                            color="rgba(200, 202, 216, 1)"
                                        />
                                    </InputGroup>
                                    <ErrorMessage name="currentPassword" component="div" className="error" />
                                </Col>
                                <Col md={6} xs={12}>
                                    <label className="field-label">New Password</label>
                                    <InputGroup>
                                        <Field
                                            name="newPassword"
                                            className="field-control"
                                            type={showPasswords.new ? 'text' : 'password'}
                                            placeholder="*************"
                                        />
                                        <FontAwesomeIcon
                                            icon={showPasswords.new ? faEyeSlash : faEye}
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="eye-icon"
                                            color="rgba(200, 202, 216, 1)"
                                        />
                                    </InputGroup>
                                    <ErrorMessage name="newPassword" component="div" className="error" />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} xs={12}>
                                    <label className="field-label">Confirm Password</label>
                                    <InputGroup>
                                        <Field
                                            name="confirmPassword"
                                            className="field-control"
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            placeholder="*************"
                                        />
                                        <FontAwesomeIcon
                                            icon={showPasswords.confirm ? faEyeSlash : faEye}
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="eye-icon"
                                            color="rgba(200, 202, 216, 1)"
                                        />
                                    </InputGroup>
                                    <ErrorMessage name="confirmPassword" component="div" className="error" />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className="mt-3 d-flex justify-content-start gap-3">
                                        <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Updating...' : 'Update'}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Container>
        </div>
    );
};

export default Settings;
