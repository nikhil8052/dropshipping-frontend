import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import TextExpand from '@components/TextExpand/TextExpand';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import add from '@icons/add_white.svg';
import { coachDummyData } from '../../../data/data';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Coaches.scss';

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
        navigate('/admin/coaches/new');
    };

    const handleEditClick = (coachId) => {
        // Handle edit action here
        navigate('/admin/coaches/edit', {
            state: { coachId }
        });
    };
    const handleToggleClick = (id) => {
        // Handle edit action here
        const copyOfCoachData = [...coachesData];

        const coach = copyOfCoachData.find((coach) => coach.id === id);
        const index = copyOfCoachData.indexOf(coach);
        copyOfCoachData[index].isActive = !copyOfCoachData[index].isActive;
        setCoachesData(copyOfCoachData);
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
            // Delete API call here
            const copyOfCoachData = [...coachesData];
            const coach = copyOfCoachData.find((coach) => coach.id === selectedRowId);
            const index = copyOfCoachData.indexOf(coach);
            copyOfCoachData.splice(index, 1);
            setCoachesData(copyOfCoachData);
            // Call the get API
            fetchData();
            toast.success('Coach deleted successfully');
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
                <Col lg={4} md={4} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                    <div className="action-button edit-button" onClick={() => props.onEditClick(props.data.id)}>
                        <img src={editIcon} className="action-icon" alt="action-icon" />
                    </div>
                </Col>
                <Col lg={1} md={4} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                    <div
                        className="btn-light action-button delete-button"
                        onClick={() => props.onDeleteClick(props.data.id)}
                    >
                        <img src={deleteIcon} className="action-icon ms-3" alt="action-icon" />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );

    const ToggleRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col className="d-flex justify-content-center align-items-center">
                    <Form.Check // prettier-ignore
                        type="switch"
                        className="toggle-button"
                        id={`custom-switch-${props.data.id}`}
                        checked={props.data.isActive}
                        onChange={() => props.onToggleClick(props.data.id)}
                    />
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
            headerName: 'Active/Deactivate',
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
                    <ProductForm productModal={productModal} resetModal={resetProductModal} />
                </Modal>
            )}
            {showDeleteModal && (
                <ConfirmationBox
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    loading={loadingCRUD}
                    title="Delete Coach"
                    body="Are you sure you want to delete this Coach ?"
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
                        <Button className="add-button btn btn-light btn-block" onClick={handleCreateClick}>
                            <img src={add} alt="" /> <span className="ms-2">Add New Coach</span>
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default Coaches;
