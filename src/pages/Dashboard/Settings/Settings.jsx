import { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Image, InputGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import profile from '@images/user-img.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import UploadSimple from '@icons/UploadSimple.svg';
import ImageCropper from '../../../components/ImageMask/ImageCropper';
import { updateUserInfo } from '../../../redux/auth/auth_slice';
import { useDispatch, useSelector } from 'react-redux';
import { getFileObjectFromBlobUrl } from '../../../utils/utils';
import axiosWrapper from '@utils/api';
import { API_URL } from '../../../utils/apiUrl';
import '../../../styles/Settings.scss';
import '../../../styles/Common.scss';
import { Helmet } from 'react-helmet';

const Settings = () => {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const [profilePhoto, setProfilePhoto] = useState(profile || null);
    const [cropping, setCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [showSecret, setShowSecret] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        meetingLink: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (userInfo) {
            setProfileData({
                name: userInfo.name,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                meetingLink: userInfo.meetingLink
            });
            setProfilePhoto(userInfo.avatar);
        }
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    }, [dispatch]);

    const profileValidationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phoneNumber: Yup.string().required('Phone number is required'),
        meetingLink: Yup.string()
            .trim()
            .required('Meeting link is required for online events')
            .test('not-only-spaces', 'Meeting link cannot be only spaces', (value) => /\S/.test(value))
    });

    const passwordValidationSchema = Yup.object({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(4, 'Password must be at least 4 characters long')
            .max(20, 'Password must be at most 20 characters long')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~¡¢£¤¥¦§¨©ª«¬®ˉ°±²³´µ¶¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~¡¢£¤¥¦§¨©ª«¬®ˉ°±²³´µ¶¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]{4,20}$/,
                'Password must contain letters, numbers, and special characters'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirmation of the new password is required')
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Invalid file selected. Please choose an image file.');
            return;
        }

        const image = URL.createObjectURL(file);
        setImageSrc(image);
        setCropping(true);
    };

    const handleCropComplete = async (croppedImage) => {
        try {
            const file = await getFileObjectFromBlobUrl(croppedImage, 'avatar.jpg');
            const formData = new FormData();
            formData.append('files', file);
            formData.append('name', file.name);
            setCropping(false);
            const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
            setProfilePhoto(mediaFile.data[0].path);
        } catch (error) {
            setCropping(false);
        }
    };

    const resetCropper = () => {
        setCropping(false);
        setProfilePhoto(null);
        setImageSrc(null);
    };

    const handleProfileSubmit = async (values, { setSubmitting }) => {
        const profileData = { ...values };

        if (profileData.email) {
            delete profileData.email;
        }

        const response = await axiosWrapper('PUT', API_URL.UPDATE_PROFILE, { ...profileData }, token);
        // update data in redux
        dispatch(updateUserInfo({ ...response.data, avatar: profilePhoto }));

        setSubmitting(false);
    };

    const handlePasswordSubmit = async (values, { resetForm, setSubmitting }) => {
        const profileData = { ...values };

        if (profileData.confirmPassword) {
            delete profileData.confirmPassword;
        }

        await axiosWrapper('PUT', API_URL.UPDATE_PROFILE, { ...profileData }, token);

        setSubmitting(false);
        resetForm();
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const toggleSecretVisibility = () => {
        setShowSecret((prev) => !prev);
    };

    return (
        <div className="settings-page">
            <Helmet>
                <title>Settings | Dropship Academy</title>
            </Helmet>
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
                                                        {!profilePhoto ? (
                                                            <FontAwesomeIcon
                                                                className="profile-image"
                                                                size="2xl"
                                                                icon={faCircleUser}
                                                                color="rgba(200, 202, 216, 1)"
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={
                                                                    typeof profilePhoto === 'string'
                                                                        ? profilePhoto
                                                                        : URL.createObjectURL(profilePhoto)
                                                                }
                                                                className="profile-image"
                                                            />
                                                        )}
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
                                                            Upload New Image <img src={UploadSimple} alt="" />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <hr style={{ color: 'rgba(233, 233, 233, 1)' }} />
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
                                        readOnly
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
                                        placeholder="+31-24-3611111"
                                    />
                                    <ErrorMessage name="phoneNumber" component="div" className="error" />
                                </Col>

                                {userInfo?.role !== 'STUDENT' && (
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Meeting Link</label>
                                        <Field
                                            name="meetingLink"
                                            className="field-control"
                                            type="text"
                                            placeholder="https://zoom.us/j/97697547647?pwd=UytOUjFlUTlPRjYvbmJnQ0pvZ2RDUT09"
                                        />
                                        <ErrorMessage name="meetingLink" component="div" className="error" />
                                    </Col>
                                )}
                            </Row>

                            {/* Zoom Fields */}

                            {userInfo?.role !== 'STUDENT' && (
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Account Id</label>
                                        <Field
                                            name="accountId"
                                            className="field-control"
                                            type="text"
                                            placeholder="Zoom Account ID"
                                        />
                                        <ErrorMessage name="accountId" component="div" className="error" />
                                    </Col>

                                    <Col md={6} xs={12}>
                                        <label className="field-label">Client Id</label>
                                        <Field
                                            name="clientId"
                                            className="field-control"
                                            type="text"
                                            placeholder="Zoom Client ID"
                                        />
                                        <ErrorMessage name="clientId" component="div" className="error" />
                                    </Col>

                                    <Col md={6} xs={12}>
                                        <label className="field-label">Client Secret</label>
                                        <InputGroup>
                                            <Field
                                                name="clientSecret"
                                                className="field-control"
                                                type={showSecret ? 'text' : 'password'}
                                                placeholder="*************"
                                            />
                                            <FontAwesomeIcon
                                                icon={showSecret ? faEyeSlash : faEye}
                                                onClick={toggleSecretVisibility}
                                                className="eye-icon"
                                                color="rgba(200, 202, 216, 1)"
                                            />
                                        </InputGroup>
                                        <ErrorMessage name="clientSecret" component="div" className="error" />
                                    </Col>
                                </Row>
                            )}

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
                <hr style={{ color: 'rgba(233, 233, 233, 1)' }} />
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
                {cropping && (
                    <ImageCropper imageSrc={imageSrc} onCropComplete={handleCropComplete} onCancel={resetCropper} />
                )}
            </Container>
        </div>
    );
};

export default Settings;
