import { useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Spinner, Dropdown, DropdownButton } from 'react-bootstrap';
import Input from '@components/Input/Input';
import { coachDummyData } from '../../../data/data';
import '../../../styles/Courses.scss';

const BasicInformation = () => {
    const [selectedCoach, setSelectedCoach] = useState('Select.....');
    const [selectedCourse, setSelectedCourse] = useState('Select.....');

    const inititialValues = {
        title: '',
        subTitle: '',
        courseCategory: '',
        moduleManager: ''
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),

        subTitle: Yup.string().required('Subtitle is required'),

        courseCategory: Yup.string().required('Course category is required'),

        moduleManager: Yup.string().required('Module manager is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    const handleCoachSelect = (eventKey, coach) => {
        setSelectedCoach(coach.name);
    };
    const handleCourseSelect = (eventKey, course) => {
        setSelectedCourse(course.name);
    };
    return (
        <div className="add-course-form-section">
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
                                <Input name="subTitle" placeholder="You course subtitle" label="Subtitle" type="text" />
                                <p className="input-count">0/80</p>
                            </div>
                            <div className="course-DropdownButton">
                                <p> Course Category</p>
                                <DropdownButton
                                    title={
                                        <div className="d-flex justify-content-between  w-100">
                                            <span className="ms-2">{selectedCourse}</span>
                                        </div>
                                    }
                                    defaultValue={selectedCourse}
                                    className="dropdown-button w-100 d-flex justify-content-even align-items-center"
                                >
                                    <Dropdown.Header>All Courses ({coachDummyData.length})</Dropdown.Header>
                                    {coachDummyData.map((course) => (
                                        <Dropdown.Item
                                            onClick={(e) => handleCourseSelect(e, course)}
                                            key={course.id}
                                            eventKey={course.id}
                                            className="my-1 ms-2"
                                        >
                                            <img src={course.avatarUrl} className="avatar" alt={course.name} />
                                            <span className="coach-name"> {course.name}</span>
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
                                <Button className="cancel-btn" type="submit">
                                    {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Cancel'}
                                </Button>
                                <Button className="submit-btn" type="submit">
                                    {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save & Next'}
                                </Button>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default BasicInformation;
