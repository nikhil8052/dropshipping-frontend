import { useEffect, useRef, useState } from 'react';
import '../../../styles/Courses.scss';
import { Button, Col, Row, Container, Spinner } from 'react-bootstrap';
import Card from '@components/Card/Card';
import Carousel from 'react-bootstrap/Carousel';
import CourseSlider from './CourseSlider';

const PublishCourses = () => {
    return (
        <>
            <div className="publish-form-section">
                <div className="section-title">
                    <p>Upload Files</p>
                </div>
                <Card cardType="large">
                    <div className="card-background">
                        <div className="text-heading">
                            <h1>Design Conference</h1>
                            <p>Dropship Academy X</p>
                        </div>
                    </div>
                    <div className="lecture-details">
                        <div className="p-2">
                            <h1>Duration</h1>
                            <p>3 Weeks, 120 Hr</p>
                        </div>
                        <div className="lecture-details-2">
                            <h1>Lectures</h1>
                            <p>28 Video Lectures, 5 Assesments</p>
                        </div>
                        <div className="p-2">
                            <h1>Coach Name</h1>
                            <p>David Richerson</p>
                        </div>
                    </div>
                    <div className="carousel-lecture ">
                        <CourseSlider />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default PublishCourses;
