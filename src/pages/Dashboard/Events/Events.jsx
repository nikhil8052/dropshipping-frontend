import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Row, DropdownButton, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import TextExpand from '@components/TextExpand/TextExpand';
import DateRenderer from '@components/DateFormatter/DateFormatter';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import eyeIcon from '@icons/basil_eye-solid.svg';
import calendar from '@icons/calendar.svg';
import downArrow from '@icons/down-arrow.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../../styles/Events.scss';
import '../../../styles/Common.scss';
import { API_URL } from '../../../utils/apiUrl';
import * as types from '../../../redux/actions/actionTypes';

const Events = () => {
    const dispatch = useDispatch();
    const [showDeleteModal, setShowDeleteModal] = useState({
        show: false,
        title: 'Delete Event',
        isEditable: false,
        eventId: null
    });
    const [selectedRowId, setSelectedRowId] = useState(null);
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
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

    const [selectedEvent, setSelectedEvent] = useState('All Events');

    useEffect(() => {
        // Fetch data from API here
        if (selectedEvent) {
            fetchData(selectedEvent);
        }
    }, [selectedEvent]);

    ////////////////// Handlers ////////////////////
    const fetchData = async (query) => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);
            const events = await axiosWrapper('GET', `${API_URL.GET_ALL_EVENTS}?dateTime=${query || ''}`, {}, token);
            setEventsData(events?.data);
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

        dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'eventId', data: id } });
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal(true);
    };

    const handleViewClick = (id) => {
        navigate(`/${role}/events/detail`, {
            state: {
                eventId: id
            }
        });
    };
    const handleCloseModal = () => {
        resetModal();
    };

    const resetModal = () => {
        setStudentModal({
            show: false,
            title: '',
            isEditable: false,
            studentId: null
        });
        setShowDeleteModal({
            show: false,
            title: '',
            isEditable: false,
            eventId: null
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            // Delete API call here
            await axiosWrapper('DELETE', API_URL.DELETE_EVENT.replace(':id', showDeleteModal?.eventId), {}, token);
            fetchData();
            setLoadingCRUD(false);
            resetModal();
        } catch (error) {
            setLoadingCRUD(false);
            resetModal();
        }
    };

    const handleEventSelect = (eventKey, coach) => {
        setSelectedEvent(coach);
    };

    const handleDeleteClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal({
            show: true,
            title: 'Delete Event',
            isEditable: false,
            eventId: id
        });
    };

    // Component Renders

    /*eslint-disable */
    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                    <div
                        className="btn-light action-button delete-button"
                        onClick={() => props.onViewClick(props.data._id)}
                    >
                        <img src={eyeIcon} className="action-icon ms-0" alt="action-icon" />
                    </div>
                </Col>
                {props.data.createdBy?._id.toString() === userInfo._id.toString() && (
                    <>
                        <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                            <div
                                className="action-button edit-button"
                                onClick={() => props.onEditClick(props.data._id)}
                            >
                                <img src={editIcon} className="action-icon ms-0" alt="action-icon" />
                            </div>
                        </Col>
                        <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                            <div
                                className="btn-light action-button delete-button"
                                onClick={() => props.onDeleteClick(props.data._id)}
                            >
                                <img src={deleteIcon} className="action-icon" alt="action-icon" />
                            </div>
                        </Col>
                    </>
                )}
            </Row>
        </React.Fragment>
    );
    const toggleExpand = (event) => {
        // Specifically in this component, we need to prevent the event from propagating to the parent element
        event.stopPropagation();
        setExpanded(!expanded);
    };
    const LinkRenderer = (props) => (
        <div key={props.data._id}>
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
                        {props.data.typeOfEvent === 'ONLINE' ? 'Meeting Link' : 'Location'}
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
            headerName: 'Link/Location',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            valueGetter: (params) => {
                return params.data.typeOfEvent === 'ONLINE' ? params.data.meetingLink : params.data.location;
            },
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
                    <ProductForm productModal={studentModal} resetModal={resetModal} />
                </Modal>
            )}
            {showDeleteModal.show && (
                <ConfirmationBox
                    show={showDeleteModal.show}
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
                            <img src={calendar} alt="" /> <span className="ms-1">Create New Event</span>
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default Events;
