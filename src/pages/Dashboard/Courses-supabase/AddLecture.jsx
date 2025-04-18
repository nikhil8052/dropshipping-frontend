import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ellips from '../../../assets/images/threedots.svg';
import Drop from '../../../assets/images/droparrow.png';
import Input from '../../../components/Input/Input';
import { FORMATS, TOOLBAR_CONFIG } from '../../../utils/common';
import { Formik, Form } from 'formik';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';

const AddNewLecture = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showTranscriptEditor, setShowTranscriptEditor] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const handlePopupClick = () => {
    setModalShow(!modalShow);
  };

  const { description } = {};

  return (
    <>
      {modalShow && (
        <ConfirmationBox
          className="add-link-modal"
          show={modalShow}
          onClose={handlePopupClick}
          loading={false}
          title="Add Link"
          body={
            <div className="add-link-form">
              <div className="form-group">
                <label htmlFor="labelInput">Label</label>
                <input
                  type="text"
                  id="labelInput"
                  className="form-control"
                  placeholder="Google Document"
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
                />
              </div>
              <div className="divider-or">
                <span>OR</span>
              </div>
              <div className="form-group res-file">
                <label htmlFor="fileUpload">Add File</label>
                <input
                  type="file"
                  id="fileUpload"
                  className="form-control"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4,.mov,.avi"
                />
              </div>
            </div>
          }
          customFooterClass="custom-footer-class"
          nonActiveBtn="cancel-btn"
          activeBtn="submit-btn"
          cancelButtonTitle="Cancel"
          activeBtnTitle="Add"
        />
      )}

      <div className="course-detail-tab">
        <div className="course-detail-row">
          <div className="row">
            <div className="col-md-3">
              <div className="course-left">
                <div className="course-left-top">
                  <h2 className="subhead">Course Name</h2>
                  <div className="drop-box">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        <div className="toggle-icon">
                          <img src={Ellips} alt="" />
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="javascript:void(0)">Edit Course</Dropdown.Item>
                        <Dropdown.Item href="javascript:void(0)">Add Folder</Dropdown.Item>
                        <Dropdown.Item href="javascript:void(0)">Add Page</Dropdown.Item>
                        <Dropdown.Item href="javascript:void(0)">Move</Dropdown.Item>
                        <Dropdown.Item href="javascript:void(0)">Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <div className="folder-detail">
                  <div className="drop-box" onClick={toggleFolder} style={{ cursor: 'pointer' }}>
                    <h3>Folder 1</h3>
                    <div className={`folder-dropdown ${isOpen ? 'rotated' : ''}`}>
                      <img src={Drop} alt="" />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="detail-box">
                      <ul>
                        <li>
                          <a href="javascript:void(0)">Video 1</a>
                          <div className="drop-box">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                <div className="toggle-icon">
                                  <img src={Ellips} alt="" />
                                </div>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item href="javascript:void(0)">Edit</Dropdown.Item>
                                <Dropdown.Item href="javascript:void(0)">Copy</Dropdown.Item>
                                <Dropdown.Item href="javascript:void(0)">Duplicate</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="course-right">
                <Formik
                  initialValues={{
                    description: description || '',
                    transcript: '',
                  }}
                >
                  {() => (
                    <Form>
                      <Row>
                        <Col>
                          <Input
                            className="field-quill-control"
                            type="richTextEditor"
                            name="description"
                            id="course_description"
                            placeholder="Enter Course Description"
                            showResources={true}
                            modules={{ toolbar: TOOLBAR_CONFIG }}
                            formats={FORMATS}
                          />
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
                              <Dropdown.Item href="javascript:void(0)" onClick={handlePopupClick}>
                                Add resource link
                              </Dropdown.Item>
                              <Dropdown.Item href="javascript:void(0)" onClick={handlePopupClick}>
                                Add resource file
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      <div className="res">
                        <h2 className="subhead">Add Quiz</h2>
                        <div className="drop-box">
                          <div className="add-btn">
                            <a href="javascript:void(0)">Add New</a>
                          </div>
                        </div>
                      </div>

                      <div className="res">
                          <h2 className="subhead">Add Transcript</h2>
                        <div className="transc">
                          <div className="drop-box">
                            {!showTranscriptEditor ? (
                              <div className="add-btn">
                                <a href="javascript:void(0)" onClick={() => setShowTranscriptEditor(true)}>
                                  Add New
                                </a>
                              </div>
                            ) : null}
                          </div>

                          <div
                            className={`transcript-section ${showTranscriptEditor ? '' : 'd-none'}`}
                          >
                            <Input
                              className="field-quill-control"
                              type="richTextEditor"
                              name="transcript"
                              id="transcript"
                              placeholder="Add Transcript"
                              showResources={false}
                              modules={{ toolbar: TOOLBAR_CONFIG }}
                              formats={FORMATS}
                            />
                          </div>

                        </div>

                      </div>

                      <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                        <Button type="button" className="cancel-btn">
                          Cancel
                        </Button>
                        <Button type="submit" className="submit-btn">
                          Save & Next
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewLecture;
