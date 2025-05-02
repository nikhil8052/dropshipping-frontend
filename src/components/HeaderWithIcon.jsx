import React from 'react';

const HeaderWithIcon = ({ icon, displayName }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px',
      width: '100%',
      height: '100%'
    }}>
      {icon && <img src={icon} alt="" style={{ width: 16, height: 16 }} />}
      <span>{displayName}</span>
    </div>
  );
};

export default HeaderWithIcon;