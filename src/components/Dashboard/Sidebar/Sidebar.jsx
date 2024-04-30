import React, { useState, useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import './sidebar.scss';
import { useNavigate } from 'react-router-dom';
import logoImg from '@icons/dropship-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import SidebarItem from './SidebarItem';
import SidebarItemCollapse from './SidebarItemCollapse';
import { collapseSidebar } from '@redux/theme/theme_slice.js';
import ConfirmationBox from '../../ConfirmationBox/ConfirmationBox';
import { logoutUser } from '@redux/auth/auth_slice';
import { changeLink } from '@redux/sidebar/sidebarSlice';
import profile from '@images/user-img.jpg';
// import all static icons
import { adminSidebarItems, coachSidebarItems, studentSidebarItems } from './sidebarData';

const Sidebar = () => {
    const dispatch = useDispatch();
    const collapsed = useSelector((state) => state.theme.collapsed);
    const autoCollapsed = useSelector((state) => state.theme.autoCollapsed);
    const { userInfo } = useSelector((state) => state?.auth);
    const [updatedItems, setUpdatedItems] = useState([]);

    // Later we change this to actual role

    const role = userInfo?.role;

    const [modalShow, setModalShow] = useState(false);
    const { activeSidebarItem } = useSelector((state) => state.activeSidebarItem);

    useEffect(() => {
        const items = role === 'admin' ? adminSidebarItems : role === 'coach' ? coachSidebarItems : studentSidebarItems;
        setUpdatedItems(items);
    }, [role]);

    const navigate = useNavigate();

    const selectActiveItem = () => {
        const findActiveItem = (items) => {
            for (const item of items) {
                if (window.location.pathname === item.linkTo) {
                    return item;
                }
                if (item.child) {
                    const found = findActiveItem(item.child);
                    if (found) return found;
                }
            }
            return null;
        };

        const activeItem = findActiveItem(updatedItems);
        if (activeItem) {
            dispatch(changeLink(activeItem.id));
        }
    };

    const handleSideBarClick = (item) => {
        dispatch(changeLink(item.id)); // Dispatch the selected item to update the activeLink

        if (item.name === 'Logout') {
            handleLogoutClick();
        } else if (item.linkTo) {
            navigate(item.linkTo);
        }
    };

    useEffect(() => {
        selectActiveItem();
        // This effect should ideally depend on the pathname to update active items on route change
    }, [location.pathname, updatedItems]);

    const handleLogoutClick = () => {
        setModalShow(!modalShow);
    };

    return (
        <React.Fragment>
            {modalShow && (
                <ConfirmationBox
                    show={modalShow}
                    onClose={handleLogoutClick}
                    loading={false}
                    title="Logout"
                    body="Are you sure you want to logout?"
                    onConfirm={() => dispatch(logoutUser())}
                />
            )}
            <div className={`sidebar ${collapsed ? 'hide-sidebar' : ''}`}>
                {autoCollapsed ? (
                    <button
                        type="button"
                        onClick={() => dispatch(collapseSidebar(true))}
                        className="btn-collapse-sidebar"
                    >
                        <FontAwesomeIcon className="collapse-icon" icon={faCircleXmark} />
                    </button>
                ) : (
                    <></>
                )}

                <Container>
                    <div className="brand-logo">
                        <img src={logoImg} alt="brand-logo" />
                    </div>
                    <div className="side-nav-wrapper">
                        <Nav defaultActiveKey="/" className="sidebar-nav-items">
                            {updatedItems.map((item) =>
                                item.child ? (
                                    <SidebarItemCollapse
                                        key={item.id}
                                        item={item}
                                        selectedItemId={activeSidebarItem}
                                        handleSideBarClick={handleSideBarClick}
                                    />
                                ) : (
                                    <SidebarItem
                                        key={item.id}
                                        item={item}
                                        selectedItemId={activeSidebarItem}
                                        handleSideBarClick={handleSideBarClick}
                                    />
                                )
                            )}
                            {/* Last child should be an image and role */}
                        </Nav>
                        <div className="side-bar-profile">
                            <div className="profile-wrapper">
                                <img src={profile} className="profile-pic" alt="nav-icon" />
                            </div>
                            <div className="profile-name">
                                <p>{userInfo?.email}</p>
                                <span>{userInfo?.role}</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};
export default Sidebar;
