import React, { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import imagePreview from '@icons/image-preview.svg';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import CustomSelect from '../../../../components/Input/Select';
import { countryList, coursesRoadmap, studentDummyData } from '../../../../data/data';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
// import SortableSelect from './SortedSelect';

const NewStudent = () => {
    const inputRef = useRef();
    const [studentPhoto, setStudentPhoto] = useState(null);
    const location = useLocation();
    const studentId = location.state?.studentId;
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState({
        studentName: '',
        id: '',
        studentEmail: '',
        phoneNumber: '',
        country: '',
        region: '',
        assignedStudents: [],
        highTicketSpots: '',
        lowTicketSpots: '',
        bio: ''
    });

    useEffect(() => {
        if (studentId) {
            // For now it is a dummy data, later we will replace it with actual API call

            // Fetch data from API here
            const student = studentDummyData.find((student) => student.id === studentId);
            // later we add the details to the form
            if (student) {
                setStudentPhoto(student.avatarUrl);
                setStudentData({
                    studentName: student.name,
                    studentEmail: student.email,
                    phoneNumber: student.phoneNumber,
                    country: student.country,
                    region: student.region,
                    assignedStudents: student.assignedStudents,
                    highTicketSpots: student.highTicketSpots,
                    lowTicketSpots: student.lowTicketSpots,
                    bio: student.bio
                });
            }
        }
    }, [studentId]);

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

            setStudentPhoto(file);
            // Upload File through API
        };
    };
    // Test Data

    const animatedComponents = makeAnimated();

    const customStyles = {
        // Add custom styles here
        control: (base, state) => ({
            ...base
            // styles for the control component
        }),
        option: (provided, state) => ({
            ...provided
            // styles for the option components
        })
        // ... more custom styling
    };

    return (
        <div className="new-coach-page-wrapper">
            <div className="title-top">
                <span onClick={() => navigate('/admin/students')} style={{ cursor: 'pointer' }}>
                    Students <img src={CaretRight} alt=">" />
                </span>{' '}
                {studentId ? 'Student Profile' : 'Add New Student'}
            </div>
            <div className="new-coach-page">
                <Container fluid className="p-3">
                    <h4 className="mb-3 new-coach-title">{studentId ? 'Student Profile' : 'Add New Student'}</h4>
                    <Formik
                        initialValues={studentData}
                        validationSchema={Yup.object({
                            studentName: Yup.string().required('Required'),
                            studentEmail: Yup.string().email('Invalid email address').required('Required'),
                            phoneNumber: Yup.string().required('Required'),
                            country: Yup.string().required('Required'),
                            region: Yup.string().required('Required'),
                            assignedStudents: Yup.array().min(1, 'Select at least one student'),
                            highTicketSpots: Yup.number().required('Required').positive('Must be a positive number'),
                            lowTicketSpots: Yup.number().required('Required').positive('Must be a positive number'),
                            bio: Yup.string()
                        })}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            setTimeout(() => {
                                // Implement form submission logic here
                                resetForm();
                                setSubmitting(false);
                            }, 1000);
                        }}
                        enableReinitialize
                    >
                        {({ isSubmitting, handleSubmit, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col>
                                        {studentPhoto ? (
                                            <label className="field-label fw-bold">Profile image</label>
                                        ) : (
                                            <label className="field-label">
                                                UPLOAD PHOTO <span className="label-light">(Mandatory)</span>
                                            </label>
                                        )}
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
                                                    {studentPhoto ? (
                                                        <div className="image-renderer">
                                                            <img
                                                                src={
                                                                    typeof studentPhoto === 'string'
                                                                        ? studentPhoto
                                                                        : URL.createObjectURL(studentPhoto)
                                                                }
                                                                alt=""
                                                                style={{ borderRadius: '50%' }}
                                                            />
                                                            <span>{studentPhoto.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="image-preview"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                inputRef.current.click();
                                                            }}
                                                        >
                                                            <img src={imagePreview} alt="" />
                                                            <span>
                                                                Upload Student Picture here
                                                                <br />
                                                                <strong>Important Guidelines:</strong> 1200x800 pixels
                                                                or 12:8 Ratio
                                                                <br />
                                                                Supported formats: <strong>.jpg, .jpeg, or .png</strong>
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Student Name</label>
                                        <Field
                                            name="studentName"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g David Henderson"
                                        />
                                        <ErrorMessage name="studentName" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Student ID</label>
                                        <Field
                                            name="id"
                                            className="field-control"
                                            type="text"
                                            placeholder="E.g 65435"
                                        />
                                        <ErrorMessage name="id" component="div" className="error" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Email</label>
                                        <Field
                                            name="studentEmail"
                                            className="field-control"
                                            type="email"
                                            placeholder="kevin12345@gmail.com"
                                        />
                                        <ErrorMessage name="studentEmail" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Phone Number</label>
                                        <Field
                                            name="phoneNumber"
                                            className="field-control"
                                            type="number"
                                            placeholder="+1-202-555-0118"
                                        />
                                        <ErrorMessage name="phoneNumber" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Country</label>
                                        <Field
                                            name="country"
                                            className="field-select-control"
                                            as="select"
                                            placeholder="United States"
                                        >
                                            <option defaultChecked value="">
                                                Select a country...
                                            </option>
                                            {countryList.map((country) => (
                                                <option key={country.id} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </Field>

                                        <ErrorMessage name="country" component="div" className="error" />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Region/State</label>
                                        <Field
                                            name="region"
                                            className="field-select-control"
                                            as="select"
                                            placeholder="Select..."
                                        >
                                            {studentDummyData.map((student) => (
                                                <option key={student.id} value={student.name}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="region" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <label className="field-label">Coaching Trajectory</label>
                                        {/* <FieldArray name="assignedStudents">
                                            {({ push, remove, form }) => (
                                                // <CustomSelect
                                                //     name="assignedStudents"
                                                //     options={studentDummyData.map((student) => ({
                                                //         value: student.id,
                                                //         label: student.name
                                                //     }))}
                                                //     isMulti={true}
                                                //     value={values.assignedStudents}
                                                //     placeholder="Select or search students..."
                                                //     onChange={(selectedOptions) => {
                                                //         // Update the array with only the selected options
                                                //         form.setFieldValue('assignedStudents', selectedOptions);
                                                //     }}
                                                //     onBlur={() => form.setFieldTouched('assignedStudents', true)}
                                                // />
                                                // <DndContext onDragEnd={handleDragEnd}>
                                                //     <Select
                                                //         components={animatedComponents}
                                                //         isMulti
                                                //         options={options}
                                                //         styles={customStyles}
                                                //         placeholder="Select courses..."
                                                //         closeMenuOnSelect={false}
                                                //         component={{ CustomOption }}
                                                //     />
                                                // </DndContext>
                                                // <SortableSelect
                                                //     options={coursesRoadmap}
                                                //     value={form.values.assignedStudents}
                                                //     onChange={(selectedOptions) => {
                                                //         // Update the form value with the new array of selected options
                                                //         form.setFieldValue('assignedStudents', selectedOptions || []);
                                                //     }}
                                                // />
                                            )}
                                        </FieldArray> */}
                                        <Field
                                            name="region"
                                            className="field-select-control"
                                            as="select"
                                            placeholder="Select..."
                                        >
                                            {studentDummyData.map((student) => (
                                                <option key={student.id} value={student.name}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="assignedStudents" component="div" className="error" />
                                    </Col>

                                    <Col md={6} xs={12}>
                                        <label className="field-label">Courses Roadmap</label>
                                        <FieldArray name="assignedStudents">
                                            {({ push, remove, form }) => (
                                                <CustomSelect
                                                    name="assignedStudents"
                                                    options={studentDummyData.map((student) => ({
                                                        value: student.id,
                                                        label: student.name
                                                    }))}
                                                    isMulti={true}
                                                    value={values.assignedStudents}
                                                    placeholder="Select or search students..."
                                                    onChange={(selectedOptions) => {
                                                        // Update the array with only the selected options
                                                        form.setFieldValue('assignedStudents', selectedOptions);
                                                    }}
                                                    onBlur={() => form.setFieldTouched('assignedStudents', true)}
                                                />
                                            )}
                                        </FieldArray>
                                        <ErrorMessage name="assignedStudents" component="div" className="error" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mt-3 d-flex justify-content-end gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => navigate('/admin/students')}
                                                className="cancel-btn"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                {isSubmitting
                                                    ? studentId
                                                        ? 'Saving Changes...'
                                                        : 'Adding Student...'
                                                    : studentId
                                                      ? 'Save Changes'
                                                      : 'Add Student'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </div>
        </div>
    );
};

export default NewStudent;
