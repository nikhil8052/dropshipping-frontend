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
import downArrow from '@icons/down-arrow.svg';
import { studentsProgressTrajectory } from '../../../data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CaretRight from '@icons/CaretRight.svg';
import '../../../styles/Courses.scss';
import '../../../styles/Common.scss';
import { API_URL } from '../../../utils/apiUrl';

const AllStudents = () => {
    const location = useLocation();
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
    const token = useSelector((state) => state?.auth?.userToken);
    const [allStudentData, setAllStudentData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('All');
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const role = userInfo?.role;
    const courseId = location.state?.courseId;

    useEffect(() => {
        // Fetch data from API here
        fetchData(courseId);
    }, [courseId]);

    useEffect(() => {
        // Fetch data from API here
        fetchData(courseId);
    }, [courseId]);

    const fetchData = async (id) => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);
            const students = await axiosWrapper(
                'GET',
                `${API_URL.GET_ALL_STUDENTS_IN_COURSE.replace(':courseId', id)}`,
                {},
                token
            );

            setAllStudentData(students?.data?.enrolledStudents);
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

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };
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
            headerName: 'Phone Number',
            field: 'phoneNumber',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            cellRenderer: TextExpand,
            resizable: false,
            wrapText: true,
            autoHeight: true
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
                return (
                    <Link
                        to={`/${role?.toLowerCase()}/courses-supabase/view-progress`}
                        state={{
                            studentId: rowData._id,
                            courseId: courseId
                        }}
                        className={'progress-btn-allstudent mx-auto'}
                        key={rowData._id}
                    >
                        View Progress
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
                <span onClick={() => navigate(`/${role}/courses-supabase`)} style={{ cursor: 'pointer' }}>
                    Courses <img src={CaretRight} alt=">" />
                </span>{' '}
                <span
                    onClick={() =>
                        navigate(`/${role}/courses-supabase/details`, {
                            state: {
                                courseId: courseId
                            }
                        })
                    }
                    style={{ cursor: 'pointer' }}
                >
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
                            <div className="students-button-wrapper">
                                <DropdownButton
                                    title={
                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                            <span>
                                                {
                                                    studentsProgressTrajectory.find(
                                                        (s) => s.value === selectedOption || s.label === selectedOption
                                                    ).label
                                                }
                                            </span>
                                            <img className="ms-3" src={downArrow} alt="Down arrow" />
                                        </div>
                                    }
                                    defaultValue={studentsProgressTrajectory[0].label}
                                    className="dropdown-button-fix"
                                >
                                    {studentsProgressTrajectory.map((option) => (
                                        <Dropdown.Item
                                            key={option.id}
                                            onClick={() => handleOptionChange(option.value)}
                                            eventKey={option}
                                            className="my-1 ms-2"
                                        >
                                            <span className="coach-name"> {option.label}</span>
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
