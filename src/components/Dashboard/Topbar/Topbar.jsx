import './topbar.scss';
import ProfileDropdown from '../DropDown/Profile/ProfileDropdown';
import NotificationDropdown from '../DropDown/Notification/NotificationDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '@redux/theme/theme_slice.js';
const Topbar = () => {
    const dispatch = useDispatch();
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
        <div className="top-nav">
            <div className="nav-left-items">
                <button onClick={() => dispatch(toggleSidebar())} className="menu-toggler" type="button">
                    <FontAwesomeIcon icon={faBarsStaggered} />
                </button>
            </div>
            <div className="nav-right-items">
                <NotificationDropdown items={notifications} handler={notificationHandler} />
                <ProfileDropdown handler={logoutHandler} />
            </div>
        </div>
    );
};
export default Topbar;
