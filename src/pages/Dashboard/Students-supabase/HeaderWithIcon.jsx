import React from "react";

const HeaderWithIcon = (props) => {
  const displayName = props.displayName || props.column?.colDef?.headerName;
  const icon = props.icon;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {icon && <img src={icon} alt="icon" style={{ width: 16, height: 16 }} />}
      <span>{displayName}</span>
    </div>
  );
};

export default HeaderWithIcon;
