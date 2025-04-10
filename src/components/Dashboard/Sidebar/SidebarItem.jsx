import { collapseSidebar } from '@redux/theme/theme_slice.js';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';

const SidebarItem = ({ item, selectedItemId, handleSideBarClick }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const checkScreenSize = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 768) {
            dispatch(collapseSidebar(true));
        }
    };

    const changeRoute = () => {
        handleSideBarClick(item);
        checkScreenSize();
    };

    // Improved active state logic
    const isActive = useMemo(() => {
        // Special case for Courses - active on any course-related page
        if (item.name === 'Courses' && location.pathname.includes('/courses/')) {
            return true;
        }
        // Default case - match exact or starts with linkTo
        return selectedItemId === item.id || 
               (item.linkTo && location.pathname.startsWith(item.linkTo));
    }, [selectedItemId, item.id, item.linkTo, item.name, location.pathname]);

    return (
        <>
            {item?.role ? (
                <div className="side-bar-profile">
                    <div className="profile-wrapper">
                        <img src={item.iconLight} className="profile-pic" alt="nav-icon" />
                    </div>
                    <div className="profile-name">
                        <p>{item.name}</p>
                        <span>{item.role}</span>
                    </div>
                </div>
            ) : (
                <Link
                    to={item.linkTo}
                    className={isActive ? 'active-item' : ''}
                    onClick={changeRoute}
                >
                    <img src={item.iconLight} className="side-nav-icon" alt="nav-icon" />
                    <span>{item.name}</span>
                </Link>
            )}
        </>
    );
};
export default SidebarItem;