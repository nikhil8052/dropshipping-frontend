import { useState, useRef } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ellips from '../../../assets/images/threedots.svg';
import Drop from '../../../assets/images/droparrow.png';
import Input from '../../../components/Input/Input';
import { FORMATS, TOOLBAR_CONFIG } from '../../../utils/common';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import CoursesModal from './CoursesModal/CoursesModal';
import AddLectureModal from './AddLectureModal';
import Loading from '@components/Loading/Loading';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import * as types from '../../../redux/actions/actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import cross from '@icons/red-cross.svg';
import UploadSimple from '@icons/UploadSimple.svg';
import ImageCropper from '../../../components/ImageMask/ImageCropper';

const AddNewLecture = ({ onNext, onBack, initialData, setStepComplete, updateCourseData }) => {
  const dispatch = useDispatch();
  const currentCourse = useSelector((state) => state?.root?.currentCourse);
  const courseDetails = useSelector((state) => state?.root?.courseDetails); // Assuming course details are stored here
  const token = useSelector((state) => state?.auth?.userToken);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState({});
  const [lectureModal, setLectureModal] = useState({
    show: false,
    title: '',
    isEditable: false,
    lectureId: null,
    initialValues: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    title: '',
    isEditable: false,
    lectureId: null,
    initialValues: null,
  });
  const [resourceModal, setResourceModal] = useState({
    show: false,
    type: 'link', // 'link' or 'file'
  });
  const [loadingResource, setLoadingResource] = useState(false);
  const resourceInputRef = useRef();
  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  // Toggle folder visibility
  const toggleFolder = (index) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Handle file change for resources
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const image = URL.createObjectURL(file);
      setImageSrc(image);
      setCropping(true);
    } else {
      setLoadingResource(true);
      const formData = new FormData();
      formData.append('files', file);
      formData.append('name', file.name);

      try {
        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        updateCourseData({
          resources: [...(initialData.resources || []), mediaFile.data[0].path],
        });
        toast.success('Resource uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload resource.');
      } finally {
        setLoadingResource(false);
      }
    }
  };

  // Handle image crop completion
  const handleCropComplete = async (croppedImage) => {
    setLoadingResource(true);
    const file = await getFileObjectFromBlobUrl(croppedImage, 'resourceImage.jpeg');
    const formData = new FormData();
    formData.append('files', file);
    formData.append('name', file.name);

    try {
      const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
      updateCourseData({
        resources: [...(initialData.resources || []), mediaFile.data[0].path],
      });
      toast.success('Image resource uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image resource.');
    } finally {
      setLoadingResource(false);
      setCropping(false);
    }
  };

  // Add new lecture
  const handleCreateLecture = () => {
    setLectureModal({
      show: true,
      title: 'Add Lecture',
      isEditable: false,
      courseId: currentCourse,
      lectureId: null,
      initialValues: {
        name: '',
        description: '',
        quiz: {
          mcqs: [
            {
              question: '',
              options: ['', '', '', ''],
              correctAnswer: '',
            },
          ],
        },
        file: null,
      },
    });
  };

  // Edit lecture
  const handleEditLecture = (lectureId) => {
    const lecture = initialData?.lectures.find((lec) => lec._id === lectureId);
    setLectureModal({
      show: true,
      title: 'Edit Lecture',
      isEditable: true,
      lectureId,
      initialValues: lecture,
    });
  };

  // Delete lecture
  const handleDeleteLecture = (lectureId) => {
    setShowDeleteModal({
      show: true,
      title: 'Delete Lecture',
      isEditable: false,
      lectureId,
      initialValues: null,
    });
  };

  // Confirm delete
  const handleDeleteSubmit = async () => {
    try {
      setLoading(true);
      await axiosWrapper(
        'DELETE',
        `${API_URL.DELETE_LECTURE.replace(':id', showDeleteModal.lectureId)}`,
        {},
        token
      );
      dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
      toast.success('Lecture deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete lecture.');
    } finally {
      setLoading(false);
      setShowDeleteModal({
        show: false,
        title: '',
        isEditable: false,
        lectureId: null,
        initialValues: null,
      });
    }
  };

  // Save lecture
  const handleSaveLecture = () => {
    dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'lectureUpdate', data: true } });
    setLectureModal({
      show: false,
      title: '',
      isEditable: false,
      lectureId: null,
      initialValues: null,
    });
    toast.success('Lecture saved successfully!');
  };

  // Handle resource modal
  const handleResourceModal = (type) => {
    setResourceModal({ show: true, type });
  };

  // Submit form
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    setLoading(true);
    try {
      const formData = { ...values, lectures: initialData.lectures, resources: initialData.resources || [] };
      await axiosWrapper(
        'PUT',
        `${API_URL.UPDATE_COURSE.replace(':id', currentCourse)}`,
        formData,
        token
      );
      dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
      setStepComplete('step3'); // Adjust step as needed
      onNext();
      resetForm();
      toast.success('Course updated successfully!');
    } catch (error) {
      toast.error('Failed to update course.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <>
      {lectureModal.show && (
        <CoursesModal
          size="large"
          show={lectureModal.show}
          onClose={() =>
            setLectureModal({ show: false, title: '', isEditable: false, lectureId: null, initialValues: null })
          }
          title={lectureModal.title}
        >
          <AddLectureModal
            lectureModal={lectureModal}
            resetModal={() =>
              setLectureModal({ show: false, title: '', isEditable: false, lectureId: null, initialValues: null })
            }
            onSave={handleSaveLecture}
          />
        </CoursesModal>
      )}
      {showDeleteModal.show && (
        <ConfirmationBox
          show={showDeleteModal.show}
          onClose={() =>
            setShowDeleteModal({ show: false, title: '', isEditable: false, lectureId: null, initialValues: null })
          }
          loading={loading}
          title="Delete Lecture"
          body="Are you sure you want to delete this Lecture?"
          onConfirm={handleDeleteSubmit}
          customFooterClass="custom-footer-class"
          nonActiveBtn="cancel-button"
          activeBtn="delete-button"
          activeBtnTitle="Delete"
        />
      )}
      {resourceModal.show && (
        <ConfirmationBox
          className="add-resource-modal"
          show={resourceModal.show}
          onClose={() => setResourceModal({ show: false, type: 'link' })}
          loading={loadingResource}
          title={resourceModal.type === 'link' ? 'Add Resource Link' : 'Add Resource File'}
          body={
            resourceModal.type === 'link' ? (
              <div className="add-link-form">
                <div className="form-group">
                  <label htmlFor="labelInput">Label</label>
                  <input
                    type="text"
                    id="labelInput"
                    className="form-control"
                    placeholder="Resource Label"
                    required
                  />
                  <div className="error-message">* Field is required</div>
                </div>
                <div className="form-group">
                  <label htmlFor="urlInput">URL</label>
                  <input
                    type="text"
                    id="urlInput"
                    className="form-control"
                    placeholder="Enter URL"
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateCourseData({
                          resources: [...(initialData.resources || []), { label: 'Resource', url: e.target.value }],
                        });
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="add-file-form">
                <input
                  ref={resourceInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4,.mov,.avi"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <div className="image-preview">
                  <img src={UploadSimple} alt="upload" />
                  <div className="image-preview-text">
                    <p>Upload your resource file here.</p>
                    <p>Supported formats: <strong>.pdf, .doc, .jpg, .mp4, etc.</strong></p>
                    <Button
                      className="upload-btn"
                      onClick={() => resourceInputRef.current.click()}
                    >
                      Upload <img className="mb-1" src={UploadSimple} alt="Upload Btn" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          }
          customFooterClass="custom-footer-class"
          nonActiveBtn="cancel-btn"
          activeBtn="submit-btn"
          cancelButtonTitle="Cancel"
          activeBtnTitle="Add"
        />
      )}
      {cropping && (
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropping(false);
            setImageSrc(null);
          }}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="course-detail-tab">
          <div className="course-detail-row">
            <Row>
              <Col md={3}>
                <div className="course-left">
                  <div className="course-left-top">
                    <h2 className="subhead">{courseDetails?.name || 'Course Name'}</h2>
                    <div className="drop-box">
                      <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                          <div className="toggle-icon">
                            <img src={Ellips} alt="" />
                          </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item href="javascript:void(0)">Edit Course</Dropdown.Item>
                          <Dropdown.Item onClick={handleCreateLecture}>Add Lecture</Dropdown.Item>
                          <Dropdown.Item href="javascript:void(0)">Move</Dropdown.Item>
                          <Dropdown.Item href="javascript:void(0)">Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  {initialData?.lectures?.map((lecture, index) => (
                    <div className="folder-detail" key={lecture._id}>
                      <div
                        className="drop-box"
                        onClick={() => toggleFolder(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3>{lecture.name}</h3>
                        <div className={`folder-dropdown ${isOpen[index] ? 'rotated' : ''}`}>
                          <img src={Drop} alt="" />
                        </div>
                      </div>
                      {isOpen[index] && (
                        <div className="detail-box">
                          <ul>
                            <li>
                              <a href="javascript:void(0)">{lecture.name}</a>
                              <div className="drop-box">
                                <Dropdown>
                                  <Dropdown.Toggle id="dropdown-basic">
                                    <div className="toggle-icon">
                                      <img src={Ellips} alt="" />
                                    </div>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleEditLecture(lecture._id)}>
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDeleteLecture(lecture._id)}>
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Col>
              <Col md={9}>
                <div className="course-right">
                  <Formik
                    initialValues={{
                      description: initialData.description || '',
                      transcript: initialData.transcript || '',
                    }}
                    validationSchema={Yup.object({
                      description: Yup.string().required('Description is required'),
                    })}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Row>
                          <Col>
                            <Input
                              className="field-quill-control"
                              type="richTextEditor"
                              name="description"
                              id="course_description"
                              label="Course Description"
                              placeholder="Enter Course Description"
                              showResources={true}
                              modules={{ toolbar: TOOLBAR_CONFIG }}
                              formats={FORMATS}
                            />
                            <ErrorMessage name="description" component="div" className="error" />
                          </Col>
                        </Row>
                        <div className="res">
                          <h2 className="subhead">Add Resources</h2>
                          <div className="drop-box">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                <div className="toggle-icon">Add</div>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleResourceModal('link')}>
                                  Add resource link
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleResourceModal('file')}>
                                  Add resource file
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <div className="res">
                          <h2 className="subhead">Add Transcript</h2>
                          <div className="transc">
                            <Input
                              className="field-quill-control"
                              type="richTextEditor"
                              name="transcript"
                              id="transcript"
                              label="Transcript"
                              placeholder="Add Transcript"
                              showResources={false}
                              modules={{ toolbar: TOOLBAR_CONFIG }}
                              formats={FORMATS}
                            />
                          </div>
                        </div>
                        <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                          <Button
                            type="button"
                            className="cancel-btn"
                            onClick={onBack}
                            disabled={isSubmitting}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                          >
                            Save & Next
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewLecture;