import { useState,useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ellips from '../../../assets/images/threedots.svg';
import Drop from '../../../assets/images/droparrow.png';
import Input from '../../../components/Input/Input';
import { FORMATS, TOOLBAR_CONFIG } from '../../../utils/common';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const AddNewLecture = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const { description, } = {};


  return (
    <>
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
                        <Dropdown.Item href="#/action-1">Edit Course</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Add Folder</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Add Page</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Move</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Delete</Dropdown.Item>
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
                        <li><a href="javascript:void(0)">Video 1</a> <div className="drop-box">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        <div className="toggle-icon">
                          <img src={Ellips} alt="" />
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-9">Edit</Dropdown.Item>
                        <Dropdown.Item href="#/action-10">Copy</Dropdown.Item>
                        <Dropdown.Item href="#/action-11">Duplicate</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div></li>
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
                  
                  }}
                >
                  <Row>
                    <Col>
                      <Input
                        className="field-quill-control"
                        type="richTextEditor"
                        name="description"
                        // label="Course Description"
                        placeholder="Enter Course Description"
                        modules={{
                          toolbar: TOOLBAR_CONFIG
                        }}
                        formats={FORMATS}
                      />
                    </Col>
                  </Row>
                </Formik>
                <div className="res">
                  <h2 className='subhead'>Add Resources </h2>
                  <div className="drop-box">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        <div className="toggle-icon">
                          Add
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-6">Add resource link</Dropdown.Item>
                        <Dropdown.Item href="#/action-7">Add resource file</Dropdown.Item>
                        <Dropdown.Item href="#/action-8">Add transcript</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="res">
                  <h2 className='subhead'>Add Quiz</h2>
                  <div className="drop-box">
                    <div className="add-btn">
                      <a href="javascript:void(0)">Add New</a>
                    </div>
                  </div>
                </div>
                <div className="res">
                  <h2 className='subhead'>Add Transcript</h2>
                  <div className="drop-box">
                    <div className="add-btn">
                      <a href="javascript:void(0)">Add New</a>
                    </div>
                  </div>
                </div>
                <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                  <Button
                    type="button" className='cancel-btn'>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="submit-btn" >
                    Save & Next
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewLecture;
