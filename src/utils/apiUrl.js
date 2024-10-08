const BASE_URL = import.meta.env.VITE_API_URL;
const USER_API_BASE = `${BASE_URL}/api/user`;
const STUDENT_API_BASE = `${BASE_URL}/api/student`;
const COACH_API_BASE = `${BASE_URL}/api/coach`;
const MEDIA_API_BASE = `${BASE_URL}/api/media`;
const COURSE_API_BASE = `${BASE_URL}/api/course`;
const LECTURE_API_BASE = `${BASE_URL}/api/lecture`;
const PRODUCT_API_BASE = `${BASE_URL}/api/product`;
const DAILY_FINANCE_API_BASE = `${BASE_URL}/api/dailyFinance`;
const INVOICE_API_BASE = `${BASE_URL}/api/invoice`;
const EVENT_API_BASE = `${BASE_URL}/api/event`;
const DASHBOARD_API_BASE = `${BASE_URL}/api/dashboard`;
const CATEGORY_API_BASE = `${BASE_URL}/api/category`;

export const API_URL = {
    // User API
    GET_ALL_USERS: `${USER_API_BASE}/`,
    SEND_OTP_ON_EMAIL: `${USER_API_BASE}/send/otp/email`,
    VERIFY_OTP: `${USER_API_BASE}/verify-otp`,
    UPDATE_EMAIL_PASSWORD: `${USER_API_BASE}/update/password`,
    LOGIN_EMAIL: `${USER_API_BASE}/login/email`,
    UPDATE_USER: `${USER_API_BASE}/user/edit/:id`,
    UPDATE_PROFILE: `${USER_API_BASE}/profile`,
    DELETE_ACCOUNT: `${USER_API_BASE}/delete-account`,
    DELETE_USER: `${USER_API_BASE}/delete/:id`,
    DROP_COLLECTION: `${USER_API_BASE}/drop`,
    DECODE_TOKEN: `${USER_API_BASE}/token`,
    SET_COURSES_ROADMAP: `${USER_API_BASE}/set-courses-roadmap/:studentId`,
    GET_USER: `${USER_API_BASE}/:id`,

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
    GET_ALL_LECTURES: `${LECTURE_API_BASE}/`,

    // Products API
    UPLOAD_PRODUCTS_CSV: `${PRODUCT_API_BASE}/upload-csv`,
    GET_PRODUCT: `${PRODUCT_API_BASE}/:id`,
    GET_ALL_PRODUCTS: `${PRODUCT_API_BASE}/`,
    EXPORT_PRODUCTS: `${PRODUCT_API_BASE}/export`,

    // Daily Finances API
    UPLOAD_DAILY_FINANCES_CSV: `${DAILY_FINANCE_API_BASE}/upload-csv`,
    GET_DAILY_FINANCE: `${DAILY_FINANCE_API_BASE}/:id`,
    GET_ALL_DAILY_FINANCES: `${DAILY_FINANCE_API_BASE}/`,
    EXPORT_DAILY_FINANCES: `${DAILY_FINANCE_API_BASE}/export`,

    // Invoices API
    UPLOAD_INVOICES_CSV: `${INVOICE_API_BASE}/upload-csv`,
    GET_INVOICE: `${INVOICE_API_BASE}/:id`,
    GET_ALL_INVOICES: `${INVOICE_API_BASE}/`,
    EXPORT_INVOICES: `${INVOICE_API_BASE}/export`,

    // Events API
    AUTH: `${EVENT_API_BASE}/auth`,
    CALLBACK: `${EVENT_API_BASE}/callback`,
    CREATE_EVENT: `${EVENT_API_BASE}/create`,
    REQUEST_MEETING: `${EVENT_API_BASE}/meeting-request`,
    UPDATE_EVENT: `${EVENT_API_BASE}/update/:id`,
    GET_EVENT: `${EVENT_API_BASE}/:id`,
    GET_ALL_EVENTS: `${EVENT_API_BASE}/`,
    GET_CALENDAR_EVENTS: `${EVENT_API_BASE}/calendar-events`,
    GET_CALENDAR_EVENT_BY_ID: `${EVENT_API_BASE}/calendar/:id`,
    DELETE_EVENT: `${EVENT_API_BASE}/delete/:id`,
    GET_UPCOMING_EVENTS: `${EVENT_API_BASE}/upcoming-events`,
    GET_ALL_EVENTS_FOR_STUDENT: `${EVENT_API_BASE}/student/events`,
    GET_EVENT_BY_ID_FOR_STUDENT: `${EVENT_API_BASE}/student/events/:id`,

    // Dashboard API
    GET_ADMIN_CARD_DATA: `${DASHBOARD_API_BASE}/admin/cards`,
    GET_ADMIN_GRAPH_DATA: `${DASHBOARD_API_BASE}/admin/graphs`,
    GET_ADMIN_EVENTS_DATA: `${DASHBOARD_API_BASE}/admin/events`,
    GET_COACH_CARD_DATA: `${DASHBOARD_API_BASE}/coach/cards`,
    GET_COACH_GRAPH_DATA: `${DASHBOARD_API_BASE}/coach/graphs`,
    GET_COACH_EVENTS_DATA: `${DASHBOARD_API_BASE}/coach/events`,
    GET_STUDENT_CARD_DATA: `${DASHBOARD_API_BASE}/student/cards`,
    GET_STUDENT_SECOND_CARD_DATA: `${DASHBOARD_API_BASE}/student/cards-second`,
    GET_STUDENT_GRAPH_DATA: `${DASHBOARD_API_BASE}/student/graphs`,
    GET_STUDENT_EVENTS_DATA: `${DASHBOARD_API_BASE}/student/events`,

    // Categories API
    CREATE_CATEGORY: `${CATEGORY_API_BASE}/create`,
    UPDATE_CATEGORY: `${CATEGORY_API_BASE}/update/:id`,
    GET_CATEGORY: `${CATEGORY_API_BASE}/:id`,
    GET_ALL_CATEGORIES: `${CATEGORY_API_BASE}/`,
    DELETE_CATEGORY: `${CATEGORY_API_BASE}/delete/:id`
};
