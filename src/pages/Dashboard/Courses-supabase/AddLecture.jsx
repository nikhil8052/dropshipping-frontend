import { useState, useEffect } from 'react';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import '../../../styles/Courses.scss';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ellips from '../../../assets/images/threedots.svg';
import Drop from '../../../assets/images/droparrow.png';
import Input from '../../../components/Input/Input';
import { FORMATS, TOOLBAR_CONFIG } from '../../../utils/common';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import bluePlus from '@icons/blue-plus.svg';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import Loading from '@components/Loading/Loading';

const AddNewLecture = ({ onNext, onBack, initialData, setStepComplete, updateCourseData }) => {
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const [currentActiveLectureID, setCurrentActiveLectureID] = useState(null);
  const [currentActiveLecture, setCurrentActiveLecture] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [showTranscriptEditor, setShowTranscriptEditor] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showMovePopup, setShowMovePopup] = useState(false);
  const currentCourse = useSelector((state) => state?.root?.currentCourse);

  const token = useSelector((state) => state?.auth?.userToken);
  const { title, thumbnail, banner } = initialData;
  const [isEditing, setIsEditing] = useState(false); // Add edit mode state
  const [editingLecture, setEditingLecture] = useState(null);

  const [selectedLecture, setSelectedLecture] = useState({ topicIndex: null, lectureIndex: null });
  const [unassignedLectures, setUnassignedLectures] = useState([]);

  useEffect(() => {
    console.log(initialData);
    if (initialData?.lecturess) {
      const newLectures = initialData.lecturess.map(lecture => ({
        name: lecture.name,
        id: lecture.id
      }));
  
      setUnassignedLectures(prev => [...prev, ...newLectures]);
    }
  }, [initialData]);
  
  const [topics, setTopics] = useState([]);

  const quizInitialValues = {
    quiz: {
      mcqs: [
        {
          question: '',
          options: ['', '', '', '']
        }
      ]
    }
  };

  const toggleFolder = (index) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };


  // Add New Lecture which is unassinged 
  const addUnassignedLecture = async () => {
    const newLec = {
      'name': `New Lecture`,
      courseId:currentCourse 
    };


    const response  = await axiosWrapper(
      'POST',
      API_URL.SUPABASE_ADD_LECTURE,
      newLec,
      token
    );
    
    if( response.data ){
       const lec_id = response.data[0].id;
       newLec.id=lec_id;
       newLec.courseId = currentCourse;
    }

    setUnassignedLectures([
      ...unassignedLectures,
      newLec
    ]);

  };




  const addNewTopic = async () => {
    let topic = {
      name: `Folder ${topics.length + 1}`,
      lectures: [],
    };
    const method = 'POST';
    const url = API_URL.SUPABASE_CREATE_COURSE_FOLDER.replace(':id', currentCourse);
    const formData = {
      "name": topic.name,
      "order_id": topics.length + 1,
    }
    const response = await axiosWrapper(method, url, formData, token);
    console.log(response, " FOlder Hit api Data  ")
    if(response.data ){
      const fid = response.data.id;
      topic.id=fid;
      topic.courseId = currentCourse;
    }
    setTopics([...topics, topic]);
  };


  const duplicateLecture = (topicIndex, lectureIndex) => {
    const updatedTopics = [...topics];
    const lectureToDuplicate = updatedTopics[topicIndex].lectures[lectureIndex];

    // Insert the duplicated lecture after the clicked one
    updatedTopics[topicIndex].lectures.splice(lectureIndex + 1, 0, lectureToDuplicate + " (Copy)");

    setTopics(updatedTopics);
  };


  const moveUnassignedLecture = async (unassignedIndex, targetTopicIndex) => {

    console.log('unassignedIndex', unassignedIndex, 'targetTopicIndex', targetTopicIndex);
    const lectureToMove = unassignedLectures[unassignedIndex];

    console.log( lectureToMove , " Move this lecture to the other folder ");

    // Add lecture to target topic
    const updatedTopics = [...topics];

    console.log( updatedTopics, " These are the updated topics which we have currently..");

    updatedTopics[targetTopicIndex].lectures.push(lectureToMove);

    // Remove lecture from unassigned
    const updatedUnassignedLectures = unassignedLectures.filter((_, idx) => idx !== unassignedIndex);


    var formData  = {
      // "name": lectureToMove.name,
      // "lecture_id": lectureToMove.id, 
      "folder_id": updatedTopics[targetTopicIndex].id,
      "courseId": currentCourse,
    };

    const url = API_URL.SUPABASE_UPDATE_LECTURE_FOLDER.replace(':id', lectureToMove.id);

    console.log( url , " This si the url to hit for the lecture move");
    // Request the API and change the DB 
    const response  = await axiosWrapper(
      'POST',
      url,
      formData,
      token
    );
    

    // Update state
    setTopics(updatedTopics);

    console.log( updatedTopics , " These are the updated topics ")
    setUnassignedLectures(updatedUnassignedLectures);
    setShowMovePopup(false);
  };


  const quizValidationSchema = Yup.object().shape({
    quiz: Yup.object()
      .shape({
        mcqs: Yup.array()
          .of(
            Yup.object().shape({
              question: Yup.string().when('options', {
                is: (options) => options && options.length > 0,
                then: () => Yup.string().required('Question is required when options are provided'),
                otherwise: () => Yup.string().optional()
              }),
              options: Yup.array()
                .of(Yup.string().optional())
                .test('unique-options', 'Options must be unique', (options) => {
                  const uniqueOptions = new Set(options.map((option) => option?.toLowerCase()));
                  return uniqueOptions.size === options.length;
                })
            })
          )
      })
  });
  const hasLectures = currentCourse?.lectures && currentCourse?.lectures?.length > 0;



  // console.log(hasLectures);
  //   useEffect(() => {
  //     if (!hasLectures) setIsEditing(true);
  //   }, [hasLectures]);
  console.log(hasLectures);
  // useEffect(() => {
  //   if (!hasLectures) setIsEditing(true);
  // }, [hasLectures]);
  const handleQuizSubmit = (values) => {
    console.log('Quiz submitted:', values);
    // Here you would typically save the quiz data
    setShowQuizModal(false);
  };

  const handleQuizPopupClick = () => {
    setShowQuizModal(!showQuizModal);
  };

  const moveLecture = (targetTopicIndex) => {
    const updatedTopics = [...topics];
    const { topicIndex, lectureIndex } = selectedLecture;

    // Take the lecture
    const lectureToMove = updatedTopics[topicIndex].lectures[lectureIndex];

    // Remove from current topic
    updatedTopics[topicIndex].lectures.splice(lectureIndex, 1);

    // Add to new topic
    updatedTopics[targetTopicIndex].lectures.push(lectureToMove);

    setTopics(updatedTopics);
    setShowMovePopup(false);
    setSelectedLecture({ topicIndex: null, lectureIndex: null });
  };

  const handlePopupClick = () => {
    setModalShow(!modalShow);
  };

  const { description } = {};


  const getLectureData = async (id)=> {

    const url = API_URL.SUPABASE_GET_LECTURE.replace(':id', id);

    const response  = await axiosWrapper(
      'GET',
      url,
      {},
      token
    );

    return response ; 
  }

  const loadLectureData = async (lecture )=>{
    setCurrentActiveLectureID(lecture.id);
    setCurrentActiveLecture(lecture);
    const lecData = await  getLectureData(currentActiveLectureID);
    console.log( lecData, " This is the lecture data ")
    console.log( lecture , " Current lecture where the user has clicked " )
  }

  const handleEditClick = async (id) => {
    console.log(id);
    // const lecture = initialData?.lecturess?.find((lec) => lec.id === id);
    const lecture = await getLectureData(id);
    console.log(lecture);

    setEditingLecture(lecture?.data);
    setIsEditing(true);
};

