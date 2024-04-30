import React from 'react';
import '../../../styles/Courses.scss';
import { Button, Col, Row, Container, Spinner, Card } from 'react-bootstrap';
import Vector from '../../../assets/icons/Vector.svg';

const UploadFiles = () => {
    return (
        <>
            <div className="upload-form-section">
                <Container>
                    <div className="section-title">
                        <p>Upload Files</p>
                    </div>
                    <div className="upload-course-form">
                        <Col xs={12} sm={12} md={5} lg={5} xl={3}>
                            <div className="img-upload-section"></div>
                        </Col>
                        <Col xs={12} sm={12} md={5} lg={5} xl={3}></Col>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default UploadFiles;
