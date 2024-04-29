import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import { toast } from 'react-toastify';
import TextExpand from '@components/TextExpand/TextExpand';
import eyeIcon from '@icons/basil_eye-solid.svg';
import downArrow from '@icons/down-arrow.svg';
import { paymentsDummyData } from '../../../data/data';

const Payments = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [studentModal, setStudentModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        studentId: null
    });
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);

    const [paymentsData, setPaymentsData] = useState(null);

    const [selectedOption, setSelectedOption] = useState('All');

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            setPaymentsData(paymentsDummyData);
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
        setSelectedOption(coach);
    };

    /*eslint-disable */
    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={6} md={6} sm={6} className="d-flex justify-content-center align-items-center">
                    <div
                        className="btn-light action-button delete-button"
                        onClick={() => props.onDeleteClick(props.data.id)}
                    >
                        <img src={eyeIcon} className="action-icon" alt="action-icon" />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
    /*eslint-disable */

    const columns = [
        {
            headerName: 'Student Name',
            field: 'student_name',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
        },
        {
            headerName: 'Email',
            field: 'email',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
        },
        {
            headerName: 'Payment ID',
            field: 'payment_id',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const payment_id = rowData.payment_id;
                return <div key={rowData.id}>{payment_id}</div>;
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
                tableData={paymentsData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <Row>
                        <Col>
                            <div className="d-flex justify-content-end">
                                <DropdownButton
                                    title={
                                        <div className="d-flex justify-content-between w-100">
                                            <span className="ms-2">{selectedOption}</span>
                                            <p>
                                                <img src={downArrow} alt="Filter" srcset="" />
                                            </p>
                                        </div>
                                    }
                                    defaultValue={selectedOption}
                                    className="dropdown-button w-25 d-flex justify-content-even align-items-center"
                                >
                                    {['Paid', 'Overdue', 'HT', 'LT'].map((events) => (
                                        <Dropdown.Item
                                            onClick={(e) => handleEventSelect(e, events)}
                                            key={events}
                                            eventKey={events}
                                            className="my-1 ms-2"
                                        >
                                            <span className="coach-name"> {events}</span>
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </div>
                        </Col>
                    </Row>
                }
            />
        </div>
    );
};

export default Payments;
