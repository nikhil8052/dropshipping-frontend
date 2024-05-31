import { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ProductForm from '@components/Listings/ProductForm/ProductForm';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import { toast } from 'react-toastify';
import TextExpand from '@components/TextExpand/TextExpand';

import { AllStudentsDummyData } from '../../../data/data';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CaretRight from '@icons/CaretRight.svg';
import '../../../styles/Courses.scss';

const AllStudents = () => {
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
    const navigate = useNavigate();

    const [allStudentData, setAllStudentData] = useState(null);

    const [selectedOption, setSelectedOption] = useState('All');
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const role = userInfo?.role;

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            setAllStudentData(AllStudentsDummyData);
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

    const columns = [
        {
            headerName: 'Name',
            field: 'studentName',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
        },
        {
            headerName: 'ID',
            field: 'studentId',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const student_id = rowData.studentId;
                return <div key={rowData.id}>{student_id}</div>;
            }
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
            headerName: 'Progress',
            field: 'progress',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            autoHeight: true,
            cellRenderer: ({ data: rowData }) => {
                const status = rowData.progress;

                return (
                    <Link
                        to={`/${role}/courses/view-progress`}
                        className={'progress-btn-allstudent mx-auto'}
                        key={rowData.id}
                    >
                        {status}
                    </Link>
                );
            }
        }
    ];

    return (
        <div className="all-student-page">
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
                    title="Delete Entry"
                    body="Are you sure you want to delete this entry?"
                    onConfirm={handleDeleteSubmit}
                />
            )}
            <div className="title-top">
                <span onClick={() => navigate(`/${role}/courses`)} style={{ cursor: 'pointer' }}>
                    Courses <img src={CaretRight} alt=">" />
                </span>{' '}
                <span onClick={() => navigate(`/${role}/courses/details`)} style={{ cursor: 'pointer' }}>
                    Course Details <img src={CaretRight} alt=">" />{' '}
                </span>
                All Students
            </div>
            <Table
                columns={columns}
                tableData={allStudentData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <Row>
                        <Col>
                            <div className="events-page d-flex justify-content-end">
                                <DropdownButton
                                    title={
                                        <div className="d-flex justify-content-between w-100">
                                            <span className="ms-2">{selectedOption}</span>
                                        </div>
                                    }
                                    defaultValue={selectedOption}
                                    className="dropdown-button-fix w-25 d-flex justify-content-even align-items-center"
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

export default AllStudents;
