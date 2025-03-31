import { collapseSidebar } from '@redux/theme/theme_slice.js';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const SidebarItem = ({ item, selectedItemId, handleSideBarClick }) => {
    const dispatch = useDispatch();

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
                    className={item.id === selectedItemId ? 'active-item' : ''}
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
