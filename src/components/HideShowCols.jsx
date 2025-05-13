import React, { useRef } from 'react';
import Dot from '../assets/icons/dot.svg';

const HideShowCols = ({ showHideDiv, setShowHideDiv, setShowHidePosition, setSelectPosition }) => {
  const headerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();

    if (showHideDiv) {
      // Panel is already open; just close it
      setShowHideDiv(false);
      return;
    }

    // Only calculate position when opening
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const newPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 200,
      };
      setShowHidePosition(newPosition);
      setSelectPosition(newPosition);
      setShowHideDiv(true);
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