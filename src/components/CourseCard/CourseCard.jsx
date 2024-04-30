import React from 'react';
import './CourseCard.scss';

const CourseCard = ({ img, title, detail, lectureNo }) => {
    return (
        <div className="course-card">
            <img src={img} className="course-img " alt="course-icon" />
            <h1 className="course-title">{title}</h1>
            <h2 className="course-des">{detail}</h2>
            <p className="lecture-No">{lectureNo}</p>
        </div>
    );
};

export default CourseCard;
