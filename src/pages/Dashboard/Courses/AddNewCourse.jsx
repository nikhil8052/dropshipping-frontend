import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import PublishCourses from './PublishCourses';
import BasicInformation from './BasicInformation';
import UploadFiles from './UploadFiles';
import ClipboardText from '@icons/ClipboardText.svg';
import Stack from '@icons/Stack.svg';
import taskAlt from '@icons/task_alt.svg';
import CaretRight from '@icons/CaretRight.svg';
import '../../../styles/Courses.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddNewCourse = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    const isNewCoursePage = location.pathname === '/admin/courses/new' || '/coach/courses/new';

    useEffect(() => {
        if (userInfo) {
            const { role } = userInfo;
            setIsAdmin(role === 'admin');
        }
    }, [userInfo]);
    return (
        <div className="addcourse-section">
            <div className="addcourse-nav ">
                {isAdmin ? <Link to="/admin/courses">Courses</Link> : <Link to="/coach/courses">Courses</Link>}

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
                                <span className="tab-span">
                                    <img src={Stack} alt="course-icon" /> Basic Information
                                </span>
                            }
                        >
                            <BasicInformation />
                        </Tab>
                        <Tab
                            eventKey="upload_files"
                            title={
                                <span className="tab-span">
                                    <img src={ClipboardText} alt="course-icon" /> Upload Files
                                </span>
                            }
                        >
                            <UploadFiles />
                        </Tab>
                        <Tab
                            eventKey="publish-course"
                            title={
                                <span className="tab-span">
                                    <img src={taskAlt} alt="course-icon" /> Publish Course
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
