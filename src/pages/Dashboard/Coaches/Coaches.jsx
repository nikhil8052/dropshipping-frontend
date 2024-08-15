import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import TextExpand from '@components/TextExpand/TextExpand';
import TextItemExpand from '@components/TextExpand/TextItemExpand';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import add from '@icons/add_white.svg';
import { COACH } from '../../../data/data';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Coaches.scss';
import '../../../styles/Common.scss';
import { API_URL } from '../../../utils/apiUrl';
import { useSelector } from 'react-redux';

const Coaches = () => {
    const [showDeleteModal, setShowDeleteModal] = useState({
        show: false,
        title: 'Delete Coach',
        isEditable: false,
        coachId: null
    });
    const [selectedRowId, setSelectedRowId] = useState(null);
    const token = useSelector((state) => state?.auth?.userToken);
    const [productModal, setProductModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        coachId: null
    });
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const navigate = useNavigate();
    const [coachesData, setCoachesData] = useState(null);

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);
            const coaches = await axiosWrapper('GET', API_URL.GET_ALL_COACHES, {}, token);
            setCoachesData(coaches?.data);
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
        navigate('/admin/coaches/new');
    };

    const handleEditClick = (coachId) => {
        // Handle edit action here
        navigate('/admin/coaches/edit', {
            state: { coachId }
        });
    };

    const handleToggleClick = async (coach) => {
        setLoadingCRUD(true);
        let url = '';
        if (coach.isActive) {
            url = `${API_URL.DEACTIVATE_COACH.replace(':id', coach?._id)}`;
        } else {
            url = `${API_URL.ACTIVATE_COACH.replace(':id', coach?._id)}`;
        }
        await axiosWrapper('PUT', url, {}, token);
        fetchData();
        setLoadingCRUD(false);
    };

    const handleDeleteClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal({
            show: true,
            title: 'Delete Coach',
            isEditable: false,
            coachId: id
        });
    };

    const handleCloseModal = () => {
        resetModal();
    };

    const resetModal = () => {
        setProductModal({
            show: false,
            title: '',
            isEditable: false,
            coachId: null
        });
        setShowDeleteModal({
            show: false,
            title: '',
            isEditable: false,
            coachId: null
        });
    };

    const handleCloseDeleteModal = () => {
        resetModal();
    };

    const handleDeleteSubmit = async () => {
        setLoadingCRUD(true);
        // Delete API call here
        await axiosWrapper('DELETE', API_URL.DELETE_COACH.replace(':id', showDeleteModal?.coachId), {}, token);
        fetchData();
        setLoadingCRUD(false);
        resetModal();
    };

    /*eslint-disable */
    const ActionsRenderer = React.memo((props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={4} md={4} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                    <div className="action-button edit-button" onClick={() => props.onEditClick(props.data._id)}>
                        <img src={editIcon} className="action-icon" alt="action-icon" />
                    </div>
                </Col>
                <Col lg={1} md={4} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                    <div
                        className="btn-light action-button delete-button"
                        onClick={() => props.onDeleteClick(props.data._id)}
                    >
                        <img src={deleteIcon} className="action-icon ms-3" alt="action-icon" />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    ));

    const ToggleRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col className="d-flex justify-content-center align-items-center">
                    <Form.Check // prettier-ignore
                        type="switch"
                        className="toggle-button"
                        id={`custom-switch-${props.data._id}`}
                        checked={props.data.isActive}
                        onChange={() => props.onToggleClick(props.data)}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
    /*eslint-disable */

    const columns = [
        {
            headerName: 'Name',
            field: 'name',
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
            field: 'email',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
            // cellClass: ['d-flex', 'align-items-center', 'justify-content-center']
        },
        {
            headerName: 'HT / LT',
            field: 'coachType',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const coachType = rowData.coachType;
                return <div key={rowData._id}>{coachType === COACH.COACH_TYPE.HIGH_TICKET ? 'HT' : 'LT'}</div>;
            }
        },
        {
            headerName: 'Capacity',
            field: 'occupied',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: ({ data: rowData }) => {
                const coachType = rowData.coachType;
                const occupied = rowData.assignedStudents.length;
                let totalCapacity = 0;
                if (coachType === COACH.COACH_TYPE.HIGH_TICKET) {
                    totalCapacity = rowData.highTicketStudentSpots;
                } else {
                    totalCapacity = rowData.lowTicketStudentSpots;
                }

                return (
                    <div key={rowData.id}>
                        {occupied}/{totalCapacity}
                    </div>
                );
            },
            resizable: false
        },
        {
            headerName: 'Activate/Deactivate',
            field: 'isActive',
            cellRenderer: ToggleRenderer,
            cellRendererParams: {
                onToggleClick: handleToggleClick
            },
            sortable: false,
            filter: false,
            resizable: false,
            cellClass: ['d-flex', 'align-items-center']
        },
        {
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            maxWidth: 100,
            cellRendererParams: {
                onEditClick: handleEditClick,
                onDeleteClick: handleDeleteClick
            },
            // Remove the pinned right on small screens

            pinned: 'right',
            sortable: false,
            filter: false,
            resizable: false,
            cellClass: ['d-flex', 'align-items-center', 'justify-content-center']
        }
    ];

    return (
        <div className="coaches-page">
            <Helmet>
                <title>Coaches | Dropship Academy</title>
            </Helmet>
            {productModal.show && (
                <Modal size="large" show={productModal.show} onClose={handleCloseModal} title={productModal.title}>
                    <ProductForm productModal={productModal} resetModal={resetModal} />
                </Modal>
            )}
            {showDeleteModal.show && (
                <ConfirmationBox
                    show={showDeleteModal.show}
                    onClose={handleCloseDeleteModal}
                    loading={loadingCRUD}
                    title={showDeleteModal.title}
                    body="Are you sure you want to delete this Coach?"
                    onConfirm={handleDeleteSubmit}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-button"
                    activeBtn="delete-button"
                    activeBtnTitle="Delete"
                />
            )}

            <Table
                columns={columns}
                tableData={coachesData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <div className="d-flex justify-content-end">
                        <Button
                            className="add-button responsive-btn btn btn-light btn-block"
                            onClick={handleCreateClick}
                        >
                            <img src={add} alt="" /> <span className="ms-2">Add New Coach</span>
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default Coaches;
