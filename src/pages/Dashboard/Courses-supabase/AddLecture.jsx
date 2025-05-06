import { useState, useEffect } from 'react';
import { Button, Row, Col, Modal, Spinner } from 'react-bootstrap';
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
import { faMinus, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import Loading from '@components/Loading/Loading';
import { stripHtmlTags } from '../../../utils/utils';
import PencilLine from '../../../assets/icons/PencilLine.svg';
import PencilEdit from '../../../assets/icons/PencilLine2.svg';
import trashIconRed from '../../../assets/icons/Trash-rename.svg';
import * as types from '../../../redux/actions/actionTypes';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import Edit2 from '../../../assets/icons/Dropdown.svg';

const AddNewLecture = ({ onNext, onBack, initialData, setStepComplete, updateCourseData }) => {

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentActiveLectureID, setCurrentActiveLectureID] = useState(null);
    const [currentActiveLecture, setCurrentActiveLecture] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [modalShowRename, setModalShowRename] = useState(false);
    const [editResource, setEditResource] = useState(false);
    const [editResourceID, setEditResourceID] = useState(null);
    const [selectedLectureId, setSelectedLectureId] = useState(null);
    const [lectureLabel, setLectureLabel] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
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
    const [resourceUrl, setResourceUrl] = useState('');
    const [resourceFileUrl, setResourceFileUrl] = useState('');
    const [label, setLabel] = useState('');
    const [topics, setTopics] = useState([]);
    const [lectureQuizzes, setLectureQuizzes] = useState([]);
    const [editQuiz, setEditQuiz] = useState(null);
    const [rightViewLecture, setRightViewLecture] = useState(null);
    const [activeLectureId, setActiveLectureId] = useState(null);

    const dispatch = useDispatch();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // useEffect(() => {
    //     if (topics.length > 0) {
    //         setIsOpen({ 0: true }); // Open the first topic
    //     }
    // }, [topics]);

    useEffect(() => {
        if (topics.length > 0) {
            const openAll = {};
            topics.forEach((_, index) => {
                openAll[index] = true;
            });
            setIsOpen(openAll);
        }
    }, [topics]);


    useEffect(() => {
        if (initialData) {
            if (initialData.lecturess?.length > 0) {
                setRightViewLecture(initialData.lecturess[0]);
                setActiveLectureId(initialData.lecturess[0].id)
            } else {
                const folderWithLecture = initialData.folders?.find(folder => folder.lectures?.length > 0);
                if (folderWithLecture) {
                    setRightViewLecture(folderWithLecture.lectures[0]);
                    setActiveLectureId(folderWithLecture.lectures[0].id);

                }
            }
        }
    }, [initialData]);

    const [showDeleteModal, setShowDeleteModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        quizId: null,
        initialValues: null
    });
    const [renaming, setRenaming] = useState({ type: null, id: null });

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
            correct_answer: correctAnswer
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
            const newLectures = initialData.lecturess.map((lecture) => ({
                name: lecture.name,
                id: lecture.id,
                description: lecture.description
            }));

            setUnassignedLectures((prev) => [...prev, ...newLectures]);
        }


        // set the folders and the topic well
        if (initialData?.folders) {
            const updatedTopics = initialData.folders.map((folder) => ({
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



    // DELETE FOLDER START 
    const deleteFolder = async (id) => {
        let ENDPOINT = API_URL.SUPABASE_COURSE_FOLDER_DELETE.replace(':id', id);
        try {
            console.log(ENDPOINT)
            const response = await axiosWrapper('DELETE', ENDPOINT, {}, token);
            if (response?.data) {
                const folderToDelete = topics.find(folder => folder.id === id);
                if (folderToDelete) {
                    setUnassignedLectures(prev => [...prev, ...(folderToDelete.lectures || [])]);
                    setTopics(prev => prev.filter(folder => folder.id !== id));
                }
            }
        } catch (error) {
            console.error('Failed to rename lecture:', error);
            return null;
        }
    }
    // DELETE FOLDER END 

    const toggleFolder = (index) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const toggleSwitch = async () => {
        setIsPublishing(true);
        const data = {
            is_published: 'false'
        };
        setIsPublished(!isPublished);
        const url = getApiUrl(isEditing, editingLecture?.id);
        const method = isEditing ? 'PUT' : 'POST';
        try {
            await axiosWrapper(method, url, data, token);
        } catch (err) {
            setIsPublished((prev) => !prev);
        } finally {
            setIsPublishing(false);
        }
    };



    // END DELETE RESOURCE 
    // Add New Lecture which is unassinged
    const addUnassignedLecture = async () => {
        const newLec = {
            name: 'New Lecture',
            courseId: currentCourse
        };
        const response = await axiosWrapper('POST', API_URL.SUPABASE_ADD_LECTURE, newLec, token);

        if (response.data) {
            const lec_id = response.data[0].id;
            newLec.id = lec_id;
            newLec.courseId = currentCourse;
        }

        setUnassignedLectures([...unassignedLectures, newLec]);

        // setEditingLecture(true);
    };

    const addResource = async () => {

        const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;

        if (!label.trim()) {
            alert('Label is required.');
            return;
        }

        const isUrlProvided = resourceUrl?.trim().length > 0;
        const isValidUrl = isUrlProvided && urlPattern.test(resourceUrl.trim());
        const isFileProvided = !!resourceFileUrl;

        if (isUrlProvided && !isValidUrl) {
            alert('Please enter a valid URL.');
            return;
        }

        if (!isFileProvided && !isValidUrl) {
            alert('Please provide either a file or a valid URL.');
            return;
        }

        let ENDPOINT = API_URL.SUPABASE_UPDATE_LECTURE_RESOURCE.replace(':id', currentActiveLectureID);
        let METHOD = "POST";

        const lectureData = {
            model_id: currentActiveLectureID,
            model_type: 'lecture',
            name: label,
            type: 'file',
            file_link: resourceFileUrl,
            url: resourceUrl,
            showPopUp:true 
        };

        if (editResource === true && editResourceID) {
            lectureData.id = editResourceID;
        }

        const response = await axiosWrapper(METHOD, ENDPOINT, { lectureData }, token);
        var id = null;
        if (response) {
            id = response.data[0].id;
        }

        const resource = {
            image: '/resource_image.svg',
            url: resourceUrl,
            title: label,
            id: id,
            file_link: resourceFileUrl,
            type: isUrlProvided ? 'url' : 'file',
            showPopUp: true 
        };

        // Update UI - replace if editing, or append if new
        if (editResource && editResourceID) {
            setResources(prev =>
                prev.map((r) => (r.id === editResourceID ? resource : r))
            );
        } else {
            setResources([...resources, resource]);
        }

        // ✅ Reset state after done
        setModalShow(false);
        setEditResource(false);
        setEditResourceID(null);
        setLabel('');
        setResourceFileUrl('');
        setResourceUrl('');
    };

    const addNewTopic = async () => {
        const topic = {
            name: `Folder ${topics.length + 1}`,
            lectures: []
        };
        const method = 'POST';
        const url = API_URL.SUPABASE_CREATE_COURSE_FOLDER.replace(':id', currentCourse);
        const formData = {
            name: topic.name,
            order_id: topics.length + 1
        };
        const response = await axiosWrapper(method, url, formData, token);
        console.log(response, ' FOlder Hit api Data  ');
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
            const originalLectureRes = await axiosWrapper(
                'GET',
                API_URL.SUPABASE_GET_LECTURE.replace(':id', lectureId),
                null,
                token
            );
            const originalLecture = originalLectureRes?.data;
            if (!originalLecture) throw new Error('Lecture not found');

            const newLecturePayload = {
                name: `(Copy) ${originalLecture.name}`,
                description: originalLecture.description,
                transcript: originalLecture.transcript,
                courseId: originalLecture.courseId,
                folder_id: originalLecture.folder_id
            };

            const newLectureRes = await axiosWrapper('POST', API_URL.SUPABASE_ADD_LECTURE, newLecturePayload, token);
            const newLecture = newLectureRes.data[0];
            const newLectureId = newLecture.id;

            if (!newLectureId) throw new Error('Failed to duplicate lecture');

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
                    showPopUp: false
                };
                await axiosWrapper('POST', API_URL.SUPABASE_ADD_QUIZ, quizPayload, token);
            }

            // Duplicate resources
            const resources = originalLecture.resources || [];
            for (const res of resources) {
                const lectureData = {
                    model_id: newLectureId,
                    model_type: 'lecture',
                    name: res.name || res.title,
                    type: res.type || 'file',
                    file_link: res.file_link || res.image,
                    showPopUp: false
                };
                const resourceUrl = API_URL.SUPABASE_UPDATE_LECTURE_RESOURCE.replace(':id', newLectureId);
                await axiosWrapper('POST', resourceUrl, { lectureData }, token);
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
            console.error('❌ Error duplicating lecture with extras:', err);
            setLoading(false);
        }
    };

    const moveLectureDND = async (lectureID, topicID) => {
        const formData = {
            // "name": lectureToMove.name,
            lecture_id: lectureID,
            folder_id: topicID,
            courseId: currentCourse
        };

        const url = API_URL.SUPABASE_UPDATE_LECTURE_FOLDER.replace(':id', lectureID);
        // Request the API and change the DB
        const response = await axiosWrapper('POST', url, formData, token);
    };

    const moveUnassignedLecture = async (unassignedIndex, targetTopicIndex) => {
        const lectureToMove = unassignedLectures[unassignedIndex];

        // Add lecture to target topic
        const updatedTopics = [...topics];

        updatedTopics[targetTopicIndex].lectures.push(lectureToMove);

        // Remove lecture from unassigned
        const updatedUnassignedLectures = unassignedLectures.filter((_, idx) => idx !== unassignedIndex);

        const formData = {
            // "name": lectureToMove.name,
            lecture_id: lectureToMove.id,
            folder_id: updatedTopics[targetTopicIndex].id,
            courseId: currentCourse
        };

        const url = API_URL.SUPABASE_UPDATE_LECTURE_FOLDER.replace(':id', lectureToMove.id);

        console.log(url, ' This si the url to hit for the lecture move');
        // Request the API and change the DB
        const response = await axiosWrapper('POST', url, formData, token);

        // Update state
        setTopics(updatedTopics);

        setUnassignedLectures(updatedUnassignedLectures);
        setShowMovePopup(false);
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required')
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
            correctAnswer: Yup.string().required('Correct answer is required')
        })
    });
    const hasLectures = currentCourse?.lectures && currentCourse?.lectures?.length > 0;

    // console.log(hasLectures);
    //   useEffect(() => {
    //     if (!hasLectures) setIsEditing(true);
    //   }, [hasLectures]);
    // console.log(hasLectures);
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
            setEditResource(false);
            setEditResourceID(null);
            setLabel('');
            setResourceFileUrl('');
            setResourceUrl('');
        } else if (eventKey === 'add-quiz') {
            handleQuizPopupClick(true);
        }
    };

    const handleRename = async ({ value, type, id }) => {
        setRenaming({ type, id });

        const updated = await renameLecture(id, value.trim(), type);

        setRenaming({ type: null, id: null });

        if (updated) {
            if (type === "lecture") {
                setUnassignedLectures((prev) =>
                    prev.map((lecture) =>
                        lecture.id === id ? { ...lecture, name: value.trim() } : lecture
                    )
                );

                setTopics((prevTopics) =>
                    prevTopics.map((folder) => ({
                        ...folder,
                        lectures: folder.lectures.map((lecture) =>
                            lecture.id === id ? { ...lecture, name: value.trim() } : lecture
                        )
                    }))
                );
            } else if (type === "folder") {
                setTopics((prevTopics) =>
                    prevTopics.map((folder) =>
                        folder.id === id ? { ...folder, name: value.trim() } : folder
                    )
                );
            }
            // Clear modal and input only if renaming lecture (optional)
            setModalShowRename(false);
            setLectureLabel('');
            setSelectedLectureId(null);
        }
    };



    const handleDeleteSubmit = async () => {
        const deletedQuizId = showDeleteModal.quizId;
        try {
            setLoadingCRUD(true);
            await axiosWrapper('DELETE', `${API_URL.SUPABASE_DELETE_QUIZ.replace(':id', deletedQuizId)}`, {}, token);

            setLectureQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== deletedQuizId));
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

    // GET FRESH LECTURE DATA 
    const getLectureData = async (id) => {
        const url = API_URL.SUPABASE_GET_LECTURE.replace(':id', id);
        const response = await axiosWrapper('GET', url, {}, token);
        return response;
    };
    // END GET FRESH LECTURE DATA 

    const loadLectureData = async (lecture) => {
        setCurrentActiveLectureID(lecture.id);
        setCurrentActiveLecture(lecture);
        const lecData = await getLectureData(currentActiveLectureID);
    };


    // EDIT THE LECTURE WHEN CLICK ON THE EDIT 
    const handleEditClick = async (id) => {

        const lecture = await getLectureData(id);
        setRightViewLecture(lecture.data);

        const description = stripHtmlTags(lecture.data?.description);
        const transcript = stripHtmlTags(lecture.data?.transcript);
        setCurrentActiveLectureID(id);

        const lectureDetail = {
            name: lecture.data?.name,
            description: description,
            transcript: transcript,
            id: lecture.data?.id,
            courseId: lecture.data?.courseId,
            quizzes: lecture?.data?.quizzes
        };

        setLectureQuizzes(lecture?.data?.quizzes || []);

        setEditingLecture(lectureDetail);

        setIsEditing(true);

        // Get the resouces of the lecture
        const lecResources = lecture.data.resources ?? [];
        const resources = lecResources.map((lec) => {
            return {
                image: '/resource_image.svg',
                url: lec.url,
                file_link: lec.file_link,
                type: lec.type,
                title: lec.name,
                id: lec.id
            };
        });
        setResources(resources);
    };
    // END THE LECTURE EDIT FUNCTION 

    const getApiUrl = (isEditable, lectureId) => {
        return isEditable
            ? `${API_URL.SUPABASE_UPDATE_LECTURE.replace(':id', lectureId)}`
            : `${API_URL.SUPABASE_ADD_LECTURE}`;
    };

    const prepareFormData = (values) => {
        const formData = { ...values, courseId: editingLecture?.courseId };


        return formData;
    };

    const modelPopAction = () => {
        if (pendingLectureId) {
            handleEditClick(pendingLectureId);
            setPublishLectureModel(false);
            setPendingLectureId(null);
        }
        // setSubmitting(false);
    };
    const editClickLeture = (lecture) => {
    
    
        if (hasUnsavedChanges) {
            const confirmLeave = window.confirm('You have unsaved changes. Do you want to leave without saving?');
            if (!confirmLeave) {
                return;
            }
        }
        setActiveLectureId(lecture.id);
        setHasUnsavedChanges(false);
        setIsEditing(false);
        setRightViewLecture(lecture);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm, ...formikHelpers }) => {
        // setSubmitting(true);

        const action = formikHelpers?.event?.nativeEvent?.submitter?.value;

     
        try {
            const formData = prepareFormData(values);

            const url = getApiUrl(isEditing, editingLecture?.id);
            const method = isEditing ? 'PUT' : 'POST';

            const response = await axiosWrapper(method, url, formData, token);
            // dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'currentCourseUpdate', data: true } });

            if (response?.data) {
               
                const updatedLectureId = response.data.id;
                const updatedLectureName = response.data.name.trim();
                const updatedDes = response.data.description;

                setUnassignedLectures((prevLectures) =>
                    prevLectures.map((lecture) =>
                        lecture.id === updatedLectureId
                            ? { ...lecture, name: updatedLectureName, description:  updatedDes }
                            : lecture
                    )
                );
                setTopics((prevTopics) =>
                    prevTopics.map((folder) => ({
                        ...folder,
                        lectures: folder.lectures.map((lecture) =>
                            lecture.id === updatedLectureId
                                ? { ...lecture, name: updatedLectureName , description:  updatedDes  }
                                : lecture
                        )
                    }))
                );

                if (rightViewLecture?.id === updatedLectureId) {
                    setRightViewLecture((prevLecture) => ({
                        ...prevLecture,
                        name: updatedLectureName,
                        description:  updatedDes
                    }));
                }

                // setIsEditing(false)


            }
        } catch (err) {
            // handleError(err);
            console.log(err);
        } finally {
            // setIsEditing(false)
            // setSubmitting(false);
            modelPopAction();
            setHasUnsavedChanges(false);
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
        // If dropped in the same position
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
           
            return;
        }

        if (
            source.droppableId === 'unassigned' &&
            destination.droppableId === 'unassigned'
        ) {
            const newUnassigned = [...unassignedLectures];
            const [movedLecture] = newUnassigned.splice(source.index, 1);
            newUnassigned.splice(destination.index, 0, movedLecture);
    
            setUnassignedLectures(newUnassigned);
            updateLectureSequences(newUnassigned); // Update order in DB or local state
            return;
        }

        // Moving from unassigned to a topic
        if (source.droppableId === 'unassigned' && destination.droppableId.startsWith('topic-')) {
            const destTopicIndex = parseInt(destination.droppableId.split('-')[1]);
            const movedLecture = unassignedLectures[source.index];

            // Remove from unassigned
            const newUnassigned = [...unassignedLectures];
            newUnassigned.splice(source.index, 1);
            setUnassignedLectures(newUnassigned);

            // Add to destination topic
            const newTopics = [...topics];
            newTopics[destTopicIndex].lectures.splice(destination.index, 0, movedLecture);

            // API call to update backend
            const folder_id = newTopics[destTopicIndex].id;
            const lecture_id = movedLecture.id;
            moveLectureDND(lecture_id, folder_id);
            setTopics(newTopics);
            updateLectureSequences(newTopics[destTopicIndex].lectures);
            return;
        }

        // Moving from a topic to unassigned
        if (source.droppableId.startsWith('topic-') && destination.droppableId === 'unassigned') {
            const sourceTopicIndex = parseInt(source.droppableId.split('-')[1]);
            const movedLecture = topics[sourceTopicIndex].lectures[source.index];

            // Remove from source topic
            const newTopics = [...topics];
            newTopics[sourceTopicIndex].lectures.splice(source.index, 1);

            // Add to unassigned
            const newUnassigned = [...unassignedLectures];
            newUnassigned.splice(destination.index, 0, movedLecture);

            // API call to update backend (set folder_id to null or your unassigned value)
            const lecture_id = movedLecture.id;
            moveLectureDND(lecture_id, null); // or your unassigned folder ID

            setTopics(newTopics);
            setUnassignedLectures(newUnassigned);

            updateLectureSequences(newUnassigned);
            updateLectureSequences(newTopics[sourceTopicIndex].lectures);

            return;
        }

        // Moving between topics (existing logic)
        if (source.droppableId.startsWith('topic-') && destination.droppableId.startsWith('topic-')) {
          
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

            updateLectureSequences(newTopics[destTopicIndex].lectures);

            // Also update source topic if lecture was moved out of it
            if (sourceTopicIndex !== destTopicIndex) {
                updateLectureSequences(newTopics[sourceTopicIndex].lectures);
            }

            return;
        }

     
    };

    const updateLectureSequences = (lectureList) => {
        const payload = lectureList.map((lecture, index) => ({
            id: lecture.id,
            order_id: index,
        }));
        updateLectureOrder(payload);
    };


    const updateLectureOrder = async (lectures) => {
        try {
            let ENDPOINT = API_URL.SUPABASE_UPDATE_LECTURE_SEQUENCE
            const response = await axiosWrapper('PUT', ENDPOINT, { lectures }, token);

        } catch (error) {
            console.error('Failed to update lecture order', error);
        }
    };

    const unescapeHtml = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
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

    const renameLecture = async (id, newTitle, type) => {
        if (!id || !newTitle) {
            return;
        }

        let ENDPOINT = "";
        if (type == "lecture") {
            ENDPOINT = API_URL.SUPABASE_UPDATE_LECTURE.replace(':id', id);

        } else if (type == "folder") {
            ENDPOINT = API_URL.SUPABASE_COURSE_FOLDER_UPDATE.replace(':id', id);
        }

        try {
            const payload = {
                name: newTitle,
                source: "rename"
            };

            const response = await axiosWrapper('PUT', ENDPOINT, payload, token);
            return response.data;
        } catch (error) {
            console.error('Failed to rename lecture:', error);
            return null;
        }
    };

    const handleRenameLecture = async () => {
        if (!lectureLabel?.trim() || !selectedLectureId) {
            return;
        }

        let ENDPOINT = API_URL.SUPABASE_UPDATE_LECTURE.replace(':id', selectedLectureId);
        try {
            const payload = {
                name: lectureLabel,
                source: "rename"
            };

            const response = await axiosWrapper('PUT', ENDPOINT, payload, token);


            if (response) {
                setUnassignedLectures((prev) =>
                    prev.map((lecture) =>
                        lecture.id === selectedLectureId ? { ...lecture, name: lectureLabel.trim() } : lecture
                    )
                );
                setTopics((prevTopics) =>
                    prevTopics.map((folder) => ({
                        ...folder,
                        lectures: folder.lectures.map((lecture) =>
                            lecture.id === selectedLectureId ? { ...lecture, name: lectureLabel.trim() } : lecture
                        )
                    }))
                );
                setModalShowRename(false);
                setLectureLabel('');
                setSelectedLectureId(null);
                setRightViewLecture({ ...rightViewLecture, name: lectureLabel.trim() });
            }
        } catch (error) {
            console.error('Failed to rename lecture:', error);
            return null;
        }

    };

    const resourceFileChanged = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);
        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        setResourceFileUrl('/resource_image.svg');
    };

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
                    onConfirm={() => handleRenameLecture()}
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
                                {!lectureLabel?.trim() && <div className="error-message">* Field is required</div>}
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
                            onConfirm={addResource}
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
                                            value={label}
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
                                            value={resourceUrl}
                                            className="form-control"
                                            placeholder="Enter URL"
                                            onChange={(e) => setResourceUrl(e.target.value)}
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
                                            onChange={(e) => resourceFileChanged(e)}
                                        />
                                    </div>
                                </div>
                            }
                            customFooterClass="custom-footer-class"
                            nonActiveBtn="cancel-btn"
                            activeBtn="submit-btn"
                            cancelButtonTitle="Cancel"
                            activeBtnTitle={editResource ? "Update" : "Add"}
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
                                            editQuiz?.option4 || ''
                                        ],
                                        correctAnswer: editQuiz?.correct_answer || ''
                                    }
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
                                            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
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
                                <div className="col-lg-4 col-md-12">
                                    <div className="course-left">
                                        <div className="course-left-top">
                                            <h2 className="subhead">
                                                <EditText
                                                    name="textbox1"
                                                    defaultValue={title}
                                                    inputClassName="editable-input"
                                                />
                                            </h2>
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
                                                        <Dropdown.Item onClick={addUnassignedLecture}>
                                                            Add Lecture
                                                        </Dropdown.Item>

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
                                                                        onClick={(e) => {
                                                                            if (!e.target.closest('.editable-text')) {
                                                                                toggleFolder(topicIndex);
                                                                            }
                                                                        }}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <h3 className="editable-header">
                                                                            {renaming.type === "folder" && renaming.id === topic.id ? (
                                                                                <Spinner animation="border" size="sm" className="ms-2" />
                                                                            ) : (
                                                                                <EditText
                                                                                    name="textbox2"
                                                                                    defaultValue={topic.name}
                                                                                    inputClassName="editable-input"
                                                                                    onSave={({ value }) =>
                                                                                        handleRename({ value, type: "folder", id: topic.id })
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </h3>
                                                                        <div className='folder-dd-name'>
                                                                            <Dropdown align="end">
                                                                                <Dropdown.Toggle variant="light" className="action-dropdown-toggle" id="dropdown-basic">
                                                                                    <img src={Edit2} alt="" />
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu>
                                                                                    <Dropdown.Item onClick={() => deleteFolder(topic.id)}>Delete</Dropdown.Item>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                            <div
                                                                                className={`folder-dropdown ${isOpen[topicIndex] ? 'rotated' : ''}`}
                                                                            >
                                                                                <img src={Drop} alt="" />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Lectures */}
                                                                    {isOpen[topicIndex] && (
                                                                        <div className="detail-box">
                                                                            <ul>
                                                                                {topic.lectures.map(
                                                                                    (lecture, lectureIndex) => (
                                                                                        <Draggable
                                                                                            key={lecture.id}
                                                                                            draggableId={lecture.id.toString()}
                                                                                            index={lectureIndex}
                                                                                        >
                                                                                            {(provided) => (
                                                                                                <li
                                                                                                    onClick={() => {
                                                                                                        // setActiveLectureId(lecture.id);
                                                                                                        // setPendingLectureId(lecture.id);
                                                                                                        editClickLeture(lecture);
                                                                                                        // setPublishLectureModel(
                                                                                                        //     true
                                                                                                        // );
                                                                                                    }}
                                                                                                    ref={provided.innerRef}
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}
                                                                                                    className={lecture.id === activeLectureId ? "active_lecture" : ""}

                                                                                                >
                                                                                                    <a
                                                                                                        href="javascript:void(0)"
                                                                                                        onClick={() => {
                                                                                                            setRightViewLecture(lecture)
                                                                                                        }

                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            lecture.name
                                                                                                            // renaming.type === "lecture" && renaming.id === lecture.id ? (
                                                                                                            //     <Spinner animation="border" size="sm" className="ms-2" />
                                                                                                            // ) : (<EditText
                                                                                                            //     name="textbox3"
                                                                                                            //     defaultValue={
                                                                                                            //         lecture.name ??
                                                                                                            //         'ERROR'
                                                                                                            //     }
                                                                                                            //     inputClassName="editable-input"
                                                                                                            //     onSave={({ value }) => handleRename({ value, type: "lecture", id: lecture.id })}
                                                                                                            // />)
                                                                                                        }

                                                                                                    </a>
                                                                                                    <div className="drop-box">
                                                                                                        <Dropdown>
                                                                                                            <Dropdown.Toggle id="dropdown-basic">
                                                                                                                <div className="toggle-icon">
                                                                                                                    <img
                                                                                                                        src={
                                                                                                                            Ellips
                                                                                                                        }
                                                                                                                        alt=""
                                                                                                                        onClick={() => {
                                                                                                                            setSelectedLecture(
                                                                                                                                lectureIndex
                                                                                                                            );
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </Dropdown.Toggle>
                                                                                                            <Dropdown.Menu>
                                                                                                                {isEditing ? (
                                                                                                                    <Dropdown.Item
                                                                                                                        href="javascript:void(0)"
                                                                                                                        onClick={() => {
                                                                                                                            setActiveLectureId(lecture.id);
                                                                                                                            setPendingLectureId(
                                                                                                                                lecture.id
                                                                                                                            );
                                                                                                                            setPublishLectureModel(
                                                                                                                                true
                                                                                                                            );
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Edit
                                                                                                                    </Dropdown.Item>
                                                                                                                ) : (
                                                                                                                    <Dropdown.Item
                                                                                                                        href="javascript:void(0)"
                                                                                                                        onClick={() => {
                                                                                                                            setActiveLectureId(lecture.id)
                                                                                                                            handleEditClick(
                                                                                                                                lecture.id
                                                                                                                            )
                                                                                                                        }
                                                                                                                        }
                                                                                                                    >
                                                                                                                        Edit
                                                                                                                    </Dropdown.Item>
                                                                                                                )}

                                                                                                                <Dropdown.Item
                                                                                                                    onClick={() =>
                                                                                                                        duplicateLecture(
                                                                                                                            {
                                                                                                                                lectureId:
                                                                                                                                    lecture.id,
                                                                                                                                topicIndex,
                                                                                                                                lectureIndex
                                                                                                                            }
                                                                                                                        )
                                                                                                                    }
                                                                                                                >
                                                                                                                    Duplicate
                                                                                                                </Dropdown.Item>

                                                                                                                <Dropdown
                                                                                                                    drop="right"
                                                                                                                    as="div"
                                                                                                                >
                                                                                                                    {/* <Dropdown.Toggle
                                                                                                                        as="span"
                                                                                                                        className="dropdown-item"
                                                                                                                        style={{
                                                                                                                            cursor: 'pointer'
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Move
                                                                                                                    </Dropdown.Toggle> */}

                                                                                                                    <Dropdown.Item
                                                                                                                        onClick={() =>
                                                                                                                            handleLectureDeleteClick(
                                                                                                                                lecture.id
                                                                                                                            )
                                                                                                                        }
                                                                                                                    >
                                                                                                                        Delete
                                                                                                                    </Dropdown.Item>
                                                                                                                    <Dropdown.Item
                                                                                                                        onClick={() => {
                                                                                                                            setModalShowRename(true);
                                                                                                                            setSelectedLectureId(lecture.id);
                                                                                                                            setLectureLabel(lecture.name);
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Rename
                                                                                                                    </Dropdown.Item>


                                                                                                                </Dropdown>
                                                                                                            </Dropdown.Menu>
                                                                                                        </Dropdown>
                                                                                                    </div>
                                                                                                </li>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    )
                                                                                )}
                                                                                {provided.placeholder}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    ))}
                                                    {/* Unassigned Lectures Section */}
                                                    <Droppable droppableId="unassigned">
                                                        {(provided) => (
                                                            <div
                                                                className="unassigned-lectures"
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                            >
                                                                <div className="detail-box">
                                                                    <ul>
                                                                        {unassignedLectures.map((lecture, index) => (
                                                                            <Draggable
                                                                                key={`unassigned-${lecture.id}`}
                                                                                draggableId={`unassigned-${lecture.id}`}
                                                                                index={index}
                                                                            >
                                                                                {(provided) => (
                                                                                    <li
                                                                                        onClick={() => {
                                                                                            // setActiveLectureId(lecture.id);
                                                                                            // setPendingLectureId(lecture.id);
                                                                            
                                                                                            setRightViewLecture(lecture)
                                                                                            editClickLeture(lecture);
                                                                                            // setPublishLectureModel(
                                                                                            //     true
                                                                                            // );
                                                                                           
                                                                                            
                                                                                        }}
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        className={lecture.id === activeLectureId ? "active_lecture" : ""}
                                                                                    >

                                                                                        {
                                                                                            lecture?.name
                                                                                            
                                                                                        }

                                                                                        <div className="drop-box">
                                                                                            <Dropdown>
                                                                                                <Dropdown.Toggle id="dropdown-basic">
                                                                                                    <div className="toggle-icon">
                                                                                                        <img
                                                                                                            src={Ellips}
                                                                                                            alt=""
                                                                                                        />
                                                                                                    </div>
                                                                                                </Dropdown.Toggle>
                                                                                                <Dropdown.Menu>
                                                                                                    {isEditing ? (
                                                                                                        <Dropdown.Item
                                                                                                            href="javascript:void(0)"
                                                                                                            onClick={() => {
                                                                                                                setActiveLectureId(lecture.id);
                                                                                                                setPendingLectureId(
                                                                                                                    lecture.id
                                                                                                                );
                                                                                                                setPublishLectureModel(
                                                                                                                    true
                                                                                                                );
                                                                                                            }}
                                                                                                        >
                                                                                                            Edit
                                                                                                        </Dropdown.Item>
                                                                                                    ) : (
                                                                                                        <Dropdown.Item
                                                                                                            href="javascript:void(0)"
                                                                                                            onClick={() => {
                                                                                                                setActiveLectureId(lecture.id);
                                                                                                                handleEditClick(
                                                                                                                    lecture.id
                                                                                                                )
                                                                                                            }
                                                                                                            }
                                                                                                        >
                                                                                                            Edit
                                                                                                        </Dropdown.Item>
                                                                                                    )}
                                                                                                    <Dropdown.Item
                                                                                                        onClick={() =>
                                                                                                            duplicateLecture(
                                                                                                                {
                                                                                                                    lectureId:
                                                                                                                        lecture.id
                                                                                                                }
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        Duplicate
                                                                                                    </Dropdown.Item>
                                                                                                    <Dropdown.Item
                                                                                                        onClick={() =>
                                                                                                            handleLectureDeleteClick(
                                                                                                                lecture.id
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        Delete
                                                                                                    </Dropdown.Item>
                                                                                                    <Dropdown.Item
                                                                                                        onClick={() => {
                                                                                                            setModalShowRename(true);
                                                                                                            setSelectedLectureId(lecture.id);
                                                                                                            setLectureLabel(lecture.name);
                                                                                                        }}
                                                                                                    >
                                                                                                        Rename
                                                                                                    </Dropdown.Item>
                                                                                                </Dropdown.Menu>
                                                                                            </Dropdown>
                                                                                        </div>
                                                                                    </li>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                    </ul>
                                                                    {provided.placeholder}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                    {/* End Unassinged Lecture Section  */}
                                                </DragDropContext>


                                                {/* Show the Move Popup for unassigned lectures */}
                                                {/* {showMovePopup &&
                                                    selectedLecture &&
                                                    selectedLecture.topicIndex === null && (
                                                        <div className="popup-backdrop">
                                                            <div className="popup">
                                                                <h3>Move to Folder</h3>
                                                                <ul>
                                                                    {topics.map((topic, index) => (
                                                                        <li
                                                                            key={`move-to-${index}`}
                                                                            onClick={() =>
                                                                                moveUnassignedLecture(
                                                                                    selectedLecture.lectureIndex,
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            {topic.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => setShowMovePopup(false)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )} */}
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

                                <div className="col-lg-8 col-md-12">
                                    <div className="course-right">
                                        {/* new code  */}
                                        {!hasLectures && !isEditing ? (
                                            <>
                                                {rightViewLecture ? (
                                                    <div className="new-page-view" key={rightViewLecture.id}>
                                                        <div className="course-right-header">
                                                            <div className='course-right-name d-flex justify-content-between mb-3' >
                                                                <h2 className="subhead">{rightViewLecture.name}</h2>
                                                                <div
                                                                    className="img-box cursor-pointer"
                                                                    onClick={() => handleEditClick(rightViewLecture.id)}
                                                                >
                                                                    <img src={PencilEdit} alt="Edit" />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="content"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: unescapeHtml(rightViewLecture.description) || ''
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
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
                                                    id: editingLecture?.id || ''
                                                    // quizzes: editingLecture?.quizzes || [],
                                                    // quizzes: lectureQuizzes || [],
                                                }}
                                                validationSchema={validationSchema}
                                                onSubmit={handleSubmit}
                                            // onSubmit={(values) => {
                                            //     handleSubmit(values);
                                            //     setHasUnsavedChanges(false);
                                            // }}
                                            >
                                                {/* {({ isSubmitting, values, setFieldValue }) => ( */}
                                                {({ isSubmitting, handleSubmit, setFieldValue, values, dirty }) => {
                                                    useEffect(() => {
                                                        if (dirty) {
                                                            setHasUnsavedChanges(true);
                                                        } else {
                                                            setHasUnsavedChanges(false);
                                                        }

                                                        // Option 2: Deep compare values (optional, more accurate)
                                                        // setHasUnsavedChanges(!isEqual(values, initialFormValues));
                                                    }, [values, dirty]);

                                                    return (
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
                                                                        onNameChange={(newName) =>
                                                                            setFieldValue('name', newName)
                                                                        }
                                                                        resources={resources}
                                                                        setResources={setResources}
                                                                        setModalShow={setModalShow}
                                                                        setLabel={setLabel}
                                                                        setResourceFileUrl={setResourceFileUrl}
                                                                        setResourceUrl={setResourceUrl}
                                                                        setEditResource={setEditResource}
                                                                        setEditResourceID={setEditResourceID}
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
                                                            {showTranscriptEditor ? (
                                                                <div
                                                                    className={`res trans-res ${showTranscriptEditor ? 'showing-transcript' : ''}`}
                                                                >
                                                                    <h2 className="subhead">Add Transcript</h2>
                                                                    <div className="transc">
                                                                        <div className="drop-box"></div>
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
                                                                                    onClick={() =>
                                                                                        setShowTranscriptEditor(false)
                                                                                    }
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                ''
                                                            )}

                                                            {/* End Transcript Section  */}
                                                            <div className="mt-3 d-flex gap-3 flex-wrap tab-buttons  editor-buttons justify-content-between">
                                                                <div className="editor-button">
                                                                    <div className="addAdditionalOptions">
                                                                        <Dropdown onSelect={handleSelect}>
                                                                            <Dropdown.Toggle id="dropdown-basic">
                                                                                Add
                                                                            </Dropdown.Toggle>
                                                                            <Dropdown.Menu>
                                                                                <Dropdown.Item eventKey="add-resource">
                                                                                    Add Resource
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item eventKey="add-transcript" disabled={showTranscriptEditor === true}  >
                                                                                    Add Transcript{' '}
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item eventKey="add-quiz">
                                                                                    Add Quiz{' '}
                                                                                </Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                    </div>
                                                                </div>
                                                                <div className="gap-3 d-flex" style={{ flexWrap: 'wrap' }}>

                                                                    {isPublishing ? (
                                                                        <Spinner
                                                                            animation="border"
                                                                            size="sm"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (<>
                                                                        <div className="toggle-wrapper">
                                                                            <span className="toggle-label">
                                                                                {isPublished ? 'Published' : 'Draft'}
                                                                            </span>
                                                                            <div className="switch">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="switch2"
                                                                                    checked={isPublished}
                                                                                    onChange={toggleSwitch}
                                                                                />
                                                                                <label htmlFor="switch2"></label>
                                                                            </div>
                                                                        </div>
                                                                    </>)}
                                                                    <Button type="button" className="cancel-btn" onClick={() => { setIsEditing(false) }}>
                                                                        Cancel
                                                                    </Button>
                                                                    <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                                                                        {isSubmitting ? (
                                                                            <>
                                                                                <Spinner
                                                                                    as="span"
                                                                                    animation="border"
                                                                                    size="sm"
                                                                                    role="status"
                                                                                    aria-hidden="true"
                                                                                    className="me-2"
                                                                                />

                                                                            </>
                                                                        ) : (
                                                                            isEditing ? 'Update' : 'Update'
                                                                        )}
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
                                                                            <div
                                                                                className="course-right-header border-0"
                                                                                key={quiz.id}
                                                                            >
                                                                                <h2 className="subhead border-0">
                                                                                    {quiz.title}
                                                                                </h2>
                                                                                <div className="items-text d-flex gap-2">
                                                                                    <img
                                                                                        className="cursor-pointer"
                                                                                        src={PencilLine}
                                                                                        alt="Edit"
                                                                                        onClick={() =>
                                                                                            handleQuizPopupClick(quiz)
                                                                                        }
                                                                                    />
                                                                                    <img
                                                                                        className="cursor-pointer"
                                                                                        src={trashIconRed}
                                                                                        alt="Delete"
                                                                                        onClick={() =>
                                                                                            handleDeleteQuizClick(quiz.id)
                                                                                        }
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
                                                                    title="Save Your Lecture"
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
                                                    );
                                                }}
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
