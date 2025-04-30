import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import TextExpand from '@components/TextExpand/TextExpand';
import TextItemExpand from '@components/TextExpand/TextItemExpand';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import add from '@icons/add_white.svg';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Common.scss';
import { API_URL } from '../../../utils/apiUrl';
import { useSelector } from 'react-redux';

const Categories = () => {
    const [showDeleteModal, setShowDeleteModal] = useState({
        show: false,
        title: 'Delete Category',
        isEditable: false,
        categoryId: null
    });
    const [selectedRowId, setSelectedRowId] = useState(null);
    const token = useSelector((state) => state?.auth?.userToken);
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const navigate = useNavigate();
    const [categoriesData, setCategoriesData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (loading = true) => {
        try {
            setLoading(loading);
            const categories = await axiosWrapper('GET', API_URL.GET_ALL_CATEGORIES, {}, token);
            setCategoriesData(categories?.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (event) => {
        const isChecked = event.event.target.checked;
        if (selectedRowId === event.data?._id) {
            setSelectedRowId(null);
            return;
        }
        setSelectedRowId(event.data?._id);
        if (!isChecked) {
            navigate('/admin/category/edit', {
                state: { categoryId: event.data?._id }
            });
        }
    };

    const handleCreateClick = () => {
        navigate('/admin/category/new');
    };

    const handleEditClick = (categoryId) => {
        navigate('/admin/category/edit', {
            state: { categoryId }
        });
    };

    const handleToggleClick = async (category) => {
        try {
            setLoadingCRUD(true);
            const updatedCategory = {
                ...category,
                isActive: !category.isActive
            };

            await axiosWrapper('PUT', API_URL.UPDATE_CATEGORY.replace(':id', category._id), updatedCategory, token);
            fetchData(false);
        } catch (error) {
            console.error('Error toggling category status:', error);
        } finally {
            setLoadingCRUD(false);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedRowId(id);
        setShowDeleteModal({
            show: true,
            title: 'Delete Category',
            isEditable: false,
            categoryId: id
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal({
            show: false,
            title: '',
            isEditable: false,
            categoryId: null
        });
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            await axiosWrapper(
                'DELETE',
                API_URL.DELETE_CATEGORY.replace(':id', showDeleteModal?.categoryId),
                {},
                token
            );
            fetchData(false);
        } catch (error) {
            console.error('Error deleting category:', error);
        } finally {
            handleCloseDeleteModal();
            setLoadingCRUD(false);
        }
    };

    // Function to strip HTML tags from description
    const stripHtmlTags = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Custom TextExpand component to handle HTML content
    const DescriptionRenderer = ({ value }) => {
        const cleanText = stripHtmlTags(value);
        return <div>{cleanText}</div>;
    };

    const ActionsRenderer = React.memo((props) => (
        <Row style={{ width: '100%' }}>
            <Col lg={4} md={4} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                <div className="action-button edit-button" onClick={() => props.onEditClick(props.data._id)}>
                    <img src={editIcon} className="action-icon" alt="edit" />
                </div>
            </Col>
            <Col lg={1} md={4} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                <div
                    className="btn-light action-button delete-button"
                    onClick={() => props.onDeleteClick(props.data._id)}
                >
                    <img src={deleteIcon} className="action-icon ms-3" alt="delete" />
                </div>
            </Col>
        </Row>
    ));

    const ToggleRenderer = (props) => (
        <Row style={{ width: '100%' }}>
            <Col className="d-flex justify-content-center align-items-center">
                <Form.Check
                    type="switch"
                    className="toggle-button"
                    id={`custom-switch-${props.data._id}`}
                    checked={props.data.isActive}
                    onChange={() => props.onToggleClick(props.data)}
                    disabled={props.loading}
                />
            </Col>
        </Row>
    );

    const columns = [
        {
            headerName: 'Name',
            field: 'name',
            filter: 'agSetColumnFilter',
            sortable: true,
            cellRenderer: TextItemExpand,
            resizable: false
        },
        // {
        //     headerName: 'Description',
        //     field: 'description',
        //     filter: 'agSetColumnFilter',
        //     sortable: true,
        //     cellRenderer: DescriptionRenderer,
        //     resizable: false,
        //     flex: 2, // Give description more space
        //     minWidth: 200 // Minimum width for Description column
        // },
        // {
        //     headerName: 'Status',
        //     field: 'isActive',
        //     cellRenderer: ToggleRenderer,
        //     cellRendererParams: {
        //         onToggleClick: handleToggleClick,
        //         loading: loadingCRUD
        //     },
        //     sortable: false,
        //     filter: false,
        //     resizable: false,
        //     cellClass: ['d-flex', 'align-items-center'],
        //     width: 150, // Fixed width for Status column
        //     suppressSizeToFit: true // Prevent auto-resizing
        // },
        {
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            width: 100,
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
        <div className="Categories-page">
            <Helmet>
                <title>Categories | Dropship Academy</title>
            </Helmet>

            {showDeleteModal.show && (
                <ConfirmationBox
                    show={showDeleteModal.show}
                    onClose={handleCloseDeleteModal}
                    loading={loadingCRUD}
                    title={showDeleteModal.title}
                    body="Are you sure you want to delete this Category?"
                    onConfirm={handleDeleteSubmit}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-button"
                    activeBtn="delete-button"
                    activeBtnTitle="Delete"
                />
            )}

            <Table
                columns={columns}
                tableData={categoriesData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <div className="d-flex justify-content-end">
                        <Button
                            className="add-button responsive-btn btn btn-light btn-block"
                            onClick={handleCreateClick}
                        >
                            <img src={add} alt="add" /> <span className="ms-2">Add New Category</span>
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default Categories;
