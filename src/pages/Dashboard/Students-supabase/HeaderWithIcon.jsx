import React from 'react';

const HeaderWithIcon = (props) => {
  const { icon, displayName } = props;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {icon && typeof icon === 'string' && (
        <img src={icon} alt="icon" style={{ width: 16, height: 16 }} />
      )}
      <span>{displayName}</span>
    </div>
  );
};

export default HeaderWithIcon;
