import React, { useState, useEffect, useCallback } from 'react';
import { Container, Nav, Card, Button } from 'react-bootstrap';
import './sidebar.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '@icons/dropship-logo.svg';
import subImg from '@icons/Logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleUser, faBarsStaggered, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import axiosWrapper from '@utils/api';
import { API_URL } from '@utils/apiUrl';
import SidebarItem from './SidebarItem';
import SidebarItemCollapse from './SidebarItemCollapse';
import { collapseSidebar, toggleSidebar } from '@redux/theme/theme_slice.js';
import ConfirmationBox from '../../ConfirmationBox/ConfirmationBox';
import { logoutUser } from '@redux/auth/auth_slice';
import { changeLink } from '@redux/sidebar/sidebarSlice';
import dotBlue from '@icons/dot-blue-2.svg';
import faRoad from '@icons/roadmap.svg';
import logoutIcon from '@icons/logout-light.svg';
import { adminSidebarItems, coachSidebarItems, studentSidebarItems } from './sidebarData';
import { getFormattedTimes, trimLongText } from '../../../utils/common';

const Sidebar = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state?.auth?.userToken);
    const collapsed = useSelector((state) => state.theme.collapsed);
    const autoCollapsed = useSelector((state) => state.theme.autoCollapsed);
    const { userInfo } = useSelector((state) => state?.auth);
    const [eventData, setEventData] = useState({});
    const [updatedItems, setUpdatedItems] = useState([]);
    const { activeSidebarItem } = useSelector((state) => state.activeSidebarItem);
    const location = useLocation();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);

    const role = userInfo?.role;
    const sideBarStudentEventModal = role === 'STUDENT';

    const updateSidebarItems = useCallback(() => {
        const items =
            role === 'ADMIN' ? [...adminSidebarItems] :
                role === 'COACH' ? [...coachSidebarItems] :
                    [...studentSidebarItems];

    
        if (role === 'STUDENT' && userInfo?.roadMap && userInfo?.roadmapAccess == 'true') {

            const roadmapItem = {
                id: 'roadmap',
                name: 'Routekaart',
                iconLight: faRoad,
                linkTo: '/student/roadmap'
            };

            const settingsIndex = items.findIndex((item) => item.name === 'Settings');
            if (settingsIndex > -1) {
                items.splice(settingsIndex, 0, roadmapItem);
            } else {
                items.push(roadmapItem);
            }
        }
        setUpdatedItems(items);
    }, [role, userInfo?.roadMap, userInfo?.roadmapAccess]);

    useEffect(() => {
        updateSidebarItems();
    }, [updateSidebarItems]);


    const selectActiveItem = useCallback(() => {
        if (!updatedItems.length) return;

        const findActiveItem = (items) => {
            for (const item of items) {
                if (location.pathname === item.linkTo ||
                    (item.linkTo !== '/' && location.pathname.startsWith(`${item.linkTo}/`))) {
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

        if (location.pathname.includes('/courses/') && activeSidebarItem === 'roadmap') {
            const coursesItem = updatedItems.find((item) => item.name === 'Courses');
            if (coursesItem) {
                dispatch(changeLink(coursesItem.id));
                return;
            }
        }

        if (activeItem && activeItem.id !== activeSidebarItem) {
            dispatch(changeLink(activeItem.id));
        }
    }, [location.pathname, updatedItems, activeSidebarItem, dispatch]);

    useEffect(() => {
        selectActiveItem();
    }, [selectActiveItem]);

    const handleSideBarClick = (item) => {
        if (item.name === 'Logout') {
            handleLogoutClick();
        } else if (item.linkTo) {
            dispatch(changeLink(item.id));
            navigate(item.linkTo);
        }
    };

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
                    title="Uitloggen"
                    body="Are you sure you want to Logout?"
                    onConfirm={() => dispatch(logoutUser())}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-btn"
                    activeBtn="submit-btn"
                    modalClassName="logout-popup"
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
                ) : null}

                <Container>
                    <div className="brand-logo">
                        <button onClick={() => dispatch(toggleSidebar())} className="menu-toggler" type="button">
                            <FontAwesomeIcon icon={collapsed ? faChevronRight : faBarsStaggered} />
                        </button>
                        <img src={logoImg} alt="brand-logo" className="main-logo" />
                        <img src={subImg} alt="brand-logo" className="sub-logo" />
                    </div>

                    <div className="side-nav-wrapper">
                        <div className="side-nav-scroll">
                            <Nav className="sidebar-nav-items">
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
                            </Nav>
                        </div>

                        <div className={`side-bar-btm ${sideBarStudentEventModal ? 'remove-auto' : ''}`}>
                            <div className="side-bar-profile">
                                <div className="profile-wrapper">
                                    {userInfo?.avatar ? (
                                        <img src={userInfo?.avatar} className="profile-pic" alt="nav-icon" />
                                    ) : (
                                        <FontAwesomeIcon
                                            className="profile-pic"
                                            size="2xl"
                                            icon={faCircleUser}
                                            color="rgba(200, 202, 216, 1)"
                                        />
                                    )}
                                </div>
                                <div className="profile-name">
                                    <p>{userInfo?.name?.split(' ')[0]}</p>
                                    <span>{userInfo?.role}</span>
                                </div>
                            </div>
                            <button className="logout-btn active-item" onClick={handleLogoutClick}>
                                <img src={logoutIcon} alt="Logout" className="logout-icon" />
                                <span> Uitloggen</span>
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;