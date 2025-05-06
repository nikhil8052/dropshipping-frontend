import React, { useRef } from 'react';
import Plus from '../assets/images/plus.svg';

const AddColumnHeader = ({ setShowColumnSelect, setSelectPosition }) => {
  const headerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setSelectPosition({
        top: rect.bottom + window.scrollY + 0,
        left: rect.left + window.scrollX - 200,
      });
      setShowColumnSelect(prev => !prev);
    }
  };

  return (
    <div 
      ref={headerRef}
      className="add-column-header"
      onClick={handleClick}
    >
      <img src={Plus} alt="Add column" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
    </div>
  );
};

export default AddColumnHeader; // Make sure this line exists