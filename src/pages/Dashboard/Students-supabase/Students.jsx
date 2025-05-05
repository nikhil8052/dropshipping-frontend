import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Row, DropdownButton, Dropdown, Form } from 'react-bootstrap';
import Modal from '@components/Modal/Modal';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import TextExpand from '@components/TextExpand/TextExpand';
import editIcon from '@icons/edit_square.svg';
import deleteIcon from '@icons/trash-2.svg';
import downArrow from '@icons/down-arrow.svg';
import add from '@icons/add_white.svg';
import { COACH, coachDummyData, studentsTrajectory } from '../../../data/data';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_URL } from '../../../utils/apiUrl';
import TextItemExpand from '@components/TextExpand/TextItemExpand';
import '../../../styles/Students.scss';
import '../../../styles/Common.scss';
import RoadMapList from './Roadmap/RoadmapList';
import Select from 'react-select';
import HeaderWithIcon from '../../../components/HeaderWithIcon';
import NameIcon from '../../../assets/images/profile.svg';
import EmailIcon from '../../../assets/images/email.svg';
import StatusIcon from '../../../assets/images/status.svg';
import ActionIcon from '../../../assets/images/action.svg';
import Plus from '../../../assets/images/plus.svg';

const Students = () => {
    const [showDeleteModal, setShowDeleteModal] = useState({
        show: false,
        title: 'Delete Student',
        isEditable: false,
        studentId: null
    });
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [coursesModal, setCoursesModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        data: null,
        courseId: null
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const { userInfo } = useSelector((state) => state?.auth);
    const token = useSelector((state) => state?.auth?.userToken);
    const role = userInfo?.role?.toLowerCase();
    const [studentsData, setStudentsData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(studentsTrajectory[0].label);
    const [selectedCoach, setSelectedCoach] = useState('Assigned Coach');
    const [showColumnSelect, setShowColumnSelect] = useState(false);
    const [selectPosition, setSelectPosition] = useState({ top: 0, left: 0 });
    useEffect(() => {
        // Fetch data from API here
        if (selectedOption) {
            fetchData(selectedOption);
        }
    }, [selectedOption]);

    const fetchData = async (query, loading = true) => {
        // Later we will replace this with actual API call
        try {
            setLoading(loading);
            const coaches = await axiosWrapper(
                'GET',
                // `${API_URL.SUPABASE_GET_ALL_STUDENTS}`,
                `${API_URL.SUPABASE_GET_ALL_STUDENTS}?coachingTrajectory=${query || selectedOption}`,
                {},
                token
            );
            setStudentsData(coaches.data);
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
        const isChecked = event.event.target.checked;
        const isRoadmapClick = coursesModal.show;
        if (isChecked || isRoadmapClick) {
            return;
        } else {
            navigate(`/${role}/students-supabase/edit`, {
                state: { studentId: event.data?.id }
            });
        }
    };

    const handleCreateClick = () => {
        // Handle create button click event here
        navigate(`/${role}/students-supabase/new`);
    };
    const handleEditClick = (studentId) => {
        // Handle edit action here
        navigate(`/${role}/students-supabase/edit`, {
            state: { studentId }
        });
    };

    const handleCoursesRoadMapClick = (data, courseId) => {
        // Handle edit action here
        setCoursesModal({
            show: true,
            title: (
                <div>
                    {data.length > 0 ? (
                        <>
                            Courses Roadmap
                            <p
                                style={{
                                    color: 'rgba(132, 132, 132, 1)',
                                    fontSize: '14px'
                                }}
                                className="sentence-case"
                            >
                                (Drag courses to change their order)
                            </p>
                        </>
                    ) : (
                        <h5 className="text-center mt-5 sentence-case">You have not assigned in any courses.</h5>
                    )}
                </div>
            ),
            isEditable: true,
            courseId,
            data
        });
    };

    const handleDeleteClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal({
            show: true,
            title: 'Delete Student',
            isEditable: false,
            studentId: id
        });
    };

    const handleCloseModal = () => {
        resetModal();
    };

    const resetModal = () => {
        setCoursesModal({
            show: false,
            title: '',
            isEditable: false,
            data: null,
            courseId: null
        });
        setShowDeleteModal({
            show: false,
            title: '',
            isEditable: false,
            studentId: null
        });
    };

    const handleCloseDeleteModal = () => {
        resetModal();
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            // Delete API call here
            await axiosWrapper(
                'DELETE',
                API_URL.SUPABASE_DELETE_STUDENT.replace(':id', showDeleteModal?.studentId),
                {},
                token
            );
            fetchData();
            setSelectedRowId(null);
            setShowDeleteModal({
                show: false,
                title: 'Delete Student',
                isEditable: false,
                studentId: null
            });
            setLoadingCRUD(false);
            resetModal();
        } catch (error) {
            setLoadingCRUD(false);
            resetModal();
        }
    };

    const handleCoachSelect = (eventKey, coach) => {
        setSelectedCoach(coach.name);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleToggleClick = async (student) => {
        setLoadingCRUD(true);
        let url = '';
        if (student.isActive) {
            url = `${API_URL.SUPABASE_DEACTIVATE_STUDENT.replace(':id', student?.id)}`;
        } else {
            url = `${API_URL.SUPABASE_ACTIVATE_STUDENT.replace(':id', student?.id)}`;
        }
        await axiosWrapper('PUT', url, {}, token);
        fetchData(selectedOption, false);
        setLoadingCRUD(false);
    };

    const calcPercentage = (rowData) => {
        const courses = rowData.coursesRoadmap || [];

        const percentages = courses.map((course) => {
            const lectures = course.lectures || [];
            const totalLectures = lectures.length;
            const studentId = rowData?.id;

            // Count completed lectures
            const completedLectures = lectures.filter((lecture) => {
                const completedBy = lecture.completedBy || [];
                // Check if the student's ID is in the completedBy array
                return completedBy.includes(studentId) || completedBy.some((item) => item.id === studentId);
            }).length;

            // Calculate the completion percentage for this course
            return totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
        });

        // Return the average percentage across all courses, or individual percentages as needed
        return percentages.length > 0 ? percentages.reduce((a, b) => a + b, 0) / percentages.length : 0;
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
                {role === 'COACH' ? (
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
                        onChange={() => props.onToggleClick(props.data)}
                    />
                </Col>
            </Row>
        </React.Fragment>
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
                        props.onRoadMapClick(props.data.coursesRoadmap || [], props.data.id);
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
            headerName: 'Name', // Fallback text
            field: 'name',
            headerComponent: 'headerWithIcon', // Use the registered name
            headerComponentParams: {
                icon: NameIcon,
                displayName: 'Name'
            },
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextItemExpand,
            resizable: false
        },
        {
            headerName: 'Email', // Fallback text
            field: 'email',
            headerComponent: 'headerWithIcon', // Use the registered name
            headerComponentParams: {
                icon: EmailIcon,
                displayName: 'Email'
            },
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
        },
        // {
        //     headerName: 'Courses%',
        //     field: 'id',
        //     filter: 'agSetColumnFilter',
        //     sortable: true,
        //     unSortIcon: true,
        //     resizable: false,
        //     cellRenderer: ({ data: rowData }) => {
        //         // Calculate the percentage of courses completed
        //         const coursePercentage = calcPercentage(rowData);
        //         return (
        //             <div key={rowData?.id}>
        //                 {coursePercentage === 0.0 || coursePercentage === '0.00'
        //                     ? '--'
        //                     : `${coursePercentage.toFixed(2)}%`}
        //             </div>
        //         );
        //     }
        // },
        // {
        //     headerName: 'Fee Status',
        //     field: 'feeStatus',
        //     filter: 'agSetColumnFilter',
        //     sortable: true,
        //     unSortIcon: true,
        //     resizable: false,
        //     cellRenderer: ({ data: rowData }) => {
        //         const status = rowData.feeStatus || '--';
        //         return (
        //             <div className={`${status} fee-status`} key={rowData.id}>
        //                 {status}
        //             </div>
        //         );
        //     }
        // },
        {
            headerName: 'HT / LT',
            field: 'coachingTrajectory',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const coachingTrajectory = rowData.coachingTrajectory;
                return <div key={rowData.id}>{coachingTrajectory === COACH.COACH_TYPE.HIGH_TICKET ? 'HT' : 'LT'}</div>;
            }
        },
        // {
        //     headerName: 'Courses Roadmap',
        //     field: 'coursesRoadmap',
        //     filter: 'agSetColumnFilter',
        //     sortable: false,
        //     wrapText: true,
        //     autoHeight: true,
        //     resizable: false,
        //     cellRenderer: LinkRenderer,
        //     cellRendererParams: {
        //         onRoadMapClick: handleCoursesRoadMapClick
        //     }
        // },
        {
            headerName: 'Activate/Deactivate',
            field: 'isActive',
            headerComponent: 'headerWithIcon',
            headerComponentParams: {
                icon: StatusIcon,
                displayName: 'Activate/Deactivate'
            },
            filter: 'agSetColumnFilter',
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
            field: 'Actions',
            headerComponent: 'headerWithIcon',
            headerComponentParams: {
                icon: ActionIcon,
                displayName: 'Actions'
            },
            // maxWidth: 100,
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onEditClick: handleEditClick,
                onDeleteClick: handleDeleteClick
            }
        },
          
    ];

    const handleRoadmapUpdate = async (data, id) => {
        if (id) {
            setLoading(true);
            try {
                const url = `${API_URL.UPDATE_STUDENT.replace(':id', id)}`;
                const method = 'PUT';

                await axiosWrapper(
                    method,
                    url,
                    {
                        coursesRoadmap: data
                    },
                    token
                );
                fetchData();
            } catch (error) {
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
    };

    const [visibleFields, setVisibleFields] = useState([
        'name',
        'email',
        'coachingTrajectory',
        'isActive',
        'Actions',
        'AddColumn'
    ]);

    const filteredColumns = columns.filter((col) => visibleFields.includes(col.field));

    const columnOptions = columns.map((col) => ({
        value: col.field,
        label: col.headerName
    }));

    return (
        <div className="students-page">
            <Helmet>
                <title>Students | Dropship Academy</title>
            </Helmet>
            {coursesModal.show && (
                <Modal size="md" show={coursesModal.show} onClose={handleCloseModal} title={coursesModal.title}>
                    <RoadMapList
                        coursesList={coursesModal.data.map((c) => ({
                            value: c.id,
                            label: c.title,
                            id: c.id
                        }))}
                        setCoursesMap={(data) => handleRoadmapUpdate(data, coursesModal.courseId)}
                    />
                </Modal>
            )}

            {showDeleteModal.show && (
                <ConfirmationBox
                    show={showDeleteModal.show}
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

            {showColumnSelect && (
                <div
                    style={{
                        position: 'absolute',
                        top: `${selectPosition.top}px`,
                        left: `${selectPosition.left}px`,
                        zIndex: 1000,
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        minWidth: '200px'
                    }}
                    onMouseLeave={() => setShowColumnSelect(false)}
                >
                    <Select
                        isMulti
                        options={columnOptions}
                        value={columnOptions.filter((opt) => visibleFields.includes(opt.value))}
                        onChange={(selectedOptions) => {
                            setVisibleFields(selectedOptions.map((opt) => opt.value));
                            setShowColumnSelect(false);
                        }}
                        placeholder="Select columns..."
                        className="basic-multi-select"
                        classNamePrefix="select"
                        menuIsOpen={true}
                        autoFocus
                    />
                </div>
            )}
            <Table
                columns={filteredColumns}
                tableData={studentsData}
                onRowClicked={handleRowClick}
                loading={loading}
                children={
                    <div className="button-wrapper">
                        {role === 'ADMIN' && (
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
                                    <span>
                                        {
                                            studentsTrajectory.find(
                                                (s) => s.value === selectedOption || s.label === selectedOption
                                            ).label
                                        }
                                    </span>
                                    <img src={downArrow} alt="Down arrow" />
                                </div>
                            }
                            defaultValue={studentsTrajectory[0].label}
                            className="dropdown-button-fix"
                        >
                            {studentsTrajectory.map((option) => (
                                <Dropdown.Item
                                    key={option.id}
                                    onClick={() => handleOptionChange(option.value)}
                                    eventKey={option}
                                    className="my-1 ms-2"
                                >
                                    <span className="coach-name">{option.label}</span>
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>

                        <Button className="add-button" onClick={handleCreateClick}>
                            <img className="mb-1" src={add} alt="add button" />
                            <span className="ms-1">Add New Student</span>
                        </Button>
                        <Select
                            isMulti
                            options={columnOptions}
                            value={columnOptions.filter((opt) => visibleFields.includes(opt.value))}
                            onChange={(selectedOptions) => {
                                setVisibleFields(selectedOptions.map((opt) => opt.value));
                            }}
                            placeholder="Select columns..."
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>
                }
            />
        </div>
    );
};

export default Students;

// Payment flow
// 1. Add a dropdown to select payment plan (One Time | Installments)
// 2. When picks up the installments then another dropdown to select (Weekly | Monthly installments)
// 3. When a student paid one time then he can do anything in the app i mean he can easily access the all the lectures of that courses.
// 4. When a student paid in installments then we can add a check if he is paying weekly or monthly then we can add a check accordingly.
