import { useState } from 'react';
import PublishCourses from './PublishCourses';
import BasicInformation from './BasicInformation';
import UploadFiles from './UploadFiles';
import ClipboardText from '@icons/ClipboardText.svg';
import Stack from '@icons/Stack.svg';
import taskAlt from '@icons/task_alt.svg';
import CaretRight from '@icons/CaretRight.svg';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../../styles/Courses.scss';

const AddNewCourse = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const navigate = useNavigate();
    const role = userInfo?.role;

    const [activeKey, setActiveKey] = useState('basic-information');

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    return (
        <div className="addcourse-section">
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                    Courses <img src={CaretRight} alt=">" />{' '}
                </span>
                Add New Courses
            </div>
            <Tabs
                fill
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k)}
                id="controlled-tab-example"
                className="mb-3"
            >
                <Tab
                    eventKey="basic-information"
                    title={
                        <span className="tab-span">
                            <img src={Stack} alt="course-icon" /> Basic Information
                        </span>
                    }
                >
                    <BasicInformation onNext={() => handleTabChange('upload-files')} />
                </Tab>
                <Tab
                    eventKey="upload-files"
                    title={
                        <span className="tab-span">
                            <img src={ClipboardText} alt="course-icon" /> Upload Files
                        </span>
                    }
                >
                    <UploadFiles
                        onNext={() => handleTabChange('publish-course')}
                        onBack={() => handleTabChange('basic-information')}
                    />
                </Tab>
                <Tab
                    eventKey="publish-course"
                    title={
                        <span className="tab-span">
                            <img src={taskAlt} alt="course-icon" /> Publish Course
                        </span>
                    }
                >
                    <PublishCourses onBack={() => handleTabChange('upload-files')} />
                </Tab>
            </Tabs>
        </div>
    );
};

export default AddNewCourse;
