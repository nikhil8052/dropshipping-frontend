import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import toast from 'react-hot-toast';
import TextExpand from '@components/TextExpand/TextExpand';
import DateRenderer from '@components/DateFormatter/DateFormatter';
import eyeIcon from '@icons/basil_eye-solid.svg';
import { paymentFilters } from '../../../data/data';
import downArrow from '@icons/down-arrow.svg';
import '../../../styles/Common.scss';
import '../../../styles/Payments.scss';
import { API_URL } from '../../../utils/apiUrl';
import TextItemExpand from '../../../components/TextExpand/TextItemExpand';

const Payments = () => {
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const [studentModal, setStudentModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        studentId: null
    });

    const [paymentsData, setPaymentsData] = useState([]);

    const [selectedOption, setSelectedOption] = useState(paymentFilters[0].label);

    useEffect(() => {
        fetchPayments();
    }, [selectedOption]);
    const fetchPayments = async () => {
        const filterValue = paymentFilters.find((filter) => filter.value === selectedOption)?.value;
        const queryParams = [];

        if (['Paid', 'Overdue'].includes(filterValue)) {
            queryParams.push(`status=${filterValue}`);
        } else if (['LOW_TICKET', 'HIGH_TICKET'].includes(filterValue)) {
            queryParams.push(`trajectory=${filterValue}`);
        }

        const urlWithParams = `${API_URL.GET_ALL_PAYMENTS_BY_ADMIN}?${queryParams.join('&')}`;

        const response = await axiosWrapper('GET', urlWithParams, null, null);
        setPaymentsData(response?.data?.data || []);
    };

    const handleRowClick = (event) => {
        // Handle row click event here
        if (selectedRowId === event.data.id) {
            setSelectedRowId(null);
            return;
        }
        setSelectedRowId(event.data.id);
    };

    const handleViewClick = () => {
        // Later we implement stripe payment here
        toast.success('Will Be Redirected to Stripe Payment Page later.');
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

    const handleEventSelect = (option) => {
        setSelectedOption(option);
    };
    const toggleExpand = (event) => {
        // Specifically in this component, we need to prevent the event from propagating to the parent element
        event.stopPropagation();
        setExpanded(!expanded);
    };

    /*eslint-disable */
    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={6} md={6} sm={6} className="d-flex justify-content-center align-items-center">
                    <div className="btn-light action-button delete-button" onClick={() => props.onViewClick()}>
                        <img src={eyeIcon} className="action-icon ms-3" alt="action-icon" />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );

    const NameRenderer = (props) => (
        <div key={props.data.id}>
            <div className="d-flex align-items-center gap-2">
                <img src={props.data.avatarUrl} alt={props.data.name} className="avatar" />
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: expanded ? 'normal' : 'nowrap',
                        cursor: 'pointer'
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
            headerName: 'Student Name',
            field: 'user.name',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextItemExpand,
            resizable: false
        },
        {
            headerName: 'Email',
            field: 'user.email',
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
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            field: 'paymentId',
            cellRenderer: ({ data }) => <div>{data.paymentId.split('-')[0] || '--'}</div>
        },
        {
            headerName: 'Payment Status',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            field: 'status',
            cellRenderer: ({ data: rowData }) => {
                const status = rowData.status || '--';
                return (
                    <div className={`${status} fee-status`} key={rowData._id}>
                        {status}
                    </div>
                );
            }
        },
        {
            headerName: 'Amount Paid ($)',
            field: 'amount',
            cellRenderer: ({ data }) => <div>{data.amount.toFixed(0) || '--'}</div>,
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false
        },
        {
            headerName: 'Date & Time',
            field: 'createdAt',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            cellRenderer: DateRenderer,
            wrapText: true,
            autoHeight: true,
            resizable: false
        },
        {
            headerName: 'Actions',
            maxWidth: 100,
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onViewClick: handleViewClick
            },
            pinned: 'right',
            sortable: false,
            filter: false,
            resizable: false,
            cellClass: ['d-flex', 'align-items-center', 'justify-content-center']
        }
    ];

    return (
        <div className="payments-page">
            <Helmet>
                <title>Payments | Dropship Academy</title>
            </Helmet>
            {studentModal.show && (
                <Modal size="large" show={studentModal.show} onClose={handleCloseModal} title={studentModal.title}>
                    <ProductForm productModal={studentModal} resetModal={resetProductModal} />
                </Modal>
            )}

            <Table
                columns={columns}
                tableData={paymentsData}
                onRowClicked={handleRowClick}
                children={
                    <div className="payments-button-wrapper">
                        <DropdownButton
                            title={
                                <div className="d-flex justify-content-between align-items-center gap-2">
                                    <span>
                                        {
                                            paymentFilters.find(
                                                (s) => s.value === selectedOption || s.label === selectedOption
                                            ).label
                                        }
                                    </span>
                                    <img className="ms-3" src={downArrow} alt="Down arrow" />
                                </div>
                            }
                            defaultValue={paymentFilters[0].label}
                            className="dropdown-button"
                        >
                            {paymentFilters.map((events) => (
                                <Dropdown.Item
                                    onClick={() => handleEventSelect(events.value)}
                                    key={events.id}
                                    eventKey={events}
                                    className="my-1 ms-2"
                                >
                                    <span className="payment-name"> {events.label}</span>
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                }
            />
        </div>
    );
};

export default Payments;
