import { Card, Form, Dropdown } from 'react-bootstrap';
import CustomProgressBar from '../CustomProgressBar/CustomProgressBar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextExpand from '@components/TextExpand/TextExpand';
import enrollIcon from '../../assets/icons/enroll-icon.svg';
import lockIcon from '../../assets/icons/lock-icon.svg';
import deleteIcon from '@icons/trash-2.svg';
import './GenericCard.scss';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import { useState } from 'react';
import { decode } from 'he';
import { useLocation } from 'react-router-dom';
import Edit from '../../assets/icons/edit2.svg';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'


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

    return (
        <>
            <Card
                className="generic-card">
                     {/* {role === 'admin' && (
                    <div className='delete-box'>
                    <button type="button" className="delete-icon-btn" onClick={handleDeleteClick} data-tooltip-id="my-tooltip" data-tooltip-content="Delete Course" >
                            <img src={deleteIcon} alt="Delete" className="delete-icon" />
                        </button>
                    </div>
                      )} */}
                <div className='image-box cursor-pointer' onClick={(e) => {
                    const isToggleClick = e.target.className === 'form-check-input';
                    if (isToggleClick) return;
                    navigate(
                        role === 'student' && enroll && canAccessCourse
                            ? `/${role}/courses/enrolled-course/${createSlug(title)}`
                            : `/${role}/courses/details/${createSlug(title)}`,
                        {
                            state: {
                                courseId: rest?._id
                            }
                        }
                    );
                }}>
                <div className="image-container">
                    <Card.Img loading="lazy" variant="top" src={img} className="card-image" />
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
                            value={decode(description)?.replace(/<\/?[^>]+(>|$)/g, '') || ''}
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
                    title="Delete Course"
                    body="Are you sure you want to delete this course? Data associated with this course will be lost."
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