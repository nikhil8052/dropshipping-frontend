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
import { stripHtmlTags } from '../../../utils/utils';
import PencilLine from '../../../assets/icons/PencilLine.svg';
import trashIconRed from '../../../assets/icons/Trash-rename.svg';
import * as types from '../../../redux/actions/actionTypes';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AddNewLecture = ({ onNext, onBack, initialData, setStepComplete, updateCourseData }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [currentActiveLectureID, setCurrentActiveLectureID] = useState(null);
  const [currentActiveLecture, setCurrentActiveLecture] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowRename, setModalShowRename] = useState(false);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [lectureLabel, setLectureLabel] = useState('');
  const dispatch = useDispatch();

  const [publishLectureModel, setPublishLectureModel] = useState(false);
  const [pendingLectureId, setPendingLectureId] = useState(null);


  const [modalShowSave, setModalShowSave] = useState(false);
  const [loadingCRUD, setLoadingCRUD] = useState(false);

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
  const [resources, setResources] = useState([]);
  const [url, setUrl] = useState('');
  const [resourceFileUrl, setResourceFileUrl] = useState('');
  const [label, setLabel] = useState('');
  const [topics, setTopics] = useState([]);
  const [lectureQuizzes, setLectureQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null); // null = add mode
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    title: '',
    isEditable: false,
    quizId: null,
    initialValues: null
  });

  const [showLectureDeleteModal, setShowLectureDeleteModal] = useState({
    show: false,
    title: '',
    isEditable: false,
    lectureId: null,
    initialValues: null
  });
  const handleQuizSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    const { question, options, correctAnswer } = values.quiz;

    const payload = {
      lecture_id: currentActiveLectureID,
      title: question,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      correct_answer: correctAnswer,
    };

    try {
      let response;
      if (editQuiz?.id) {
        const url = API_URL.SUPABASE_UPDATE_QUIZ.replace(':id', editQuiz.id);
        response = await axiosWrapper('PUT', url, payload, token);
        if (response.data) {
          const updatedQuizzes = lectureQuizzes.map((quiz) =>
            quiz.id === editQuiz.id ? response.data : quiz
          );
          setLectureQuizzes(updatedQuizzes);
        }
      } else {
        response = await axiosWrapper('POST', API_URL.SUPABASE_ADD_QUIZ, payload, token);
        if (response.data) {
          setLectureQuizzes([...lectureQuizzes, response.data]);
        }
      }
      setShowQuizModal(false);
      setEditQuiz(null);
      resetForm();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {

    setUnassignedLectures([]);
    if (initialData?.lecturess) {
      const newLectures = initialData.lecturess.map(lecture => ({
        name: lecture.name,
        id: lecture.id
      }));

      setUnassignedLectures(prev => [...prev, ...newLectures]);
    }


    console.log(initialData.folders, " Folders ");

    // set the folders and the topic well 
    if (initialData?.folders) {
      const updatedTopics = initialData.folders.map(folder => ({
        name: folder.name,
        id: folder.id,
        lectures: folder.lectures
      }));
      setTopics(updatedTopics);
    }
  }, [initialData]);


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
      courseId: currentCourse
    };
    const response = await axiosWrapper(
      'POST',
      API_URL.SUPABASE_ADD_LECTURE,
      newLec,
      token
    );

    if (response.data) {
      const lec_id = response.data[0].id;
      newLec.id = lec_id;
      newLec.courseId = currentCourse;
    }

    setUnassignedLectures([
      ...unassignedLectures,
      newLec
    ]);

    // setEditingLecture(true);

  };

  const addResource = async () => {

    const formData = {
      'model_id': currentActiveLectureID,
      'model_type': 'lecture',
      'name': label,
      'type': 'file',
      'file_link': resourceFileUrl
    }

    const url = API_URL.SUPABASE_UPDATE_LECTURE_RESOURCE.replace(':id', currentActiveLectureID);
    const response = await axiosWrapper('POST', url, formData, token);

    const resource = {
      image: '/resource_image.svg',
      url: url,
      title: label,
    }

    setResources([...resources, resource]);
    setModalShow(false);

  }

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
    if (response.data) {
      const fid = response.data.id;
      topic.id = fid;
      topic.courseId = currentCourse;
    }
    setTopics([...topics, topic]);
    dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
  };


  // const duplicateLecture = (topicIndex, lectureIndex) => {
  //   console.log(topicIndex)
  //   console.log(lectureIndex)
  //   return false;
  //   const updatedTopics = [...topics];
  //   const lectureToDuplicate = updatedTopics[topicIndex].lectures[lectureIndex];

  //   // Insert the duplicated lecture after the clicked one
  //   updatedTopics[topicIndex].lectures.splice(lectureIndex + 1, 0, lectureToDuplicate + " (Copy)");

  //   setTopics(updatedTopics);
  // };

  const duplicateLecture = async ({ lectureId, topicIndex = 0, lectureIndex = 0 }) => {

    // console.log("Lecture ID:", lectureId);
    // console.log("Topic Index:", topicIndex);
    // console.log("Lecture Index:", lectureIndex);

    setLoading(true);
    try {
      const originalLectureRes = await axiosWrapper('GET', API_URL.SUPABASE_GET_LECTURE.replace(':id', lectureId), null, token);
      const originalLecture = originalLectureRes?.data;
      if (!originalLecture) throw new Error("Lecture not found");

      const newLecturePayload = {
        name: `(Copy) ${originalLecture.name}`,
        description: originalLecture.description,
        transcript: originalLecture.transcript,
        courseId: originalLecture.courseId,
        folder_id: originalLecture.folder_id,
      };

      const newLectureRes = await axiosWrapper('POST', API_URL.SUPABASE_ADD_LECTURE, newLecturePayload, token);
      const newLecture = newLectureRes.data[0];
      const newLectureId = newLecture.id;

      if (!newLectureId) throw new Error("Failed to duplicate lecture");

      // Duplicate quizzes
      const quizzes = originalLecture.quizzes || [];
      for (const quiz of quizzes) {
        const quizPayload = {
          lecture_id: newLectureId,
          title: quiz.title,
          option1: quiz.option1,
          option2: quiz.option2,
          option3: quiz.option3,
          option4: quiz.option4,
          correct_answer: quiz.correct_answer,
        };
        await axiosWrapper('POST', API_URL.SUPABASE_ADD_QUIZ, quizPayload, token);
      }

      // Duplicate resources
      const resources = originalLecture.resources || [];
      for (const res of resources) {
        const resourcePayload = {
          model_id: newLectureId,
          model_type: 'lecture',
          name: res.name || res.title,
          type: res.type || 'file',
          file_link: res.file_link || res.image,
        };
        const resourceUrl = API_URL.SUPABASE_UPDATE_LECTURE_RESOURCE.replace(':id', newLectureId);
        await axiosWrapper('POST', resourceUrl, resourcePayload, token);
      }

      //   if(newLecture.folder_id !== '' ){
      //   setTopics(prevTopics => {
      //     const updated = [...prevTopics];
      //     const lectures = updated[topicIndex].lectures || [];
      //     updated[topicIndex].lectures = [
      //       ...lectures.slice(0, lectureIndex + 1),
      //       newLecture,
      //       ...lectures.slice(lectureIndex + 1),
      //     ];
      //     return updated;
      //   });
      // }else{
      //   setUnassignedLectures(prev => [
      //     ...prev,
      //     { name: newLecture.name, id: newLecture.id }
      //   ]);
      // }
      dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });

      setLoading(false);
      return newLecture;
    } catch (err) {
      console.error("❌ Error duplicating lecture with extras:", err);
      setLoading(false);
    }
  };

  const moveLectureDND = async (lectureID, topicID) => {

    var formData = {
      // "name": lectureToMove.name,
      "lecture_id": lectureID,
      "folder_id": topicID,
      "courseId": currentCourse,
    };

    const url = API_URL.SUPABASE_UPDATE_LECTURE_FOLDER.replace(':id', lectureID);
    // Request the API and change the DB 
    const response = await axiosWrapper(
      'POST',
      url,
      formData,
      token
    );
  };


  const moveUnassignedLecture = async (unassignedIndex, targetTopicIndex) => {

    // console.log( unassignedIndex)
    const lectureToMove = unassignedLectures[unassignedIndex];

    // Add lecture to target topic
    const updatedTopics = [...topics];

    updatedTopics[targetTopicIndex].lectures.push(lectureToMove);

    // Remove lecture from unassigned
    const updatedUnassignedLectures = unassignedLectures.filter((_, idx) => idx !== unassignedIndex);

    var formData = {
      // "name": lectureToMove.name,
      "lecture_id": lectureToMove.id,
      "folder_id": updatedTopics[targetTopicIndex].id,
      "courseId": currentCourse,
    };

    const url = API_URL.SUPABASE_UPDATE_LECTURE_FOLDER.replace(':id', lectureToMove.id);

    console.log(url, " This si the url to hit for the lecture move");
    // Request the API and change the DB 
    const response = await axiosWrapper(
      'POST',
      url,
      formData,
      token
    );

    // Update state
    setTopics(updatedTopics);

    console.log(updatedTopics, " These are the updated topics ")
    setUnassignedLectures(updatedUnassignedLectures);
    setShowMovePopup(false);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const quizValidationSchema = Yup.object().shape({
    quiz: Yup.object().shape({
      question: Yup.string().required('Question is required'),
      options: Yup.array()
        .of(Yup.string().required('Option is required'))
        .min(4, 'Four options are required')
        .test('unique-options', 'Options must be unique', (options) => {
          const uniqueOptions = new Set(options.map((option) => option?.toLowerCase()));
          return uniqueOptions.size === options.length;
        }),
      correctAnswer: Yup.string().required('Correct answer is required'),
    }),
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
  // const handleQuizSubmit = (values) => {
  //   console.log('Quiz submitted:', values);
  //   // Here you would typically save the quiz data
  //   setShowQuizModal(false);
  // };

  const handleQuizPopupClick = (quizz) => {
    setEditQuiz(quizz);
    setShowQuizModal(!showQuizModal);
  };
  const handleDeleteQuizClick = (id) => {
    console.log(id);
    setShowDeleteModal({
      show: true,
      title: 'Delete Quiz',
      isEditable: false,
      quizId: id,
      initialValues: null
    });
  };
  //  const handleDeleteSubmit = async () => {
  //   console.log(showDeleteModal.quizId);
  //         try {
  //             setLoadingCRUD(true);
  //             await axiosWrapper(
  //                 'DELETE',
  //                 `${API_URL.SUPABASE_DELETE_QUIZ.replace(':id', showDeleteModal.quizId)}`,
  //                 {},
  //                 token
  //             );
  //             // dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });
  //         } catch (error) {
  //             return;
  //         } finally {
  //             setLoadingCRUD(false);
  //             setShowDeleteModal({
  //                 show: false,
  //                 title: 'Delete Lecture',
  //                 isEditable: false,
  //                 quizId: null,
  //                 initialValues: null
  //             });
  //         }
  //     };


  const handleSelect = (eventKey) => {
    if (eventKey === 'add-transcript') {
      setShowTranscriptEditor(true);
    } else if (eventKey === 'add-resource') {
      setModalShow(true);
    } else if (eventKey === 'add-quiz') {
      handleQuizPopupClick(true);
    }
  };

  const handleDeleteSubmit = async () => {
    const deletedQuizId = showDeleteModal.quizId;
    try {
      setLoadingCRUD(true);
      await axiosWrapper(
        'DELETE',
        `${API_URL.SUPABASE_DELETE_QUIZ.replace(':id', deletedQuizId)}`,
        {},
        token
      );

      setLectureQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== deletedQuizId)
      );
    } catch (error) {
      console.error('Error deleting quiz:', error);
      return;
    } finally {
      setLoadingCRUD(false);
      setShowDeleteModal({
        show: false,
        title: 'Delete Lecture',
        isEditable: false,
        quizId: null,
        initialValues: null
      });
    }
  };


  const handleCloseDeleteModal = () => {
    setShowDeleteModal({
      show: false,
      title: 'Delete Quiz',
      isEditable: false,
      quizId: null,
      initialValues: null
    });
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
  const handlePopupClickRename = () => {
    setModalShowRename(!modalShowRename);
  };

  const { description } = {};


  const getLectureData = async (id) => {

    const url = API_URL.SUPABASE_GET_LECTURE.replace(':id', id);

    const response = await axiosWrapper(
      'GET',
      url,
      {},
      token
    );

    return response;
  }

  const loadLectureData = async (lecture) => {
    setCurrentActiveLectureID(lecture.id);
    setCurrentActiveLecture(lecture);
    const lecData = await getLectureData(currentActiveLectureID);

  }

  const handleEditClick = async (id) => {

    const lecture = await getLectureData(id);

    const description = stripHtmlTags(lecture.data?.description);
    const transcript = stripHtmlTags(lecture.data?.transcript);
    setCurrentActiveLectureID(id);
    const lectureDetail = {
      name: lecture.data?.name,
      description: description,
      transcript: transcript,
      id: lecture.data?.id,
      courseId: lecture.data?.courseId,
      quizzes: lecture?.data?.quizzes,
    };
    setLectureQuizzes(lecture?.data?.quizzes || []);
    console.table(lectureQuizzes);
    setEditingLecture(lectureDetail);
    setIsEditing(true);
    // Get the resouces of the lecture
    var lecResources = lecture.data.resources ?? [];
    var resources = lecResources.map((lec) => {
      return {
        image: lec.file_link,
        url: lec.file_link,
        title: lec.name,
      }
    })
    setResources(resources);
  };

  const getApiUrl = (isEditable, lectureId) => {
    return isEditable
      ? `${API_URL.SUPABASE_UPDATE_LECTURE.replace(':id', lectureId)}`
      : `${API_URL.SUPABASE_ADD_LECTURE}`;
  };

  const prepareFormData = (values) => {

    let formData = { ...values, courseId: editingLecture?.courseId };

    console.log(formData);
    return formData;
  };

  const modelPopAction = () => {
    if (pendingLectureId) {
      handleEditClick(pendingLectureId);
      setPublishLectureModel(false);
      setPendingLectureId(null);
    }
    // setSubmitting(false);

  }
  const handleSubmit = async (values, { setSubmitting, resetForm, ...formikHelpers }) => {
    setSubmitting(true);

    const action = formikHelpers?.event?.nativeEvent?.submitter?.value;

    try {
      const formData = prepareFormData(values);

      console.log(editingLecture);
      const url = getApiUrl(isEditing, editingLecture?.id);
      const method = isEditing ? 'PUT' : 'POST';

      const response = await axiosWrapper(method, url, formData, token);
      dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });

      // if (response?.data) {
      //   const updatedLectureId = response.data.id;
      //   const updatedLectureName = response.data.name.trim();  
      //   setUnassignedLectures((prevLectures) =>
      //     prevLectures.map((lecture) =>
      //       lecture.id === updatedLectureId
      //         ? { ...lecture, name: updatedLectureName }
      //         : lecture
      //     )
      //   );
      //   setTopics((prevTopics) =>
      //     prevTopics.map((folder) => ({
      //       ...folder,
      //       lectures: folder.lectures.map((lecture) =>
      //         lecture.id === updatedLectureId
      //           ? { ...lecture, name: updatedLectureName }
      //           : lecture
      //       )
      //     }))
      //   );
      // }


    } catch (err) {
      // handleError(err);
      console.log(err);
    } finally {
      setSubmitting(false);
      modelPopAction();
    }

  };


  const handleLectureDeleteClick = (id) => {
    setShowLectureDeleteModal({
      show: true,
      title: 'Delete Lecture',
      isEditable: false,
      lectureId: id,
      initialValues: null
    });
  };

  const handleLectureCloseDeleteModal = () => {
    setShowLectureDeleteModal({
      show: false,
      title: 'Delete Lecture',
      isEditable: false,
      lectureId: null,
      initialValues: null
    });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceTopicIndex = parseInt(source.droppableId.split('-')[1]);
    const destTopicIndex = parseInt(destination.droppableId.split('-')[1]);
    if (sourceTopicIndex === destTopicIndex && source.index === destination.index) {
      return;
    }
    const newTopics = [...topics];
    const movedLecture = newTopics[sourceTopicIndex].lectures[source.index];
    // Remove from source
    newTopics[sourceTopicIndex].lectures.splice(source.index, 1);
    // Add to destination
    newTopics[destTopicIndex].lectures.splice(destination.index, 0, movedLecture);
    const folder_id = newTopics[destTopicIndex].id;
    const lecture_id = movedLecture.id;
    moveLectureDND(lecture_id, folder_id);
    setTopics(newTopics);
  };


  const handleDeleteLecture = async () => {
    try {
      setLoadingCRUD(true);
      await axiosWrapper(
        'DELETE',
        `${API_URL.SUPABASE_DELETE_LECTURE.replace(':id', showLectureDeleteModal.lectureId)}`,
        {},
        token
      );
      dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });

      // if (showLectureDeleteModal.lectureId) {
      //   const deletedLectureId = String(showLectureDeleteModal.lectureId); // ensure consistent type

      //   // Remove from unassigned lectures
      //   setUnassignedLectures(prevLectures =>
      //     prevLectures.filter(lecture => String(lecture.id) !== deletedLectureId)
      //   );

      //   // Remove from topics
      //   setTopics(prevTopics =>
      //     prevTopics.map(folder => ({
      //       ...folder,
      //       lectures: folder.lectures.filter(lecture => String(lecture.id) !== deletedLectureId)
      //     }))
      //   );
      // }

    } catch (error) {
      console.error('Error deleting lecture:', error);
    } finally {
      setLoadingCRUD(false);
      setShowLectureDeleteModal({
        show: false,
        title: 'Delete Lecture',
        isEditable: false,
        lectureId: null,
        initialValues: null
      });
    }
  };

  const renameLecture = async (id, newTitle) => {
    if (!id || !newTitle) {
      console.warn('Lecture ID and new title are required to rename.');
      return;
    }

    try {
      const payload = {
        name: newTitle,
      };

      const url = API_URL.SUPABASE_UPDATE_LECTURE.replace(':id', id);

      const response = await axiosWrapper('PUT', url, payload, token);
      console.log('Lecture renamed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to rename lecture:', error);
      // toast.error('Failed to rename lecture');
      return null;
    }
  };
  const handleRenameLecture = async () => {
    if (!lectureLabel?.trim() || !selectedLectureId) {
      return;
    }
    console.log(selectedLectureId);
    const updated = await renameLecture(selectedLectureId, lectureLabel.trim());

    if (updated) {
      // ✅ Update unassigned lectures
      setUnassignedLectures(prev =>
        prev.map((lecture) =>
          lecture.id === selectedLectureId
            ? { ...lecture, name: lectureLabel.trim() }
            : lecture
        )
      );

      // ✅ Update inside folder (topics)
      setTopics(prevTopics =>
        prevTopics.map(folder => ({
          ...folder,
          lectures: folder.lectures.map(lecture =>
            lecture.id === selectedLectureId
              ? { ...lecture, name: lectureLabel.trim() }
              : lecture
          )
        }))
      );
      // Close modal and reset form
      setModalShowRename(false);
      setLectureLabel('');
      setSelectedLectureId(null);
    }

  };

  const resourceFileChanged = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    formData.append('name', file.name);
    const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
    setResourceFileUrl(mediaFile.data[0].path);
  }

  const handlePublishCourseModal = () => {
    setPublishLectureModel(false);
  };

  return (
    <>
      {showDeleteModal.show && (
        <ConfirmationBox
          show={showDeleteModal.show}
          onClose={handleCloseDeleteModal}
          loading={loadingCRUD}
          title="Delete Quiz"
          body="Are you sure you want to delete this Quiz?"
          onConfirm={handleDeleteSubmit}
          customFooterClass="custom-footer-class"
          nonActiveBtn="cancel-button"
          activeBtn="delete-button"
          activeBtnTitle="Delete"
        />
      )}

      {/* rename model ::: */}
      {modalShowRename && (
        <ConfirmationBox
          className="add-link-modal"
          show={modalShowRename}
          onClose={() => setModalShowRename(false)}
          onConfirm={() => handleRenameLecture()} // 👈 rename logic
          loading={false}
          title="Lecture Name"
          body={
            <div className="add-link-form">
              <div className="form-group">
                <label htmlFor="labelInput">Name</label>
                <input
                  type="text"
                  id="labelInput"
                  className="form-control"
                  placeholder="Lecture Name"
                  value={lectureLabel}
                  required
                  onChange={(e) => setLectureLabel(e.target.value)}
                />
                {!lectureLabel?.trim() && (
                  <div className="error-message">* Field is required</div>
                )}
              </div>
            </div>
          }
          customFooterClass="custom-footer-class"
          nonActiveBtn="cancel-btn"
          activeBtn="submit-btn"
          cancelButtonTitle="Cancel"
          activeBtnTitle="Update"
        />
      )}
      {showLectureDeleteModal.show && (
        <ConfirmationBox
          show={showLectureDeleteModal.show}
          onClose={handleLectureCloseDeleteModal}
          loading={loadingCRUD}
          title="Delete Lecture"
          body="Are you sure you want to delete this Lecture?"
          onConfirm={handleDeleteLecture}
          customFooterClass="custom-footer-class"
          nonActiveBtn="cancel-button"
          activeBtn="delete-button"
          activeBtnTitle="Delete"
        />
      )}

      {loading ? (
        <Loading />
      ) : (

        <>
          {modalShow && (
            <ConfirmationBox
              className="add-link-modal"
              show={modalShow}
              onClose={handlePopupClick}
              onConfirm={() => addResource()}
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
                      onChange={(e) => setLabel(e.target.value)}
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
                      onChange={(e) => setUrl(e.target.value)}
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
                      onChange={(e) => resourceFileChanged(e)} />
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

          <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} size="lg" centered>
            <Modal.Body>
              <Formik
                initialValues={{
                  quiz: {
                    question: editQuiz?.title || '',
                    options: [
                      editQuiz?.option1 || '',
                      editQuiz?.option2 || '',
                      editQuiz?.option3 || '',
                      editQuiz?.option4 || '',
                    ],
                    correctAnswer: editQuiz?.correct_answer || '',
                  },
                }}
                validationSchema={quizValidationSchema}
                onSubmit={handleQuizSubmit}
              >
                {({ isSubmitting, values }) => (
                  <Form>
                    <div className="quiz-wrapper">
                      <div className="add-quiz-title">
                        <p>{editQuiz ? 'Edit Quiz' : 'Add Quiz'}</p>
                      </div>
                      <div className="quiz-fields-container">
                        <div className="add-quiz-fields">
                          <div className="add-quiz-label mb-2">
                            <p>Please Insert MCQ for Student's personal assessment.</p>
                          </div>
                          <div className="add-quiz-question">
                            <div className="d-flex align-items-center">
                              <Field
                                name="quiz.question"
                                className="field-control"
                                type="text"
                                placeholder="Please Type Question Here..."
                              />
                            </div>
                            <ErrorMessage
                              name="quiz.question"
                              component="div"
                              className="error"
                            />
                            <div className="quiz-multiple-choice">
                              {values.quiz.options.map((_, optIndex) => (
                                <div key={optIndex}>
                                  <Field
                                    name={`quiz.options[${optIndex}]`}
                                    className="field-control"
                                    type="text"
                                    placeholder={`Type option ${optIndex + 1}`}
                                  />
                                  <ErrorMessage
                                    name={`quiz.options[${optIndex}]`}
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="add-quiz-label mb-2">
                              <p>Select Correct Answer</p>
                            </div>
                            <Field
                              as="select"
                              name="quiz.correctAnswer"
                              className="field-control"
                            >
                              <option value="">Select correct answer</option>
                              {values.quiz.options.map((option, index) => (
                                <option key={index} value={option}>
                                  {option || `Option ${index + 1}`}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="quiz.correctAnswer"
                              component="div"
                              className="error"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-end gap-3">
                      <Button
                        type="button"
                        onClick={() => setShowQuizModal(false)}
                        className="cancel-btn"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                      >
                        {editQuiz ? 'Update Quiz' : 'Save Quiz'}
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
                            {/* <Dropdown.Item href="javascript:void(0)">Edit Course</Dropdown.Item> */}
                            <Dropdown.Item onClick={onBack}>Edit Course</Dropdown.Item>
                            <Dropdown.Item onClick={addNewTopic}>Add Folder</Dropdown.Item>
                            <Dropdown.Item onClick={addUnassignedLecture}>Add Lecture</Dropdown.Item>

                            <Dropdown.Item href="javascript:void(0)">Delete</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    {!hasLectures ? (
                      <>
                        {/* Folders code start  */}
                        <DragDropContext onDragEnd={handleDragEnd}>
                          {topics.map((topic, topicIndex) => (
                            <Droppable droppableId={`topic-${topicIndex}`} key={topicIndex}>
                              {(provided) => (
                                <div
                                  className="folder-detail"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  {/* Topic Header */}
                                  <div
                                    className="drop-box"
                                    onClick={() => toggleFolder(topicIndex)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <h3>{topic.name}</h3>
                                    <div className={`folder-dropdown ${isOpen[topicIndex] ? 'rotated' : ''}`}>
                                      <img src={Drop} alt="" />
                                    </div>
                                  </div>

                                  {/* Lectures */}
                                  {isOpen[topicIndex] && (
                                    <div className="detail-box">
                                      <ul>
                                        {topic.lectures.map((lecture, lectureIndex) => (
                                          <Draggable
                                            key={lecture.id}
                                            draggableId={lecture.id.toString()}
                                            index={lectureIndex}
                                          >
                                            {(provided) => (
                                              <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                              >
                                                <a
                                                  href="javascript:void(0)"
                                                  onClick={() => loadLectureData(lecture)}
                                                >
                                                  {lecture.name ?? "ERROR"}
                                                </a>

                                                <div className="drop-box">
                                                  <Dropdown>
                                                    <Dropdown.Toggle id="dropdown-basic">
                                                      <div className="toggle-icon">
                                                        <img
                                                          src={Ellips}
                                                          alt=""
                                                          onClick={() => {
                                                            setSelectedLecture(lectureIndex);
                                                          }}
                                                        />
                                                      </div>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>

                                                      {isEditing ? (
                                                        <Dropdown.Item
                                                          href="javascript:void(0)"
                                                          onClick={() => {
                                                            setPendingLectureId(lecture.id);
                                                            setPublishLectureModel(true);
                                                          }}
                                                        >
                                                          Edit
                                                        </Dropdown.Item>
                                                      ) : (
                                                        <Dropdown.Item
                                                          href="javascript:void(0)"
                                                          onClick={() => handleEditClick(lecture.id)}
                                                        >
                                                          Edit
                                                        </Dropdown.Item>
                                                      )}

                                                      <Dropdown.Item
                                                        onClick={() => duplicateLecture({
                                                          lectureId: lecture.id,
                                                          topicIndex,
                                                          lectureIndex
                                                        })}
                                                      >
                                                        Duplicate
                                                      </Dropdown.Item>

                                                      <Dropdown drop="right" as="div">
                                                        <Dropdown.Toggle
                                                          as="span"
                                                          className="dropdown-item"
                                                          style={{ cursor: 'pointer' }}
                                                        >
                                                          Move
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Item
                                                          onClick={() => handleLectureDeleteClick(lecture.id)}
                                                        >
                                                          Delete
                                                        </Dropdown.Item>

                                                        <Dropdown.Menu className="move-drop">
                                                          {topics.map((moveTopic, i) => (
                                                            <Dropdown.Item
                                                              key={i}
                                                              onClick={() => moveUnassignedLecture(lectureIndex, i)}
                                                            >
                                                              {moveTopic.name}
                                                            </Dropdown.Item>
                                                          ))}
                                                        </Dropdown.Menu>
                                                      </Dropdown>
                                                    </Dropdown.Menu>
                                                  </Dropdown>
                                                </div>

                                              </li>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Droppable>
                          ))}
                        </DragDropContext>
                        {/* Folders Code End  */}

                        {/* Lectures without folder  */}
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
                                        <Dropdown drop="right" as="div">

                                          <Dropdown.Menu className='move-drop'>
                                            {topics.map((topic, i) => (
                                              <Dropdown.Item
                                                key={i}
                                                onClick={() =>
                                                  moveUnassignedLecture(
                                                    index,
                                                    i
                                                  )
                                                }
                                              >
                                                {topic.name}
                                              </Dropdown.Item>
                                            ))}
                                          </Dropdown.Menu>
                                        </Dropdown>
                                        {isEditing ? (
                                          <Dropdown.Item
                                            href="javascript:void(0)"
                                            onClick={() => {
                                              setPendingLectureId(lecture.id);
                                              setPublishLectureModel(true);
                                            }}
                                          >
                                            Edit
                                          </Dropdown.Item>
                                        ) : (
                                          <Dropdown.Item
                                            href="javascript:void(0)"
                                            onClick={() => handleEditClick(lecture.id)}
                                          >
                                            Edit
                                          </Dropdown.Item>
                                        )}

                                        {/* <Dropdown.Item onClick={() => {
                                          setSelectedLecture({ topicIndex: null, lectureIndex: index }); // null because it's unassigned
                                          setShowMovePopup(true);
                                        }}>
                                          Move
                                        </Dropdown.Item> */}

                                        <Dropdown.Item
                                          onClick={() => duplicateLecture({ lectureId: lecture.id })}

                                        >
                                          Duplicate</Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={() => handleLectureDeleteClick(lecture.id)}

                                        >
                                          Delete</Dropdown.Item>
                                        <Dropdown drop="right" as="div">
                                          <Dropdown.Toggle
                                            as="span"
                                            className="dropdown-item"
                                            style={{ cursor: 'pointer' }}
                                          >
                                            Move
                                          </Dropdown.Toggle>

                                          <Dropdown.Item
                                            onClick={() => handleLectureDeleteClick(lecture.id)}
                                          >
                                            Delete
                                          </Dropdown.Item>

                                          <Dropdown.Menu className="move-drop">
                                            {topics.map((moveTopic, i) => (
                                              <Dropdown.Item
                                                key={i}
                                                onClick={() => moveLecture(i)}
                                              >
                                                {moveTopic.name}
                                              </Dropdown.Item>
                                            ))}
                                          </Dropdown.Menu>
                                        </Dropdown>
                                        {/* <Dropdown.Item 
                                        onClick={() => {
                                          setSelectedLectureId(lecture.id);
                                          setLectureLabel(lecture.title);
                                          setModalShowRename(true);
                                        }}
                                      >
                                        Rename
                                      </Dropdown.Item> */}
                                      </Dropdown.Menu>
                                    </Dropdown>

                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}
                        {/* End Lectures without Folders  */}

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
                      <>
                        {/* <div className="new-page-view">
                        <div className="course-right-header">
                          <h2 className="subhead">New Page</h2>
                          <Button onClick={() => setIsEditing(true)} className="edit-btn" variant="outlined">
                            <FontAwesomeIcon icon={faPen} style={{ marginRight: 8 }} />

                          </Button>
                        </div>
                      </div> */}
                        {(initialData?.lecturess?.length > 0 || initialData?.folders?.some(folder => folder.lectures?.length > 0)) ? (
                          <>
                            {/* Unassigned lectures */}
                            {initialData.lecturess?.map((lecture) => (
                              <div className="new-page-view" key={lecture.id}>
                                <div className="course-right-header">
                                  <h2 className="subhead">{lecture?.name}</h2>
                                  <img
                                    className="cursor-pointer"
                                    src={PencilLine}
                                    alt="Edit"
                                    onClick={() => handleEditClick(lecture.id)}
                                  />
                                </div>
                              </div>
                            ))}

                            {/* Folder lectures */}
                            {initialData.folders?.map((folder) =>
                              folder.lectures?.map((lecture) => (
                                <div className="new-page-view" key={lecture.id}>
                                  <div className="course-right-header">
                                    <h2 className="subhead">{lecture?.name}</h2>
                                    <img
                                      className="cursor-pointer"
                                      src={PencilLine}
                                      alt="Edit"
                                      onClick={() => handleEditClick(lecture.id)}
                                    />
                                  </div>
                                </div>
                              ))
                            )}
                          </>
                        ) : (
                          <p className="no-lectures-message">
                            You don’t have any lectures yet.{' '}
                            <span
                              onClick={() => addUnassignedLecture()}
                              style={{ cursor: 'pointer', color: '#007bff' }}
                            >
                              Add
                            </span>{' '}
                            a new lecture to get started.
                          </p>
                        )}


                      </>

                    ) : (
                      <Formik
                        enableReinitialize
                        initialValues={{
                          // description: stripHtmlTags(editingLecture?.description) || '',
                          description: editingLecture?.description || '',
                          name: editingLecture?.name || '',
                          transcript: editingLecture?.transcript || '',
                          id: editingLecture?.id || '',
                          // quizzes: editingLecture?.quizzes || [],
                          // quizzes: lectureQuizzes || [],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {/* {({ isSubmitting, values, setFieldValue }) => ( */}
                        {({ isSubmitting, handleSubmit, setFieldValue, values, errors }) => (
                          // richTextEditor for the lecure edit part 
                          <Form>
                            <Row>
                              <Col>
                                <Input
                                  className="field-quill-control"
                                  type="richTextEditor"
                                  name="description"
                                  id="course_description"
                                  showResources={true}
                                  showNameField={true}
                                  showNameFieldData={values?.name}
                                  onNameChange={(newName) => setFieldValue('name', newName)}
                                  resources={resources}

                                  modules={{ toolbar: TOOLBAR_CONFIG }}
                                  formats={FORMATS}
                                />
                                <ErrorMessage
                                  name="name"
                                  component="div"
                                  className="error"
                                />
                              </Col>
                            </Row>
                            {/* Transcript section  */}
                            {
                              showTranscriptEditor ? (
                                <div className={`res trans-res ${showTranscriptEditor ? 'showing-transcript' : ''}`}>
                                  <h2 className="subhead">Add Transcript</h2>
                                  <div className="transc">
                                    <div className="drop-box">
                                    </div>
                                    <div
                                      className={`transcript-section ${showTranscriptEditor ? '' : 'd-none'}`}
                                    >
                                      <Input
                                        className="field-quill-control"
                                        type="richTextEditor"
                                        name="transcript"
                                        id="transcript"
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
                              ) : ""
                            }

                            {/* End Transcript Section  */}
                            <div className="mt-3 d-flex gap-3 flex-wrap tab-buttons  editor-buttons justify-content-between">
                              <div className='editor-button'>
                                <div className='addAdditionalOptions'>
                                  <Dropdown onSelect={handleSelect} >
                                    <Dropdown.Toggle id="dropdown-basic">
                                      Add
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item eventKey="add-resource">Add resources</Dropdown.Item>
                                      <Dropdown.Item eventKey="add-transcript" >Add Transcript </Dropdown.Item>
                                      <Dropdown.Item eventKey="add-quiz" >Add Quiz </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                              <div className='gap-3 d-flex'>
                                <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                  {isEditing ? 'Update Lecture' : 'Save & Next'}
                                </Button>
                                <Button type="submit" className="submit-btn"
                                >
                                  Save & Next
                                </Button>
                              </div>


                            </div>



                            {/* <div className="res">
                              <h2 className="subhead">Add Resources</h2>
                              <div className="drop-box">
                                <Dropdown>
                                  <Dropdown.Toggle id="dropdown-basic">
                                    <div className="toggle-icon">Add</div>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="javascript:void(0)" onClick={handlePopupClick}>
                                      Add resource
                                    </Dropdown.Item>

                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div> */}

                            {/* <div className="res">
                              <h2 className="subhead">Add Quiz</h2>

                              <div className="drop-box">
                                <div className="add-btn">
                                  <a href="javascript:void(0)" onClick={handleQuizPopupClick}>Add New</a>
                                </div>
                              </div>
                            </div> */}



                            {/* Display quizzes if available */}
                            {lectureQuizzes.length > 0 && (
                              <div className="res">
                                <div className="quizz-wrap" style={{ width: '100%' }}>

                                  {lectureQuizzes.map((quiz, index) => (
                                    <div className="course-right-header border-0" key={quiz.id}>
                                      <h2 className="subhead border-0">{quiz.title}</h2>
                                      <div className="items-text d-flex gap-2">
                                        <img
                                          className="cursor-pointer"
                                          src={PencilLine}
                                          alt="Edit"
                                          onClick={() => handleQuizPopupClick(quiz)}
                                        />
                                        <img
                                          className="cursor-pointer"
                                          src={trashIconRed}
                                          alt="Delete"
                                          onClick={() => handleDeleteQuizClick(quiz.id)}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* END QUIZES AVAILABLE  */}




                            {publishLectureModel && (
                              <ConfirmationBox
                                show={publishLectureModel}
                                onClose={modelPopAction}
                                onConfirm={handleSubmit}
                                title="Save Your lecture data ..."
                                body="You have unsaved changes. Would you like to save them before editing, or continue without saving?"
                                loading={loadingCRUD}
                                customFooterClass="custom-footer-class"
                                nonActiveBtn="cancel-btn"
                                activeBtn="submit-btn"
                                cancelButtonTitle="Proceed without Saving"
                                activeBtnTitle=" Save & Proceed"
                              />
                            )}

                          </Form>
                        )}
                      </Formik>
                    )}

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