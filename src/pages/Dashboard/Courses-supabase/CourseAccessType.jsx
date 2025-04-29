import React, { useEffect } from 'react';

const accessOptions = [
    { id: 'open', title: 'Open', description: 'All members can access.', status: 'archived' },
    { id: 'level', title: 'Level Unlock', description: 'Members unlock at a specific level.', status: 'archived' },
    { id: 'buy', title: 'Buy Now', description: 'Members pay a 1-time price to unlock.', status: 'archived' },
    { id: 'time', title: 'Time Unlock', description: 'Members unlock after x days.', status: 'archived' },
    { id: 'category', title: 'Category', description: 'Members you select can access.', status: 'published' }
];

const CourseAccessType = ({ value, onChange }) => {
    useEffect(() => {
        if (!value) {
            const defaultOption = accessOptions.find((option) => option.status === 'published');
            if (defaultOption) {
                onChange(defaultOption.id);
            }
        }
    }, [value, onChange]);

    return (
        <div className="access-container">
            {accessOptions.map((option) => {
                const isDisabled = option.status === 'archived';
                return (
                    <div
                        key={option.id}
                        className={`access-option ${value === option.id ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => {
                            if (!isDisabled) onChange(option.id);
                        }}
                        style={{
                            opacity: isDisabled ? 0.8 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            pointerEvents: isDisabled ? 'none' : 'auto'
                        }}
                    >
                        <div className="custom-radio" />
                        <div className="content">
                            <h4>{option.title}</h4>
                            <p>{option.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CourseAccessType;
