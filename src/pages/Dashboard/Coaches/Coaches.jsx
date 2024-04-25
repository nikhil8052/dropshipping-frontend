import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Row } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import { toast } from 'react-toastify';
import TextExpand from '@components/TextExpand/TextExpand';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import add from '@icons/add.svg';
import { coachDummyData } from '../../../data/data';

const Coaches = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [productModal, setProductModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        productId: null
    });
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);

    const [coachesData, setCoachesData] = useState(null);

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            setCoachesData(coachDummyData);
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
        setProductModal({
            show: true,
            title: 'Create Product',
            isEditable: false,
            productId: null
        });
    };

    const handleEditClick = (productId) => {
        // Handle edit action here
        setProductModal({
            show: true,
            title: 'Edit Product',
            isEditable: true,
            productId: productId
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
        setProductModal({
            show: false,
            title: '',
            isEditable: false,
            productId: null
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

    const toggleExpand = (event) => {
        // Specifically in this component, we need to prevent the event from propagating to the parent element
        event.stopPropagation();
        setExpanded(!expanded);
    };

    /*eslint-disable */
    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={4} md={6} sm={6} className="d-flex justify-content-center align-items-center">
                    <div className="action-button edit-button" onClick={() => props.onEditClick(props.data.id)}>
                        <img src={editIcon} className="action-icon" alt="action-icon" />
                    </div>
                </Col>
                <Col lg={1} md={6} sm={6} className="d-flex justify-content-center align-items-center">
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
            headerName: 'Name',
            field: 'name',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: NameRenderer,
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
            headerName: 'HT / LT',
            field: 'coursesType',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false
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
                const occupied = rowData.occupied;
                const capacity = rowData.capacity;
                return (
                    <div key={rowData.id}>
                        {occupied}/{capacity}
                    </div>
                );
            },
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
        <div className="coaches-page">
            <Helmet>
                <title>Coaches | Drop Ship Academy</title>
            </Helmet>
            {productModal.show && (
                <Modal size="large" show={productModal.show} onClose={handleCloseModal} title={productModal.title}>
                    <ProductForm productModal={productModal} resetModal={resetProductModal} />
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
                tableData={coachesData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <Button
                        className="add-button btn btn-light btn-block d-flex justify-content-even align-items-center"
                        onClick={handleCreateClick}
                    >
                        <img src={add} alt="" srcset="" /> <span className="ms-2">Add New Coach</span>
                    </Button>
                }
            />
        </div>
    );
};

export default Coaches;
