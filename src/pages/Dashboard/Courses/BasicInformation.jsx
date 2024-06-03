import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dropDownArrow from '@icons/drop-down-black.svg';
import { coachDummyData, courseCategory } from '../../../data/data';
import '../../../styles/Common.scss';
import '../../../styles/Courses.scss';

const BasicInformation = ({ onNext }) => {
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const navigate = useNavigate();
    const courseData = {
        title: '',
        subTitle: '',
        courseCategory: '',
        moduleManager: ''
    };

    const schema = Yup.object({
        title: Yup.string().required('Please enter the course title'),
        subTitle: Yup.string().required('Please enter the course subtitle'),
        courseCategory: Yup.string().required('Please select a course category'),
        moduleManager: Yup.string().required('Please select a module manager')
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
            // Implement form submission logic here
            onNext();
            resetForm();
            setSubmitting(false);
        }, 1000);
    };

    return (
        <div className="add-course-form-section">
            <div className="section-title">
                <p>Basic Information</p>
            </div>
            <div className="add-course-form">
                <Formik initialValues={courseData} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
                    {({ isSubmitting, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={12} xs={12}>
                                    <label className="field-label">Title</label>
                                    <Field
                                        name="title"
                                        className="field-control"
                                        type="text"
                                        placeholder="You course title"
                                    />
                                    <ErrorMessage name="title" component="div" className="error" />

                                    <label className="field-label">Subtitle</label>
                                    <Field
                                        name="subTitle"
                                        className="field-control"
                                        type="text"
                                        placeholder="You course subtitle"
                                    />
                                    <ErrorMessage name="subTitle" component="div" className="error" />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} xs={12}>
                                    <label className="field-label">Course Category</label>
                                    {/* eslint-disable */}
                                    <Field
                                        name="courseCategory"
                                        className="field-select-control"
                                        type="text"
                                        component={({ field, form }) => {
                                            const handleSelect = (eventKey) => {
                                                const selectedField = courseCategory.find(
                                                    (category) => category.id.toString() === eventKey
                                                );
                                                form.setFieldValue(field.name, selectedField.label);
                                            };

                                            return (
                                                <>
                                                    <DropdownButton
                                                        title={
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span>{field.value || 'Select a category ...'}</span>
                                                                <img src={dropDownArrow} alt="arrow" />
                                                            </div>
                                                        }
                                                        id={field.name}
                                                        onSelect={handleSelect}
                                                        className="dropdown-button w-100"
                                                    >
                                                        {courseCategory.map((category) => (
                                                            <Dropdown.Item
                                                                key={category.id}
                                                                eventKey={category.id}
                                                                className="my-1 ms-2 w-100"
                                                            >
                                                                <span className="category-name">{category.label}</span>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </DropdownButton>
                                                    {form.touched[field.name] && form.errors[field.name] && (
                                                        <div className="error mt-2">{form.errors[field.name]}</div>
                                                    )}
                                                </>
                                            );
                                        }}
                                    />
                                    <label className="field-label">Module Manager</label>
                                    {/* eslint-disable */}
                                    <Field
                                        name="moduleManager"
                                        className="field-select-control"
                                        type="text"
                                        component={({ field, form }) => {
                                            const handleSelect = (eventKey) => {
                                                const selectedCoach = coachDummyData.find(
                                                    (coach) => coach.id.toString() === eventKey
                                                );
                                                form.setFieldValue(field.name, selectedCoach.name);
                                            };

                                            return (
                                                <>
                                                    <DropdownButton
                                                        title={
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span>{field.value || 'Select...'}</span>
                                                                <img src={dropDownArrow} alt="arrow" />
                                                            </div>
                                                        }
                                                        id={field.name}
                                                        onSelect={handleSelect}
                                                        className="dropdown-button coach-btn w-100"
                                                    >
                                                        <Dropdown.Header>
                                                            All Coaches ({coachDummyData.length})
                                                        </Dropdown.Header>
                                                        {coachDummyData.map((coach) => (
                                                            <Dropdown.Item
                                                                key={coach.id}
                                                                eventKey={coach.id}
                                                                className="my-1 ms-2"
                                                            >
                                                                <img
                                                                    src={coach.avatarUrl}
                                                                    className="avatar-student"
                                                                    alt={coach.name}
                                                                />
                                                                <span className="coach-name">{coach.name}</span>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </DropdownButton>
                                                    {form.touched[field.name] && form.errors[field.name] && (
                                                        <div className="error">{form.errors[field.name]}</div>
                                                    )}
                                                </>
                                            );
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className="mt-3 d-flex justify-content-between gap-3">
                                        <Button
                                            type="button"
                                            onClick={() => navigate(`/${role}/courses`)}
                                            className="cancel-btn"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Save Changes...' : 'Save & next'}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default BasicInformation;
