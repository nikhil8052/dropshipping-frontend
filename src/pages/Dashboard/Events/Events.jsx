import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Row, DropdownButton, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import toast from 'react-hot-toast';
import TextExpand from '@components/TextExpand/TextExpand';
import DateRenderer from '@components/DateFormatter/DateFormatter';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import eyeIcon from '@icons/basil_eye-solid.svg';
import add from '@icons/add_white.svg';
import downArrow from '@icons/down-arrow.svg';
import { eventsDummyData } from '../../../data/data';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../../styles/Events.scss';
import '../../../styles/Common.scss';

const Events = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const [expanded, setExpanded] = useState(false);
    const [studentModal, setStudentModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        studentId: null
    });
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const navigate = useNavigate();

    const [eventsData, setEventsData] = useState(null);

    const [selectedEvent, setSelectedEvent] = useState('Upcoming Events');

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            setEventsData(eventsDummyData);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (event) => {
        // Handle row click event here
        if (selectedRowId === event.data.id) {
            setSelectedRowId(null);
            return;
        }
        setSelectedRowId(event.data.id);
    };

    const handleCreateClick = () => {
        // Handle create button click event here
        navigate(`/${role}/events/new`);
    };

    const handleEditClick = (id) => {
        // Handle edit action here
        navigate(`/${role}/events/edit`, {
            state: {
                eventId: id
            }
        });
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal(true);
    };

    const handleViewClick = (id) => {
        // Handle delete action here
        // navigate(`/${role}/events/details`);
        navigate(`/${role}/events/detail`, {
            state: {
                event: {
                    id,
                    name: 'Tony Serna',
                    title: 'Coach',
                    meetingId: '226326',
                    password: '4K22MJ7',
                    topic: 'Detailed meeting about the new course descriptions, their time frame.',
                    dateTime: 'Feb 2, 2024 19:28',
                    timeZone: 'Central Standard Time (GMT-6)',
                    attendees: [
                        'https://randomuser.me/api/portraits/men/5.jpg',
                        'https://randomuser.me/api/portraits/men/5.jpg',
                        'https://randomuser.me/api/portraits/men/5.jpg',
                        'https://randomuser.me/api/portraits/men/5.jpg',
                        'https://randomuser.me/api/portraits/men/5.jpg'
                    ],
                    attendeesCount: 15,
                    image: 'https://randomuser.me/api/portraits/men/1.jpg'
                },
                role
            }
        });
        // navigate(`/student/events/detail`);
    };
    const handleCloseModal = () => {
        resetProductModal();
    };

    const resetProductModal = () => {
        setStudentModal({
            show: false,
            title: '',
            isEditable: false,
            studentId: null
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            const data = await axiosWrapper(
                'delete',
                `${import.meta.env.VITE_JSONPLACEHOLDER}/posts/${selectedRowId}}`
            );
            toast.success(data?.message || 'Event deleted successfully');
        } catch (error) {
            return;
        } finally {
            setLoadingCRUD(false);
            setShowDeleteModal(false);
        }
    };

    const handleEventSelect = (eventKey, coach) => {
        setSelectedEvent(coach);
    };

    const handleDeleteClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal(true);
    };

    /*eslint-disable */
    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                    <div
                        className="btn-light action-button delete-button"
                        onClick={() => props.onViewClick(props.data.id)}
                    >
                        <img src={eyeIcon} className="action-icon ms-0" alt="action-icon" />
                    </div>
                </Col>
                <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                    <div className="action-button edit-button" onClick={() => props.onEditClick(props.data.id)}>
                        <img src={editIcon} className="action-icon ms-0" alt="action-icon" />
                    </div>
                </Col>
                <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                    <div
                        className="btn-light action-button delete-button"
                        onClick={() => props.onDeleteClick(props.data.id)}
                    >
                        <img src={deleteIcon} className="action-icon" alt="action-icon" />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
    const toggleExpand = (event) => {
        // Specifically in this component, we need to prevent the event from propagating to the parent element
        event.stopPropagation();
        setExpanded(!expanded);
    };
    const LinkRenderer = (props) => (
        <div key={props.data.id}>
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">{props.value}</Tooltip>}>
                <div className="d-flex align-items-center gap-2">
                    <a
                        href={props.value}
                        target="_blank" // Open link in a new tab
                        rel="noopener noreferrer" // Recommended for security
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            display: 'inline-block',
                            textDecoration: 'underline',
                            maxWidth: '150px', // Adjust as necessary
                            color: 'rgba(72, 128, 255, 1)'
                        }}
                    >
                        Meeting Link
                    </a>
                </div>
            </OverlayTrigger>
        </div>
    );
    /*eslint-disable */

    const columns = [
        {
            headerName: 'Topic',
            field: 'topic',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
        },
        {
            headerName: 'Join Link',
            field: 'joinLink',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: LinkRenderer,
            resizable: false
        },
        {
            headerName: 'Date & Time',
            field: 'dateTime',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            cellRenderer: DateRenderer,
            wrapText: true,
            autoHeight: true,
            resizable: false
        },
        {
            headerName: 'Event Host',
            field: 'eventHost',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            cellRenderer: TextExpand,
            wrapText: true,
            autoHeight: true,
            resizable: false
        },
        {
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onEditClick: handleEditClick,
                onDeleteClick: handleDeleteClick,
                onViewClick: handleViewClick
            },
            pinned: 'right',
            maxWidth: 140,
            sortable: false,
            filter: false,
            resizable: false,
            cellClass: ['d-flex', 'align-items-center', 'justify-content-center']
        }
    ];
    return (
        <div className="events-page">
            <Helmet>
                <title>Coaches | Dropship Academy</title>
            </Helmet>
            {studentModal.show && (
                <Modal size="large" show={studentModal.show} onClose={handleCloseModal} title={studentModal.title}>
                    <ProductForm productModal={studentModal} resetModal={resetProductModal} />
                </Modal>
            )}
            {showDeleteModal && (
                <ConfirmationBox
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    loading={loadingCRUD}
                    title="Delete Event"
                    body="Are you sure you want to delete this Event?"
                    onConfirm={handleDeleteSubmit}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-button"
                    activeBtn="delete-button"
                    activeBtnTitle="Delete"
                />
            )}
            <Table
                columns={columns}
                tableData={eventsData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <div className="btn-wrapper">
                        <div className="text-nowrap filter-by-text d-flex justify-content-even align-items-center">
                            <span className="me-2"> Filter By:</span>
                            <DropdownButton
                                title={
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <span>{selectedEvent}</span>
                                        <img src={downArrow} alt="Down arrow" />
                                    </div>
                                }
                                defaultValue={selectedEvent}
                                className="dropdown-button"
                            >
                                {['All Events', 'Upcoming Events', 'Past Events'].map((event) => (
                                    <Dropdown.Item
                                        onClick={(e) => handleEventSelect(e, event)}
                                        key={event}
                                        eventKey={event}
                                        className="my-1 ms-2"
                                    >
                                        <span className="event-name"> {event}</span>
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>

                        <Button className="add-button" onClick={handleCreateClick}>
                            <img src={add} alt="" /> <span className="ms-1">Create New Event</span>
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default Events;
