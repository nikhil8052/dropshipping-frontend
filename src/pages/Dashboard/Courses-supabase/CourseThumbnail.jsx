import { useRef, useState } from 'react';
import '../../../styles/Courses.scss';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import courseThumbnail from '../../../assets/icons/Thumbnail.svg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import 'react-quill/dist/quill.snow.css';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { getFileObjectFromBlobUrl } from '../../../utils/utils';
import UploadSimple from '@icons/UploadSimple.svg';
import Loading from '@components/Loading/Loading';
import ImageCropper from '../../../components/ImageMask/ImageCropper';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import * as types from '../../../redux/actions/actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import cross from '@icons/red-cross.svg';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ConfirmationBox from '../../../components/ConfirmationBox/ConfirmationBox';


const UploadThumbnail = ({ onNext, updateCourseData, onBack, initialData, setStepComplete, resetStep }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const currentCourse = useSelector((state) => state?.root?.currentCourse);
  const token = useSelector((state) => state?.auth?.userToken);
  const [loadingThum, setLoadingThumb] = useState(false);
  const [bannerCropping, setBannerCropping] = useState(false);
  const [bannerImageSrc, setBannerImageSrc] = useState(null);

  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const { thumbnail } = initialData || {};
  const [publishCourseModel, setPublishCourseModel] = useState(false);
  const [loadingCRUD, setLoadingCRUD] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      // Display an error or handle the invalid file selection
      toast.error('Invalid file selected. Please choose an image file.');
      return;
    }

    const image = URL.createObjectURL(file);
    setImageSrc(image);
    setCropping(true);
  };

  const handleCropComplete = async (croppedImage) => {
    setLoadingThumb(true);
    const file = await getFileObjectFromBlobUrl(croppedImage, 'courseThumbnail.jpeg');
    const formData = new FormData();
    formData.append('files', file);
    formData.append('name', file.name);

    const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
    updateCourseData({
      thumbnail: mediaFile.data[0].path
    });
    setCropping(false);
    setLoadingThumb(false);
  };

  const handleUploadFilesSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    const formData = { ...values };
    if (currentCourse) {
      await axiosWrapper('PUT', `${API_URL.UPDATE_COURSE.replace(':id', currentCourse)}`, formData, token);
      // Handle next
      dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
      setStepComplete('step2');
      setSubmitting(false);
      setLoading(false);
      onNext();
      resetForm();
    }
  };
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setLoading(true);
      // Create the course
      const formData = { ...values, category: values.category.map((cat) => cat.value) };
      await createOrUpdateCourse(formData);

      setStepComplete('step1');
      setSubmitting(false);
      setLoading(false);
      resetForm();
    } catch (error) {
      setSubmitting(false);
      setLoading(false);
      resetStep();
    }
  };

  const resetCropper = () => {
    setCropping(false);
    updateCourseData({
      thumbnail: ''
    });
    setImageSrc(null);
    inputRef.current.value = null;
  };
  // for Confirmation model :
  const handlePublishCourseModal = () => {
      setPublishCourseModel(false);
  };
  const setShowConfirmModal = (e) => {
      e.stopPropagation(); 
      setPublishCourseModel(true);
  };
  

  const handleCourseSubmit = async () => {
    setLoadingCRUD(true);
    try {
        // if (onDelete) {
        //     await onDelete(rest?._id); 
        // }
        // setShowDeleteModal(false);
        // setLoadingCRUD(false);
        // navigate(`/${role}/courses-supabase`);
    } catch (error) {
        // setLoadingCRUD(false);
        // setShowDeleteModal(false);
    }
};

  return (
    <>
      <>
        {/* Confirmation Modal */}
        <div
          className="modal fade publish-popup"
          id="confirmModal"
          tabIndex="-1"
          aria-labelledby="confirmModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmModalLabel">Publish your course!</h5>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary cancel-btn" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary submit-btn"
                  onClick={() => {
                    onNext();
                  }}
                >
                  Proceed
                </button>

              </div>
            </div>
          </div>
        </div>


        {/* confirmation model : default */}

        {publishCourseModel && (
                <ConfirmationBox
                    show={publishCourseModel}
                    onClose={handlePublishCourseModal}
                    onConfirm={handleSubmit}
                    title="Publish your course!"
                    // body="Are you sure you want to delete this course? Data associated with this course will be lost."
                    loading={loadingCRUD}
                    customFooterClass="custom-footer-class"
                    nonActiveBtn="cancel-btn"
                    activeBtn="submit-btn"
                    cancelButtonTitle="Cancel"
                    activeBtnTitle="Proceed"
                />
            )}
      </>

      {loading ? (
        <Loading />
      ) : (
        <div className="upload-form-section thumbnail-block">
          <div className="upload-course-form">
            <Formik
              validationSchema={Yup.object({
                thumbnail: Yup.string().required('Thumbnail is required'),
              })}
              onSubmit={handleUploadFilesSubmit}
              enableReinitialize
            >
              {({ isSubmitting, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="thumbnail">
                    {thumbnail ? (
                      <></>
                    ) : (
                      <label htmlFor="" >Course Thumbnail</label>
                    )}
                    <Field name="thumbnail">
                      {() => (
                        <>
                          <input
                            ref={inputRef}
                            accept=".jpg,.jpeg,.png"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                          {loadingThum ? (
                            <Loading />
                          ) : thumbnail ? (
                            <div className="image-renderer">
                              <span>Course Thumbnail</span>
                              <img
                                src={
                                  typeof thumbnail === 'string'
                                    ? thumbnail
                                    : URL.createObjectURL(thumbnail)
                                }
                                alt=""
                                style={{
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  width: '200px',
                                  height: '128px'
                                }}
                              />

                              <div
                                className="align-self-start"
                                style={{
                                  marginLeft: 'auto'
                                }}
                              >
                                <img
                                  src={cross}
                                  onClick={() => {
                                    updateCourseData({ thumbnail: null });
                                    if (inputRef.current) {
                                      inputRef.current.value = '';
                                    }
                                  }}
                                  className="reset-image"
                                  alt="reset"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="image-preview">
                                <img src={courseThumbnail} alt="thumbnail" />
                                <div className="image-preview-text">
                                  <div>
                                    <p>
                                      Upload your course Thumbnail here. <strong>Important guidelines: </strong> 1200x800 pixels or 12:8 Ratio. Supported format: <strong>.jpg, .jpeg, or .png</strong>
                                    </p>
                                  </div>

                                  <Button
                                    type="submit"
                                    className="upload-btn"
                                    disabled={isSubmitting}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      inputRef.current.click();
                                    }}
                                  >
                                    Upload Image{' '}
                                    <img
                                      className="mb-1"
                                      src={UploadSimple}
                                      alt="Upload Btn"
                                    />
                                  </Button>
                                </div>
                              </div>
                              <ErrorMessage
                                name="thumbnail"
                                component="div"
                                className="error"
                              />
                            </>
                          )}
                        </>
                      )}
                    </Field>
                  </div>
                  {/* <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                    <Button
                      type="button"
                      className="cancel-btn"
                      onClick={() => navigate(`/${role}/courses-supabase`)}
                      disabled={isSubmitting}
                      // onClick={onBack}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="submit-btn"
                      disabled={isSubmitting}
                      // data-bs-toggle="modal"
                      // data-bs-target="#confirmModal"
                      onClick={() => setPublishCourseModel(true)}
                    >
                      Save & Next
                    </Button>

                  </div> */}
                </Form>
              )}
            </Formik>
            {cropping && (
              <ImageCropper
                imageSrc={imageSrc}
                onCropComplete={handleCropComplete}
                onCancel={resetCropper}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UploadThumbnail;
