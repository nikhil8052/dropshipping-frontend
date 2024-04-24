import './topbar.scss';
import ProfileDropdown from '../DropDown/Profile/ProfileDropdown';
import NotificationDropdown from '../DropDown/Notification/NotificationDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@redux/theme/theme_slice.js';
import { adminSidebarItems, coachSidebarItems, sideBarItems, studentSidebarItems } from '../Sidebar/sidebarData';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
const Topbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { userInfo } = useSelector((state) => state?.auth);
    const [title, setTitle] = useState('');

    const role = userInfo?.role;
    const email = userInfo?.email;
    const items = role === 'admin' ? adminSidebarItems : role === 'coach' ? coachSidebarItems : studentSidebarItems;

    const getTopTitle = (path) => {
        const findTitle = (items) => {
            for (const item of items) {
                if (path === item.linkTo) {
                    return item.name;
                }
                if (item.child) {
                    const found = findTitle(item.child);
                    if (found) return found;
                }
            }
            return null;
        };
        const title = findTitle(items);
        return title;
    };
    useEffect(() => {
        const title = getTopTitle(location.pathname);
        setTitle(title);
    }, [location.pathname]);

    const notifications = [
        {
            id: 1,
            message: 'Alex sent a message',
            seen: true
        },
        {
            id: 2,
            message: 'Bob subscribed',
            seen: false
        },
        {
            id: 3,
            message: 'Alice joined chat',
            seen: true
        }
    ];

    const notificationHandler = () => {
        // handle notification click
    };
    const logoutHandler = () => {
        // handle logout
    };

    return (
        <>
            <div className="menue-toggler-wrapper">
                <button onClick={() => dispatch(toggleSidebar())} className="menu-toggler" type="button">
                    <FontAwesomeIcon icon={faBarsStaggered} />
                </button>
            </div>
            <div className="top-nav-title">
                {title === 'Dashboard' ? (
                    <div>
                        <h3>{title}</h3>
                        {/* Later we add name here */}
                        <p className="sub-title">
                            Welcome <strong>"{email}"</strong>
                        </p>
                    </div>
                ) : (
                    <h3 className="main-title">{title}</h3>
                )}
            </div>
        </>
    );
};
export default Topbar;
