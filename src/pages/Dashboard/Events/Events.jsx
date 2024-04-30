import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import { toast } from 'react-toastify';
import TextExpand from '@components/TextExpand/TextExpand';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import eyeIcon from '@icons/basil_eye-solid.svg';
import add from '@icons/add.svg';
import downArrow from '@icons/down-arrow.svg';
import { eventsDummyData } from '../../../data/data';

const Events = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [studentModal, setStudentModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        studentId: null
    });
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);

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
        setStudentModal({
            show: true,
            title: 'Create Product',
            isEditable: false,
            studentId: null
        });
    };

    const handleEditClick = (studentId) => {
        // Handle edit action here
        setStudentModal({
            show: true,
            title: 'Edit Product',
            isEditable: true,
            studentId: studentId
        });
    };

    const handleDeleteClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal(true);
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
            toast.success(data?.message || 'Item deleted successfully');
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

    /*eslint-disable */
    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                    <div
                        className="btn-light action-button delete-button"
                        onClick={() => props.onDeleteClick(props.data.id)}
                    >
                        <img src={eyeIcon} className="action-icon" alt="action-icon" />
                    </div>
                </Col>
                <Col lg={3} md={4} sm={4} xs={4} className="d-flex justify-content-center align-items-center">
                    <div className="action-button edit-button" onClick={() => props.onEditClick(props.data.id)}>
                        <img src={editIcon} className="action-icon" alt="action-icon" />
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
            <div className="d-flex align-items-center gap-2">
                {/* Later we add click events*/}
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: expanded ? 'normal' : 'nowrap',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: 'rgba(72, 128, 255, 1)'
                    }}
                    onClick={toggleExpand}
                >
                    {props.value}
                </div>
            </div>
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
            field: 'join_link',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: LinkRenderer,
            resizable: false
        },
        {
            headerName: 'Attendees',
            field: 'attendees',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const attendees = rowData.attendees;
                return <div key={rowData.id}>{attendees} students</div>;
            }
        },
        {
            headerName: 'Date & Time',
            field: 'date_time',
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
                onDeleteClick: handleDeleteClick
            },
            pinned: 'right',
            sortable: false,
            filter: false,
            resizable: false,
            cellClass: ['d-flex', 'align-items-center']
        }
    ];

    return (
        <div className="events-page">
            <Helmet>
                <title>Coaches | Drop Ship Academy</title>
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
                    title="Delete Entry"
                    body="Are you sure you want to delete this entry?"
                    onConfirm={handleDeleteSubmit}
                />
            )}
            <Table
                columns={columns}
                tableData={eventsData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <Row className="mb-3 d-flex justify-content-between align-items-center me-1">
                        <Col xxl={6} xl={7} lg={12} md={6} sm={6} xs={12} className="">
                            <div className="text-nowrap filter-by-text d-flex justify-content-even align-items-center">
                                <span className="me-2"> Filter By:</span>
                                <DropdownButton
                                    title={
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="ms-2">{selectedEvent}</span>
                                            <img src={downArrow} alt="Filter" />
                                        </div>
                                    }
                                    defaultValue={selectedEvent}
                                    className="dropdown-button coach-btn w-100"
                                >
                                    {['All Events', 'Upcoming Events', 'Past Events'].map((event) => (
                                        <Dropdown.Item
                                            onClick={(e) => handleEventSelect(e, event)}
                                            key={event}
                                            eventKey={event}
                                            className="my-1 ms-2 w-100"
                                        >
                                            <span className="coach-name"> {event}</span>
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </div>
                        </Col>

                        <Col xxl={4} xl={5} lg={12} md={6} sm={12} xs={12}>
                            <Button className="add-button w-100" onClick={handleCreateClick}>
                                <img src={add} alt="" /> <span className="ms-2">Create New Event</span>
                            </Button>
                        </Col>
                    </Row>
                }
            />
        </div>
    );
};

export default Events;
