import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const CourseSkeletonCard = () => {
    return (
        <div
            className="course-skeleton-card"
            style={{
                width: '100%',
                borderRadius: '10px',
                padding: '10px',
                marginBottom: '20px',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}
        >
            <Skeleton
                variant="rectangular"
                height={120}
                style={{ borderRadius: '10px', marginBottom: '10px' }}
            />
            <Skeleton variant="text" height={24} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
        </div>
    );
};

export default CourseSkeletonCard;
