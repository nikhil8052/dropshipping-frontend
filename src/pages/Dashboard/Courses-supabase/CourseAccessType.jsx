import React, { useState } from 'react';

const accessOptions = [
  { id: 'open', title: 'Open', description: 'All members can access.' },
  { id: 'level', title: 'Level Unlock', description: 'Members unlock at a specific level.' },
  { id: 'buy', title: 'Buy Now', description: 'Members pay a 1-time price to unlock.' },
  { id: 'time', title: 'Time Unlock', description: 'Members unlock after x days.' },
  { id: 'category', title: 'Category', description: 'Members you select can access.' },
];

const CourseAccessType = () => {
  const [selected, setSelected] = useState('category');

  return (
    <div className="access-container">
      {accessOptions.map(option => (
        <div
          key={option.id}
          className={`access-option ${selected === option.id ? 'selected' : ''}`}
          onClick={() => setSelected(option.id)}
        >
          <div className="custom-radio" />
          <div className="content">
            <h4>{option.title}</h4>
            <p>{option.description}</p>
          </div>
        </div>
      ))}
    </div>
   
  );
};

export default CourseAccessType;
