import React, { useRef } from 'react';
import Dot from '../assets/icons/dot.svg';

const HideShowCols = ({ setShowHideDiv, setShowHidePosition }) => {
  const headerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 200,
      };
      setShowHidePosition(position);
      setShowHideDiv(prev => !prev);
      // Also pass this position up to parent for column selector
      if (typeof onPositionChange === 'function') {
        onPositionChange(position);
      }
    }
  };

  return (
    <div 
      ref={headerRef}
      className="add-column-header"
      onClick={handleClick}
    >
      <img src={Dot} alt="Menu" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
    </div>
  );
};


export default HideShowCols; 