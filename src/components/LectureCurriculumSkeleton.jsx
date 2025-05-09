import React from 'react';
import { Skeleton } from '@mui/material';

const LectureCurriculumSkeleton = () => {
    return (
        <div className="lecture-curriculum new-page-view">
            <div className="title-container">
                <Skeleton className='my-2' variant="text" width="60%" height={30} />

                <Skeleton variant="circle" width={30} height={30} className="circle-loader" />
            </div>
            
            
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="text" width="100%" height={100} />
        </div>
    );
};

export default LectureCurriculumSkeleton;
