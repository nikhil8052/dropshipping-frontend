import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PublishCourses from './PublishCourses';
import BasicInformation from './BasicInformation';
import UploadFiles from './UploadFiles';
import ClipboardText from '@icons/ClipboardText.svg';
import Stack from '@icons/Stack.svg';
import task_alt from '@icons/task_alt.svg';
import CaretRight from '@icons/CaretRight.svg';
import '../../../styles/Courses.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AddNewCourse = () => {
    const location = useLocation();
    const isNewCoursePage = location.pathname === '/admin/courses/new';
    const navigate = useNavigate();

    return (
        <div className="addcourse-section">
            <div className="addcourse-nav ">
                <p onClick={() => navigate('/admin/courses')} style={{ cursor: 'pointer' }}>
                    Courses
                </p>
                {isNewCoursePage ? (
                    <span>
                        <img src={CaretRight} alt=">" /> Add New Courses{' '}
                    </span>
                ) : (
                    ''
                )}
            </div>
            <Row>
                <div className="course-tabs">
                    <Tabs
                        defaultActiveKey="basic-information"
                        id="justify-tab-example"
                        className="mb-3"
                        justify
                        variant="underline"
                    >
                        <Tab
                            eventKey="basic-information"
                            title={
                                <span>
                                    <img src={Stack} alt="course-icon" /> Basic Information
                                </span>
                            }
                        >
                            <BasicInformation />
                        </Tab>
                        <Tab
                            eventKey="upload_files"
                            title={
                                <span>
                                    <img src={ClipboardText} alt="course-icon" /> Upload Files
                                </span>
                            }
                        >
                            <UploadFiles />
                        </Tab>
                        <Tab
                            eventKey="publish-course"
                            title={
                                <span>
                                    <img src={task_alt} alt="course-icon" /> Publish Course
                                </span>
                            }
                        >
                            <PublishCourses />
                        </Tab>
                    </Tabs>
                </div>
            </Row>
        </div>
    );
};

export default AddNewCourse;
