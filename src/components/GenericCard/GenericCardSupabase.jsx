import { Card, Form, Dropdown } from 'react-bootstrap';
import CustomProgressBar from '../CustomProgressBar/CustomProgressBar';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import TextExpand from '@components/TextExpand/TextExpand';
import enrollIcon from '../../assets/icons/enroll-icon.svg';
import lockIcon from '../../assets/icons/lock-icon.svg';
import deleteIcon from '@icons/trash-2.svg';
import './GenericCard.scss';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import { useState } from 'react';
import { decode } from 'he';

import Edit2 from '../../assets/icons/Dropdown.svg';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import * as types from '../../redux/actions/actionTypes';

const GenericCard = ({
    img,
    title,
    description,
    coachName,
    progress = 0,
    archive,
    onChange,
    enroll,
    detail,
    canAccessCourse,
    onDelete,
    ...rest
}) => {
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // State to manage modal visibility and loading state
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const [loadingCRUD, setLoadingCRUD] = useState(false);

    // Handler to open the delete confirmation modal
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const createSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        // return ' TEst ';
    };

    // Handler to close the delete confirmation modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    // Handler to confirm deletion
    const handleDeleteSubmit = async () => {
        setLoadingCRUD(true);
        try {
            if (onDelete) {
                await onDelete(rest?._id); // Ensure onDelete returns a promise
            }
            setShowDeleteModal(false);
            setLoadingCRUD(false);
        } catch (error) {
            setLoadingCRUD(false);
            setShowDeleteModal(false);
        }
    };

    // dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourse', data: course.data.id } });

    return (
        <>
            <Card className="generic-card">
                <Dropdown align="end">
                    <Dropdown.Toggle variant="light" className="action-dropdown-toggle" id="dropdown-basic">
                        <img src={Edit2} alt="" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={(e) => {
                                const isToggleClick = e.target.className === 'form-check-input';
                                if (isToggleClick) return;
                                navigate(
                                    role === 'student' && enroll && canAccessCourse
                                        ? `/${role}/courses-supabase/enrolled-course/${createSlug(title)}`
                                        : `/${role}/courses-supabase/details/${createSlug(title)}`,
                                    {
                                        state: {
                                            courseId: rest?._id
                                        }
                                    }
                                );
                            }}
                        // onClick={(e) => {
                        //     e.stopPropagation();

                        //     dispatch({
                        //         type: types.ALL_RECORDS,
                        //         data: { keyOfData: 'currentCourse', data: rest?._id }
                        //     });

                        //     // navigate(
                        //     //     role === 'student' && enroll && canAccessCourse
                        //     //         ? `/${role}/courses-supabase/enrolled-course/${createSlug(title)}`
                        //     //         : `/${role}/courses-supabase/details/${createSlug(title)}`
                        //     // );
                        //     navigate(
                        //         role === 'student' && enroll && canAccessCourse
                        //             ? `/${role}/courses-supabase/enrolled-course/${createSlug(title)}`
                        //             : `/${role}/courses-supabase/details/${createSlug(title)}`,
                        //         {
                        //             state: {
                        //                 courseId: rest?._id
                        //             }
                        //         }
                        //     );
                        // }}
                        >
                            View
                        </Dropdown.Item>

                        <Dropdown.Item
                            onClick={(e) => {
                                e.stopPropagation();

                                dispatch({
                                    type: types.ALL_RECORDS,
                                    data: { keyOfData: 'currentCourse', data: rest?._id }
                                });

                                navigate(
                                    role === 'student' && enroll && canAccessCourse
                                        ? `/${role}/courses-supabase/enrolled-course/${createSlug(title)}`
                                        : `/${role}/courses-supabase/edit`
                                );
                            }}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={handleDeleteClick}> Delete </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div
                    className="image-box cursor-pointer"
                    onClick={(e) => {
                        const isToggleClick = e.target.className === 'form-check-input';
                        if (isToggleClick) return;
                        navigate(
                            role === 'student' && enroll && canAccessCourse
                                ? `/${role}/courses-supabase/enrolled-course/${createSlug(title)}`
                                : `/${role}/courses-supabase/details/${createSlug(title)}`,
                            {
                                state: {
                                    courseId: rest?._id
                                }
                            }
                        );
                    }}
                // onClick={(e) => {
                //     const isToggleClick = e.target.className === 'form-check-input';
                //     if (isToggleClick) return;

                //     // Dispatch to Redux first
                //     dispatch({
                //         type: types.ALL_RECORDS,
                //         data: { keyOfData: 'currentCourse', data: rest?._id }
                //     });

                //     // Then navigate
                //     navigate(
                //         role === 'student' && enroll && canAccessCourse
                //             ? `/${role}/courses-supabase/enrolled-course/${createSlug(title)}`
                //             : `/${role}/courses-supabase/details/${createSlug(title)}`
                //     );
                // }}
                >
                    <div className="image-container">
                        <Card.Img loading="lazy" variant="top" src={img} />
                        {/* {role === 'admin' && (
                        <button type="button" className="delete-icon-btn" onClick={handleDeleteClick}>
                            <img src={deleteIcon} alt="Delete" className="delete-icon" />
                        </button>
                    )} */}
                    </div>
                    <Card.Body className="card-body">
                        <Card.Title className="card-title">
                            <TextExpand className="course-title" value={title} width="100%" />
                        </Card.Title>
                        {/* <Card.Text className="card-coach">
                        <TextExpand className="course-des" value={detail} width="100%" />
                    </Card.Text> */}
                        <Card.Text className="card-coach">
                            <TextExpand
                                className="course-des"
                                value={
                                    description?.length > 70
                                        ? `${description.slice(0, 70)}...`
                                        : description
                                }
                                width="100%"
                            />
                        </Card.Text>

                        {role === 'admin' && (
                            <div className="card-archive">
                                {/* <span>
                                <strong>Status:</strong> {archive ? 'Active' : 'Inactive'}
                            </span> */}
                                {/* <Form.Check
                                className="archive-toggle-btn"
                                onChange={onChange}
                                checked={archive}
                                type="switch"
                                id="custom-switch"
                            /> */}
                            </div>
                        )}
                        {role === 'student' && enroll && (
                            <>
                                <CustomProgressBar progress={progress} />
                                {/* <div className="enroll-icon">
                                <img src={!canAccessCourse ? lockIcon : enrollIcon} alt="enrollIcon" />
                                <p className="">{!canAccessCourse ? 'Locked' : 'Enrolled'}</p>
                            </div> */}
                            </>
                        )}
                    </Card.Body>
                </div>
            </Card>
            <Tooltip id="my-tooltip" />
            {showDeleteModal && (
                <ConfirmationBox
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteSubmit}
                    title={`Do want to delete this course?`}
                    body={`Are you sure you want to delete ${title}? Data associated with this course will be lost.`}
                    loading={loadingCRUD}
                    customFooterClass="custom-footer-class" // Optional: adjust based on your styling
                    nonActiveBtn="cancel-button" // Optional: adjust based on your styling
                    activeBtn="delete-button" // Optional: adjust based on your styling
                    cancelButtonTitle="No" // Optional: customize button text
                    activeBtnTitle="Delete" // Optional: customize button text
                />
            )}
        </>
    );
};

export default GenericCard;
