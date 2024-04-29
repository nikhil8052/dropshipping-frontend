import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@components/Card/Card';
import CourseCard from '../../../components/CourseCard/CourseCard';
import eventImg from '../../../assets/images/Event-Image.svg';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import '../../../styles/Courses.scss';
const Courses = () => {
    const courseCards = [
        {
            id: 1,
            title: 'Total budget',
            detail: '7500$',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 2,
            title: 'Design Conference',
            detail: 'Coach: David Everson',
            lectureNo: 'Lectures: 28',
            img: eventImg
        },
        {
            id: 3,
            title: 'Valued products',
            detail: '750',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 4,
            title: 'active users',
            detail: '1.5K',
            lectureNo: '1',

            img: eventImg
        },
        {
            id: 5,
            title: 'Total budget',
            detail: '7500$',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 6,
            title: 'Expenses',
            detail: '1500$',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 7,
            title: 'Valued products',
            detail: '750',
            lectureNo: '1',
            img: eventImg
        },
        {
            id: 8,
            title: 'active users',
            detail: '1.5K',
            lectureNo: '1',

            img: eventImg
        }
    ];

    return (
        <>
            <div className="cousre-section">
                <div className="custom-card-course">
                    <Card cardType="large">
                        <Row>
                            <div className="course-topbar">
                                {/* <InputGroup className="mb-3">
                                <Button variant="outline-secondary" id="button-addon1">
                                    Button
                                </Button>
                                <Form.Control
                                    aria-label="Example text with button addon"
                                    aria-describedby="basic-addon1"
                                    placeholder="hello"
                                />
                            </InputGroup> */}
                            </div>
                        </Row>

                        <Row>
                            {courseCards.map((cousre) => (
                                <Col key={cousre.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                    <div className="custom-card-course">
                                        <Card cardType="small">
                                            <CourseCard {...cousre} />
                                        </Card>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Courses;
