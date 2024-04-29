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
import add from '@icons/add.svg';
import downArrow from '@icons/down-arrow.svg';
import { studentDummyData, coachDummyData } from '../../../data/data';

const Students = () => {
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

    const [studentsData, setStudentsData] = useState(null);

    const [selectedOption, setSelectedOption] = useState('All');
    const [selectedCoach, setSelectedCoach] = useState('Assigned Coach');

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            setStudentsData(studentDummyData);
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

    const handleCoachSelect = (eventKey, coach) => {
        setSelectedCoach(coach.name);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    /*eslint-disable */
    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={4} md={6} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                    <div className="action-button edit-button" onClick={() => props.onEditClick(props.data.id)}>
                        <img src={editIcon} className="action-icon" alt="action-icon" />
                    </div>
                </Col>
                <Col lg={1} md={6} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
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
            headerName: 'Courses%',
            field: 'id',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const courses = rowData.id;
                return <div key={rowData.id}>{courses}%</div>;
            }
        },
        {
            headerName: 'Fees Status',
            field: 'feesStatus',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const status = rowData.feesStatus;
                return (
                    <div className={`${status} fee-status`} key={rowData.id}>
                        {status}
                    </div>
                );
            }
        },
        {
            headerName: 'Courses Roadmap',
            field: 'coursesRoadmap',
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
        <div className="students-page">
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
                tableData={studentsData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <Row className="mb-3">
                        <Col
                            xxl={5}
                            xl={6}
                            lg={8}
                            md={4}
                            sm={6}
                            xs={12}
                            className="mb-2 mb-md-0 mt-md-2 mt-sm-2 mt-xs-2"
                        >
                            <DropdownButton
                                title={
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="ms-2">{selectedCoach}</span>
                                        <img src={downArrow} alt="Filter" />
                                    </div>
                                }
                                defaultValue={selectedCoach}
                                className="dropdown-button coach-btn w-100"
                            >
                                <Dropdown.Header>All Coaches ({coachDummyData.length})</Dropdown.Header>
                                {coachDummyData.map((coach) => (
                                    <Dropdown.Item
                                        onClick={(e) => handleCoachSelect(e, coach)}
                                        key={coach.id}
                                        eventKey={coach.id}
                                        className="my-1 ms-2 w-100"
                                    >
                                        <img src={coach.avatarUrl} className="avatar" alt={coach.name} />
                                        <span className="coach-name">{coach.name}</span>
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                        <Col
                            xxl={2}
                            xl={6}
                            lg={4}
                            md={4}
                            sm={6}
                            xs={12}
                            className="mb-2 mb-md-0 mt-md-2 mt-sm-2 mt-xs-2"
                        >
                            <DropdownButton
                                title={
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="ms-2">{selectedOption}</span>
                                        <img src={downArrow} alt="Filter" />
                                    </div>
                                }
                                defaultValue={selectedOption}
                                className="dropdown-button-fix w-100"
                            >
                                {['All', 'HT', 'LT'].map((option) => (
                                    <Dropdown.Item
                                        key={option}
                                        onClick={() => handleOptionChange(option)}
                                        eventKey={option}
                                        className="my-1 ms-2"
                                    >
                                        <span className="coach-name">{option}</span>
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                        <Col xxl={5} xl={6} lg={8} md={4} sm={12} xs={12} className="mt-xxl-2 mt-xl-2 mt-lg-2 mt-md-2">
                            <Button className="add-button w-100" onClick={handleCreateClick}>
                                <img src={add} alt="" /> <span className="ms-2">Add New Student</span>
                            </Button>
                        </Col>
                    </Row>
                }
            />
        </div>
    );
};

export default Students;
