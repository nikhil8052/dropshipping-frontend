import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Row, DropdownButton, Dropdown, Form } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import toast from 'react-hot-toast';
import TextExpand from '@components/TextExpand/TextExpand';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import downArrow from '@icons/down-arrow.svg';
import add from '@icons/add_white.svg';
import { studentDummyData, coachDummyData } from '../../../data/data';
import { useNavigate } from 'react-router-dom';
import Roadmap from './Roadmap/Roadmap';
import { useSelector } from 'react-redux';
import '../../../styles/Students.scss';
import '../../../styles/Common.scss';

const Students = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [coursesModal, setCoursesModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        data: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
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
        navigate(`/${role}/students/new`);
    };
    const handleEditClick = (studentId) => {
        // Handle edit action here
        navigate(`/${role}/students/edit`, {
            state: { studentId }
        });
    };

    const handleCoursesRoadMapClick = (data) => {
        // Handle edit action here
        setCoursesModal({
            show: true,
            title: (
                <div>
                    Courses Roadmap
                    <p
                        style={{
                            color: 'rgba(132, 132, 132, 1)',
                            fontSize: '14px'
                        }}
                    >
                        (Drag Courses to change their numbers)
                    </p>
                </div>
            ),
            isEditable: true,
            data
        });
    };

    const handleDeleteClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        resetCoursesModal();
    };

    const resetCoursesModal = () => {
        setCoursesModal({
            show: false,
            title: '',
            isEditable: false,
            data: null
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
            toast.success(data?.message || 'Student deleted successfully');
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

    const handleToggleClick = (id) => {
        const copyOfStudentData = [...studentsData];
        const student = copyOfStudentData.find((student) => student.id === id);
        const index = copyOfStudentData.indexOf(student);

        copyOfStudentData[index].isActive = !copyOfStudentData[index].isActive;
        setStudentsData(copyOfStudentData);
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
                {role === 'coach' ? (
                    <></>
                ) : (
                    <Col lg={1} md={6} sm={6} xs={4} className="d-flex justify-content-center align-items-center">
                        <div
                            className="btn-light action-button delete-button"
                            onClick={() => props.onDeleteClick(props.data.id)}
                        >
                            <img src={deleteIcon} className="action-icon ms-3" alt="action-icon" />
                        </div>
                    </Col>
                )}
            </Row>
        </React.Fragment>
    );
    /*eslint-disable */

    const toggleExpand = (event) => {
        // Specifically in this component, we need to prevent the event from propagating to the parent element
        event.stopPropagation();
        setExpanded(!expanded);
    };

    /*eslint-disable */
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
                        cursor: 'pointer',
                        maxWidth: '120px'
                    }}
                    onClick={toggleExpand}
                >
                    {props.value}
                </div>
            </div>
        </div>
    );
    const LinkRenderer = (props) => (
        <div key={props.data.id}>
            <div className="d-flex align-items-center">
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: expanded ? 'normal' : 'nowrap',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: 'rgba(72, 128, 255, 1)'
                    }}
                    onClick={() => {
                        console.log(props, 'clicked');
                        props.onRoadMapClick(props.data.coursesRoadmap || []);
                    }}
                >
                    View Roadmap
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
            headerName: 'Fee Status',
            field: 'feeStatus',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const status = rowData.feeStatus;
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
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: LinkRenderer,
            cellRendererParams: {
                onRoadMapClick: handleCoursesRoadMapClick
            }

            // cellRenderer: ({ data: rowData }) => {
            //     const coursesRoadmap = rowData.coursesRoadmap;
            //     const firstName = `Course 1 ${coursesRoadmap[0]?.title}`;

            //     return (
            //         <div
            //             style={{
            //                 overflow: 'hidden',
            //                 textOverflow: 'ellipsis',
            //                 whiteSpace: 'nowrap',
            //                 cursor: 'pointer'
            //             }}
            //             onClick={() => handleCoursesRoadMapClick(coursesRoadmap)}
            //         >
            //             View Roadmap
            //         </div>
            //     );
            // }
        },
        {
            headerName: 'Active/Deactivate',
            cellRenderer: ToggleRenderer,
            field: 'isActive',
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
            maxWidth: 100,
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onEditClick: handleEditClick,
                onDeleteClick: handleDeleteClick
            },
            pinned: 'right',
            sortable: false,
            filter: false,
            resizable: false,
            cellClass: ['d-flex', 'align-items-center', 'justify-content-center']
        }
    ];

    return (
        <div className="students-page">
            <Helmet>
                <title>Coaches | Dropship Academy</title>
            </Helmet>
            {coursesModal.show && (
                <Modal size="md" show={coursesModal.show} onClose={handleCloseModal} title={coursesModal.title}>
                    <Roadmap coursesModal={coursesModal} resetModal={resetCoursesModal} />
                </Modal>
            )}

            {showDeleteModal && (
                <ConfirmationBox
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    loading={loadingCRUD}
                    title="Delete Student"
                    body="Are you sure you want to delete this Student?"
                    onConfirm={handleDeleteSubmit}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-button"
                    activeBtn="delete-button"
                    activeBtnTitle="Delete"
                />
            )}
            <Table
                columns={columns}
                tableData={studentsData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <div className="button-wrapper">
                        {role === 'admin' && (
                            <DropdownButton
                                title={
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <span>{selectedCoach}</span>
                                        <img src={downArrow} alt="Down arrow" />
                                    </div>
                                }
                                defaultValue={selectedCoach}
                                className="dropdown-button"
                            >
                                <Dropdown.Header>All Coaches ({coachDummyData.length})</Dropdown.Header>
                                {coachDummyData.map((coach) => (
                                    <Dropdown.Item
                                        onClick={(e) => handleCoachSelect(e, coach)}
                                        key={coach.id}
                                        eventKey={coach.id}
                                        className="my-1 ms-2"
                                    >
                                        <img src={coach.avatarUrl} className="avatar-student" alt={coach.name} />
                                        <span className="coach-name">{coach.name}</span>
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        )}

                        <DropdownButton
                            title={
                                <div className="d-flex justify-content-between align-items-center gap-2">
                                    <span>{selectedOption}</span>
                                    <img src={downArrow} alt="Down arrow" />
                                </div>
                            }
                            defaultValue={selectedOption}
                            className="dropdown-button-fix"
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

                        <Button className="add-button" onClick={handleCreateClick}>
                            <img className="mb-1" src={add} alt="add button" />
                            <span className="ms-1">Add New Student</span>
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default Students;
