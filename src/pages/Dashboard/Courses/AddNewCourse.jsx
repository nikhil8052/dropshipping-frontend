import React, { useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Row, Container, Spinner, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Input from '@components/Input/Input';
import downArrow from '@icons/down-arrow.svg';
import { studentDummyData, coachDummyData } from '../../../data/data';
import '../../../styles/Courses.scss';

const AddNewCourse = () => {
    const [selectedCoach, setSelectedCoach] = useState('Select.....');
    const [selectedCourses, setSelectedCourses] = useState('Select.....');

    const inititialValues = {
        title: '',
        subTitle: '',
        courseCategory: '',
        ModuleManager: ''
    };

    const validationSchema = Yup.object().shape({
        // email: Yup.string().email('Please enter a valid email').required('Email is required'),
        // password: Yup.string().required('Password is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log('hello');
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    const handleCoachSelect = (eventKey, coach) => {
        setSelectedCoach(coach.name);
    };
    const handleCourseSelect = (eventKey, coach) => {
        setSelectedCourses(coach.name);
    };
    return (
        <div className="add-course-form-section">
            <Container>
                <div className="section-title">
                    <p>Basic Information</p>
                </div>
                <div className="add-course-form">
                    <Formik initialValues={inititialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                            <FormikForm>
                                <div className="input-field-container">
                                    <Input name="title" placeholder="You course title" label="Title" type="text" />
                                    <p className="input-count">0/80</p>
                                </div>
                                <div className="input-field-container">
                                    <Input
                                        name="subTitle"
                                        placeholder="You course subtitle"
                                        label="Subtitle"
                                        type="text"
                                    />
                                    <p className="input-count">0/80</p>
                                </div>
                                <div className="course-DropdownButton">
                                    <p> Course Category</p>
                                    <DropdownButton
                                        title={
                                            <div className="d-flex justify-content-between  w-100">
                                                <span className="ms-2">{selectedCourses}</span>

                                                <p>
                                                    <img src={downArrow} alt="Filter" srcset="" />
                                                </p>
                                            </div>
                                        }
                                        defaultValue={selectedCourses}
                                        className="dropdown-button w-100 d-flex justify-content-even align-items-center"
                                    >
                                        <Dropdown.Header>All Courses ({coachDummyData.length})</Dropdown.Header>
                                        {coachDummyData.map((coach) => (
                                            <Dropdown.Item
                                                onClick={(e) => handleCourseSelect(e, coach)}
                                                key={coach.id}
                                                eventKey={coach.id}
                                                className="my-1 ms-2"
                                            >
                                                <img src={coach.avatarUrl} className="avatar" alt={coach.name} />
                                                <span className="coach-name"> {coach.name}</span>
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </div>
                                <div className="course-DropdownButton">
                                    <p> Module Manager</p>
                                    <DropdownButton
                                        title={
                                            <div className="d-flex justify-content-between w-100">
                                                <span className="ms-2">{selectedCoach}</span>

                                                <p>
                                                    <img src={downArrow} alt="Filter" srcset="" />
                                                </p>
                                            </div>
                                        }
                                        defaultValue={selectedCoach}
                                        className="dropdown-button w-100 d-flex justify-content-even align-items-center"
                                    >
                                        <Dropdown.Header>All Coaches ({coachDummyData.length})</Dropdown.Header>
                                        {coachDummyData.map((coach) => (
                                            <Dropdown.Item
                                                onClick={(e) => handleCoachSelect(e, coach)}
                                                key={coach.id}
                                                eventKey={coach.id}
                                                className="my-1 ms-2"
                                            >
                                                <img src={coach.avatarUrl} className="avatar" alt={coach.name} />
                                                <span className="coach-name"> {coach.name}</span>
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </div>
                                <div className="course-btn-footer ">
                                    <Button className="cancel-button" type="submit">
                                        {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Cancel'}
                                    </Button>
                                    <Button className="save-button" type="submit">
                                        {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save & Next'}
                                    </Button>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            </Container>
        </div>
    );
};

export default AddNewCourse;
