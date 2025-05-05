import React from 'react';

// Define this separately or inline
const AddColumnHeader = (props) => {
    const buttonRef = useRef();

    const handleClick = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        props.setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
        props.setShowColumnDropdown((prev) => !prev);
    };

    return (
        <div
            ref={buttonRef}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleClick}
        >
            +
        </div>
    );
};



export default AddColumnHeader;