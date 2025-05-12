import React, { useRef } from 'react';
import Dot from '../assets/icons/dot.svg';

const HideShowCols = React.memo(({ setShowHideDiv, setShowHidePosition, setSelectPosition }) => {
  const headerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      // Use useMemo-equivalent pattern here
      const newPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 200,
      };
      
      // Batch updates if possible
      setShowHideDiv(prev => {
        setShowHidePosition(newPosition);
        setSelectPosition(newPosition);
        return !prev;
      });
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
});


export default HideShowCols; 