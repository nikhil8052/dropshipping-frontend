const BASE_URL = import.meta.env.VITE_API_URL;
const STUDENT_API_BASE = `${BASE_URL}/api/student`;
const COACH_API_BASE = `${BASE_URL}/api/coach`;
const MEDIA_API_BASE = `${BASE_URL}/api/media`;

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
    DELETE_MEDIA: `${MEDIA_API_BASE}/delete`
};
