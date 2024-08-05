import React, { useState, useEffect } from 'react';
import { Container, Nav, Card, Button } from 'react-bootstrap';
import './sidebar.scss';
import { useNavigate } from 'react-router-dom';
import logoImg from '@icons/dropship-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import SidebarItem from './SidebarItem';
import SidebarItemCollapse from './SidebarItemCollapse';
import { collapseSidebar } from '@redux/theme/theme_slice.js';
import ConfirmationBox from '../../ConfirmationBox/ConfirmationBox';
import { logoutUser } from '@redux/auth/auth_slice';
import { changeLink } from '@redux/sidebar/sidebarSlice';
import dotBlue from '@icons/dot-blue-2.svg';

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
        const items = role === 'ADMIN' ? adminSidebarItems : role === 'COACH' ? coachSidebarItems : studentSidebarItems;
        setUpdatedItems(items);
    }, [role, activeSidebarItem]);

    const sideBarEventModal = role === 'STUDENT';

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
                    body="Are you sure you want to Logout?"
                    onConfirm={() => dispatch(logoutUser())}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-button"
                    activeBtn="yes-button"
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
                        <div className="side-nav-scroll">
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

                            {sideBarEventModal && (
                                <div className="side-bar-event">
                                    <Card className="custom-event-card">
                                        <Card.Header className="d-flex flex-column align-items-start">
                                            <div className="d-flex align-items-center mb-2 w-100">
                                                <div className="calendar-icon me-2"></div>
                                                <Card.Text className="mb-0 text-start text-nowrap">
                                                    Upcoming Event
                                                </Card.Text>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center w-100">
                                                <Card.Text className="mb-0 text-nowrap">
                                                    <img src={dotBlue} alt="Dot" /> Meeting with Prashant...
                                                </Card.Text>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="d-flex align-items-center justify-content-between mb-2 px-2">
                                                <Card.Text className="mb-0 event-time">8:45 AM</Card.Text>
                                                <div className="exchange-icon"></div>
                                                <Card.Text className="mb-0 event-time">10:45 AM</Card.Text>
                                            </div>
                                            <Button variant="primary" className="w-100 mt-3  zoom-btn">
                                                <div className="zoom-icon me-2"></div>
                                                Go to Zoom link
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </div>

                        <div className={`side-bar-profile ${sideBarEventModal ? 'remove-auto' : ''}`}>
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
                                <p>{userInfo?.name.split(' ')[0]}</p>
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
