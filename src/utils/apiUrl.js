const BASE_URL = import.meta.env.VITE_API_URL;
const STUDENT_API_BASE = `${BASE_URL}/api/student`;
const COACH_API_BASE = `${BASE_URL}/api/coach`;
const MEDIA_API_BASE = `${BASE_URL}/api/media`;
const COURSE_API_BASE = `${BASE_URL}/api/course`;
const LECTURE_API_BASE = `${BASE_URL}/api/lecture`;

export const API_URL = {
    // Students API
    CREATE_STUDENT: `${STUDENT_API_BASE}/create`,
    UPDATE_STUDENT: `${STUDENT_API_BASE}/update/:id`,
    GET_STUDENT: `${STUDENT_API_BASE}/:id`,
    GET_ALL_STUDENTS: `${STUDENT_API_BASE}/`,
    DELETE_STUDENT: `${STUDENT_API_BASE}/delete/:id`,
    DEACTIVATE_STUDENT: `${STUDENT_API_BASE}/deactivate/:id`,
    ACTIVATE_STUDENT: `${STUDENT_API_BASE}/activate/:id`,
    GET_ALL_STUDENTS_HAVE_NO_COACH: `${STUDENT_API_BASE}/no-coach`,

    // Coaches API
    CREATE_COACH: `${COACH_API_BASE}/create`,
    UPDATE_COACH: `${COACH_API_BASE}/update/:id`,
    GET_COACH: `${COACH_API_BASE}/:id`,
    GET_ALL_COACHES: `${COACH_API_BASE}/`,
    DELETE_COACH: `${COACH_API_BASE}/delete/:id`,
    DEACTIVATE_COACH: `${COACH_API_BASE}/deactivate/:id`,
    ACTIVATE_COACH: `${COACH_API_BASE}/activate/:id`,

    // Media API
    UPLOAD_MEDIA: `${MEDIA_API_BASE}/upload`,
    DELETE_MEDIA: `${MEDIA_API_BASE}/delete`,

    // Courses API
    CREATE_COURSE: `${COURSE_API_BASE}/create`,
    UPDATE_COURSE: `${COURSE_API_BASE}/update/:id`,
    GET_COURSE: `${COURSE_API_BASE}/:id`,
    GET_ALL_COURSES: `${COURSE_API_BASE}/`,
    DELETE_COURSE: `${COURSE_API_BASE}/delete/:id`,
    ARCHIVE_COURSE: `${COURSE_API_BASE}/archive/:id`,
    UNARCHIVE_COURSE: `${COURSE_API_BASE}/unarchive/:id`,
    GET_ALL_STUDENTS_IN_COURSE: `${COURSE_API_BASE}/students/:courseId`,
    GET_STUDENT_PROGRESS: `${COURSE_API_BASE}/progress/:courseId/:studentId`,
    GET_ENROLLED_COURSES: `${COURSE_API_BASE}/enrolled`,
    GET_COURSE_PREVIEW: `${COURSE_API_BASE}/preview/:id`,
    PUBLISH_COURSE: `${COURSE_API_BASE}/publish/:id`,

    // Lectures API
    ADD_LECTURE: `${LECTURE_API_BASE}/add`,
    UPDATE_LECTURE: `${LECTURE_API_BASE}/update/:id`,
    DELETE_LECTURE: `${LECTURE_API_BASE}/delete/:id`,
    MARK_LECTURE_COMPLETED: `${LECTURE_API_BASE}/mark-completed/:id`,
    PERFORM_QUIZ: `${LECTURE_API_BASE}/quiz/:id`,
    GET_LECTURE: `${LECTURE_API_BASE}/:id`,
    GET_ALL_LECTURES: `${LECTURE_API_BASE}/`
};
