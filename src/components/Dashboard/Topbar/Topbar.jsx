import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@redux/theme/theme_slice.js';
import { adminSidebarItems, coachSidebarItems, studentSidebarItems } from '../Sidebar/sidebarData';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './topbar.scss';

const Topbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { userInfo } = useSelector((state) => state?.auth);
    const [title, setTitle] = useState('');

    const role = userInfo?.role;
    const name = userInfo?.name?.split(' ')[0];
    const items = role === 'ADMIN' ? adminSidebarItems : role === 'COACH' ? coachSidebarItems : studentSidebarItems;

    const getTopTitle = (path) => {
        const findTitle = (items) => {
            for (const item of items) {
                if (path === item.linkTo) {
                    return item.name;
                }
                // Add the possible combinations that have same top bar title
                if (item?.pathCombinations?.includes(path)) {
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
                            Welcome <strong>"{name}"</strong>
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