const getApiUrl = (isEditable, lectureId) => {
  return isEditable
      ? `${API_URL.SUPABASE_UPDATE_LECTURE.replace(':id', lectureId)}`
      : `${API_URL.SUPABASE_ADD_LECTURE}`;
};

const prepareFormData = (values) => {

let formData = { ...values, courseId: editingLecture?.id };

console.log(formData);
return formData;
};

const handleSubmit = async (values, { setSubmitting, resetForm, ...formikHelpers }) => {
setSubmitting(true);

const action = formikHelpers?.event?.nativeEvent?.submitter?.value;

try {
const formData = prepareFormData(values);
const url = getApiUrl(isEditing, editingLecture?.id);
const method = isEditing ? 'PUT' : 'POST';

await axiosWrapper(method, url, formData, token);

toast.success(`${action === 'update' ? 'Updated' : 'Saved'} successfully!`);

if (action === 'save') {
// handle next step navigation
}
} catch (err) {
// handleError(err);
console.log(err);
} finally {
setSubmitting(false);
}

};



  return (
    <>
      {loading ? (
        <Loading />
      ) : (

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

          <Modal
            show={showQuizModal}
            onHide={handleQuizPopupClick}
            size="lg"
            centered
          >
            <Modal.Body>
              <Formik
                initialValues={quizInitialValues}
                validationSchema={quizValidationSchema}
                onSubmit={handleQuizSubmit}
              >
                {({ isSubmitting, values }) => (
                  <Form>
                    <div className="quiz-wrapper">
                      <div className="add-quiz-title">
                        <p>Add Quiz</p>
                      </div>
                      <div className="quiz-fields-container">
                        <FieldArray name="quiz.mcqs">
                          {({ push, remove }) => (
                            <div className="add-quiz-fields">
                              <div className="add-quiz-label mb-2">
                                <p>
                                  Please Insert MCQs for Student's personal assessments.
                                </p>
                                <span
                                  onClick={() =>
                                    push({
                                      question: '',
                                      options: ['', '', '', ''],
                                      correctAnswer: ''
                                    })
                                  }
                                >
                                  <img src={bluePlus} alt="bluePlus" /> Add new
                                </span>
                              </div>
                              {values.quiz.mcqs.map((_, index) => (
                                <div key={index} className="add-quiz-question">
                                  <div className="d-flex align-items-center">
                                    <Field
                                      name={`quiz.mcqs[${index}].question`}
                                      className="field-control"
                                      type="text"
                                      placeholder="Please Type Question Here..."
                                    />
                                    <Button
                                      type="button"
                                      className="btn btn-link minus-btn"
                                      onClick={() => {
                                        remove(index);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faMinus} color="black" />
                                    </Button>
                                  </div>
                                  <div className="d-flex align-items-center mb-2">
                                    <ErrorMessage
                                      name={`quiz.mcqs[${index}].question`}
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                  <div className="quiz-multiple-choice">
                                    {['option1', 'option2', 'option3', 'option4'].map(
                                      (option, optIndex) => (
                                        <Field
                                          key={optIndex}
                                          name={`quiz.mcqs[${index}].options[${optIndex}]`}
                                          className={`field-control ${optIndex === 3 ? 'correctAnswer' : ''}`}
                                          type="text"
                                          placeholder={
                                            optIndex === 3
                                              ? 'Correct option'
                                              : `Type option ${optIndex + 1}`
                                          }
                                        />
                                      )
                                    )}
                                  </div>
                                  <ErrorMessage
                                    name={`quiz.mcqs[${index}].options`}
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-end gap-3">
                      <Button
                        type="button"
                        onClick={handleQuizPopupClick}
                        className="cancel-btn"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                        Save Quiz
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>

          <div className="course-detail-tab">
            <div className="course-detail-row">
              <div className="row">
                <div className="col-md-3">
                  <div className="course-left">
                    <div className="course-left-top">
                      <h2 className="subhead">{title}</h2>
                      <div className="drop-box">
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            <div className="toggle-icon">
                              <img src={Ellips} alt="" />
                            </div>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="javascript:void(0)">Edit Course</Dropdown.Item>
                            <Dropdown.Item onClick={addNewTopic}>Add Folder</Dropdown.Item>
                            <Dropdown.Item onClick={addUnassignedLecture}>Add Lecture</Dropdown.Item>
                            <Dropdown.Item href="javascript:void(0)">Add Page</Dropdown.Item>
                            <Dropdown.Item href="javascript:void(0)">Move</Dropdown.Item>
                            <Dropdown.Item href="javascript:void(0)">Delete</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>




                    {!hasLectures ? (
                      <>
                        {topics.map((topic, topicIndex) => (
                          <div className="folder-detail" key={topicIndex}>
                            <div className="drop-box" onClick={() => toggleFolder(topicIndex)} style={{ cursor: 'pointer' }}>
                              <h3>{topic.name}</h3>
                              <div className={`folder-dropdown ${isOpen[topicIndex] ? 'rotated' : ''}`}>
                                <img src={Drop} alt="" />
                              </div>
                            </div>

                            {showMovePopup && (
                              <div className="popup-backdrop">
                                <div className="popup">
                                  <h3>Move to Folder</h3>
                                  <ul>
                                    {topics.map((topic, index) => (
                                      <li key={index} onClick={() => moveLecture(index)}>
                                        {topic.name}
                                      </li>
                                    ))}
                                  </ul>
                                  <button className='btn btn-primary' onClick={() => setShowMovePopup(false)}>Cancel</button>
                                </div>
                              </div>
                            )}

                            {isOpen[topicIndex] && (
                              <div className="detail-box">
                                <ul>
                                  {topic.lectures.map((lecture, lectureIndex) => (
                                    <li key={lectureIndex} onClick={()=>loadLectureData(lecture)}>
                                      <a href="javascript:void(0)">{lecture.name ?? "ERROR"}</a>
                                      <div className="drop-box">
                                        <Dropdown>
                                          <Dropdown.Toggle id="dropdown-basic">
                                            <div className="toggle-icon">
                                              <img src={Ellips} alt="" />
                                            </div>
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item href="javascript:void(0)">Edit</Dropdown.Item>
                                            {/* <Dropdown.Item href="javascript:void(0)">Copy</Dropdown.Item> */}
                                            <Dropdown.Item onClick={() => duplicateLecture(topicIndex, lectureIndex)}>Duplicate</Dropdown.Item>
                                            <Dropdown.Item onClick={() => {
                                              setSelectedLecture({ topicIndex, lectureIndex });
                                              setShowMovePopup(true);
                                            }}>
                                              Move
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}

                        {unassignedLectures.map((lecture, index) => (
                          <div className="drop-box" key={`unassigned-${index}`}>
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
                                        <Dropdown.Item href="javascript:void(0)" onClick={() => handleEditClick(lecture.id)}>Edit</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                          setSelectedLecture({ topicIndex: null, lectureIndex: index }); // null because it's unassigned
                                          setShowMovePopup(true);
                                        }}>
                                          Move
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}

                        {/* Show the Move Popup for unassigned lectures */}
                        {showMovePopup && selectedLecture && selectedLecture.topicIndex === null && (
                          <div className="popup-backdrop">
                            <div className="popup">
                              <h3>Move to Folder</h3>
                              <ul>
                                {topics.map((topic, index) => (
                                  <li key={`move-to-${index}`} onClick={() => moveUnassignedLecture(selectedLecture.lectureIndex, index)}>
                                    {topic.name}
                                  </li>
                                ))}
                              </ul>
                              <button className="btn btn-primary" onClick={() => setShowMovePopup(false)}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <></>
                      // <div className="detail-box">
                      //   <ul>
                      //     <li>
                      //       <a href="javascript:void(0)">New Page</a>
                      //       {/* ... existing dropdown ... */}

                      //     </li>
                      //   </ul>
                      // </div>
                    )}



                  </div>
                </div>

                <div className="col-md-9">
                  <div className="course-right">
                    {/* new code  */}
                    {!hasLectures && !isEditing ? (
                      <div className="new-page-view">
                        <div className="course-right-header">
                          <h2 className="subhead">New Page</h2>
                          <Button onClick={() => setIsEditing(true)} className="edit-btn" variant="outlined">
                            <FontAwesomeIcon icon={faPen} style={{ marginRight: 8 }} />

                          </Button>
                        </div>
                      </div>


                    ) : (
                      <Formik
                        enableReinitialize
                        initialValues={{
                          description: editingLecture?.description || '',
                          transcript: editingLecture?.transcript || '',
                          id: editingLecture?.id || '',
                        }}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting, values, setFieldValue }) => (

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
                                  resources={[
                                    {
                                      id: 1,
                                      title: 'This is the First Resource Title',
                                      image: 'https://dropship-api.ropstam.dev/uploads/1736169674625-courseThumbnail.jpeg'
                                    },
                                    {
                                      id: 2,
                                      title: 'Another Resource',
                                      image: 'https://dropship-api.ropstam.dev/uploads/1736169674625-courseThumbnail.jpeg'
                                    }
                                  ]}
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
                                  <a href="javascript:void(0)" onClick={handleQuizPopupClick}>Add New</a>
                                </div>
                              </div>
                            </div>

                            <div className={`res trans-res ${showTranscriptEditor ? 'showing-transcript' : ''}`}>
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
                                  <div className="mt-3 cancel-tans">
                                    <button
                                      type="button"
                                      className="cancel-btnn"
                                      onClick={() => setShowTranscriptEditor(false)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                              <Button type="button" className="cancel-btn" onClick={onBack} >
                                Cancel
                              </Button>
                              <Button type="submit" className="submit-btn"
                              // onClick={() => handleSubmit()}
                              >
                                Save & Next
                              </Button>
                              <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isEditing ? 'Update' : 'Save & Next'}
                              </Button>

                            </div>

                          </Form>
                        )}
                      </Formik>
                    )}
                    {/* new code end */}
                    {/* <Formik
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
                            <a href="javascript:void(0)" onClick={handleQuizPopupClick}>Add New</a>
                          </div>
                        </div>
                      </div>

                      <div className={`res trans-res ${showTranscriptEditor ? 'showing-transcript' : ''}`}>
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
                            <div className="mt-3 cancel-tans">
                              <button
                                type="button"
                                className="cancel-btnn"
                                onClick={() => setShowTranscriptEditor(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 d-flex gap-3 flex-wrap tab-buttons">
                        <Button type="button" className="cancel-btn" onClick={onBack} >
                          Cancel
                        </Button>
                        <Button type="submit" className="submit-btn">
                          Save & Next
                        </Button>
                      </div>
                      
                    </Form>
                  )}
                </Formik> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddNewLecture;