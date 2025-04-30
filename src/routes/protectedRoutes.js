import { lazy } from 'react';
// Component Imports
const Dashboard = lazy(() => import('@pages/Dashboard/Dashboard/Dashboard'));
const StudentDashboard = lazy(() => import('@pages/Dashboard/Dashboard/StudentDashboard'));
const MeetingRequest = lazy(() => import('@pages/Dashboard/Dashboard/Meeting/MeetingRequest'));
const Coaches = lazy(() => import('@pages/Dashboard/Coaches/Coaches'));
const NewCoach = lazy(() => import('@pages/Dashboard/Coaches/NewCoach/NewCoach'));
const NewStudent = lazy(() => import('@pages/Dashboard/Students/NewStudent/NewStudent'));
const Students = lazy(() => import('@pages/Dashboard/Students/Students'));
const StudentsSupbase = lazy(() => import('@pages/Dashboard/Students-supabase/Students'));
const NewSupabaseStudent = lazy(() => import('@pages/Dashboard/Students-supabase/NewStudent/NewStudent'));
const EnrolledCourseDetail = lazy(() => import('@pages/Dashboard/Courses/EnrolledCourseDetail'));
const Courses = lazy(() => import('@pages/Dashboard/Courses/Courses'));
const CourseSupabase = lazy(() => import('@pages/Dashboard/Courses-supabase/Courses'));
const Categories = lazy(() => import('@pages/Dashboard/Categories/Categories'));
const Events = lazy(() => import('@pages/Dashboard/Events/Events'));
const EventsListing = lazy(() => import('@pages/Dashboard/Events/EventsListing/EventsListing'));
const EventPage = lazy(() => import('@pages/Dashboard/Events/EventPage/EventPage'));
const NewEvent = lazy(() => import('@pages/Dashboard/Events/NewEvent/NewEvent'));
const EventDetails = lazy(() => import('@pages/Dashboard/Events/EventDetails'));
const SingleEvent = lazy(() => import('@pages/Dashboard/Events/SingleEvent/SingleEvent'));
const Payment = lazy(() => import('@pages/Dashboard/Payments/Payments'));
const VisualizeCSV = lazy(() => import('@pages/Dashboard/VisualizeCsv/VisualizeCsv'));
const Roadmap = lazy(() => import('@pages/Dashboard/Roadmap/Roadmap'));
const Settings = lazy(() => import('@pages/Dashboard/Settings/Settings'));
const NewCourse = lazy(() => import('@pages/Dashboard/Courses/AddNewCourse'));
const NewCourseSupabase = lazy(() => import('@pages/Dashboard/Courses-supabase/AddCourse'));
const NewCategory = lazy(() => import('@pages/Dashboard/Categories/AddNewCategory'));
const CourseDetail = lazy(() => import('@pages/Dashboard/Courses/CourseDetail'));
const CourseDetailSupabase = lazy(() => import('@pages/Dashboard/Courses-supabase/CourseDetail'));
const AllStudents = lazy(() => import('@pages/Dashboard/Courses/AllStudents'));
const AllStudentsSupabase = lazy(() => import('@pages/Dashboard/Courses-supabase/AllStudents'));
const ViewProgress = lazy(() => import('@pages/Dashboard/Courses/ViewProgress'));
const CallBack = lazy(() => import('@pages/Auth/Callback'));

export const adminRoutes = [
    {
        index: true,
        exact: true,
        name: 'Dashboard',
        Component: Dashboard,
        access: 'ADMIN'
    },
    {
        path: 'coaches',
        exact: true,
        name: 'Coaches',
        Component: Coaches,
        access: 'ADMIN'
    },
    {
        path: 'coaches/new',
        exact: true,
        name: 'Coaches',
        Component: NewCoach,
        access: 'ADMIN'
    },
    {
        path: 'coaches/edit',
        exact: true,
        name: 'Coaches',
        Component: NewCoach,
        access: 'ADMIN'
    },
    {
        path: 'students',
        exact: true,
        name: 'Students',
        Component: Students,
        access: 'ADMIN'
    },
    {
        path: 'students-supabase',
        exact: true,
        name: 'Students',
        Component: StudentsSupbase,
        access: 'ADMIN'
    },
    {
        path: 'students/new',
        exact: true,
        name: 'Students',
        Component: NewStudent,
        access: 'ADMIN'
    },
    {
        path: 'students/edit',
        exact: true,
        name: 'Students',
        Component: NewStudent,
        access: 'ADMIN'
    },
    {
        path: 'students-supabase/new',
        exact: true,
        name: 'Students',
        Component: NewSupabaseStudent,
        access: 'ADMIN'
    },
    {
        path: 'students-supabase/edit',
        exact: true,
        name: 'Students',
        Component: NewSupabaseStudent,
        access: 'ADMIN'
    },

    // FOR CATEGORY Categories

    {
        path: 'category',
        exact: true,
        name: 'Category',
        Component: Categories,
        access: 'ADMIN'
    },
    {
        path: 'category/new',
        exact: true,
        name: 'Category',
        Component: NewCategory,
        access: 'ADMIN'
    },
    {
        path: 'category/edit',
        exact: true,
        name: 'Category',
        Component: NewCategory,
        access: 'ADMIN'
    },
    {
        path: 'courses',
        exact: true,
        name: 'Courses',
        Component: Courses,
        access: 'ADMIN'
    },
    {
        path: 'courses/new',
        exact: true,
        name: 'Courses',
        Component: NewCourse,
        access: 'ADMIN'
    },
    {
        path: 'courses/edit',
        exact: true,
        name: 'Courses',
        Component: NewCourse,
        access: 'ADMIN'
    },
    {
        path: 'courses/details/:name?/:lec_name?',
        exact: true,
        name: 'Courses',
        Component: CourseDetail,
        access: 'ADMIN'
    },
    {
        path: 'courses/all-students',
        exact: true,
        name: 'Courses',
        Component: AllStudents,
        access: 'ADMIN'
    },
    {
        path: 'courses/view-progress',
        exact: true,
        name: 'Courses',
        Component: ViewProgress,
        access: 'ADMIN'
    },
    // course-supabase
    {
        path: 'courses-supabase',
        exact: true,
        name: 'Courses',
        Component: CourseSupabase,
        access: 'ADMIN'
    },
    {
        path: 'courses-supabase/new',
        exact: true,
        name: 'Courses',
        Component: NewCourseSupabase,
        access: 'ADMIN'
    },
    {
        path: 'courses-supabase/edit',
        exact: true,
        name: 'Courses',
        Component: NewCourseSupabase,
        access: 'ADMIN'
    },
    {
        path: 'courses-supabase/details/:name?/:lec_name?',
        exact: true,
        name: 'Courses',
        Component: CourseDetailSupabase,
        access: 'ADMIN'
    },
    {
        path: 'courses-supabase/all-students',
        exact: true,
        name: 'Courses',
        Component: AllStudentsSupabase,
        access: 'ADMIN'
    },
    {
        path: 'courses-supabase/view-progress',
        exact: true,
        name: 'Courses',
        Component: ViewProgress,
        access: 'ADMIN'
    },
    // course-supabase end
    {
        path: 'events',
        exact: true,
        name: 'Events',
        Component: Events,
        access: 'ADMIN'
    },
    {
        path: 'events/new',
        exact: true,
        name: 'Events',
        Component: NewEvent,
        access: 'ADMIN'
    },
    {
        path: 'events/edit',
        exact: true,
        name: 'Events',
        Component: NewEvent,
        access: 'ADMIN'
    },
    {
        path: 'events/details',
        exact: true,
        name: 'Events',
        Component: EventDetails,
        access: 'ADMIN'
    },
    {
        path: 'payment',
        exact: true,
        name: 'Payment Management',
        Component: Payment,
        access: 'ADMIN'
    },
    {
        path: 'settings',
        exact: true,
        name: 'Settings',
        Component: Settings,
        access: 'ADMIN'
    },
    {
        path: 'visualize-csv',
        exact: true,
        name: 'Data',
        Component: VisualizeCSV,
        access: 'ADMIN'
    },
    {
        path: 'events/detail',
        exact: true,
        name: 'Events',
        Component: SingleEvent,
        access: 'ADMIN'
    },
    {
        path: 'redirect/',
        exact: true,
        name: 'EventsCallback',
        Component: CallBack,
        access: 'ADMIN'
    }
];
export const coachesRoutes = [
    {
        index: true,
        exact: true,
        name: 'Dashboard',
        Component: Dashboard,
        access: 'COACH'
    },
    {
        path: 'students',
        exact: true,
        name: 'Students',
        Component: Students,
        access: 'COACH'
    },
    {
        path: 'courses',
        exact: true,
        name: 'Courses',
        Component: Courses,
        access: 'COACH'
    },
    {
        path: 'courses/new',
        exact: true,
        name: 'Courses',
        Component: NewCourse,
        access: 'COACH'
    },
    {
        path: 'courses/edit',
        exact: true,
        name: 'Courses',
        Component: NewCourse,
        access: 'COACH'
    },
    {
        path: 'courses/details',
        exact: true,
        name: 'Courses',
        Component: CourseDetail,
        access: 'COACH'
    },
    {
        path: 'courses/all-students',
        exact: true,
        name: 'Courses',
        Component: AllStudents,
        access: 'COACH'
    },
    {
        path: 'students/edit',
        exact: true,
        name: 'Students',
        Component: NewStudent,
        access: 'COACH'
    },
    {
        path: 'students/new',
        exact: true,
        name: 'Students',
        Component: NewStudent,
        access: 'COACH'
    },
    {
        path: 'courses/view-progress',
        exact: true,
        name: 'Courses',
        Component: ViewProgress,
        access: 'COACH'
    },
    {
        path: 'events',
        exact: true,
        name: 'Events',
        Component: Events,
        access: 'COACH'
    },
    {
        path: 'settings',
        exact: true,
        name: 'Settings',
        Component: Settings,
        access: 'COACH'
    },
    {
        path: 'events/new',
        exact: true,
        name: 'Events',
        Component: NewEvent,
        access: 'COACH'
    },
    {
        path: 'events/edit',
        exact: true,
        name: 'Events',
        Component: NewEvent,
        access: 'COACH'
    },
    {
        path: 'events/details',
        exact: true,
        name: 'Events',
        Component: EventDetails,
        access: 'COACH'
    },
    {
        path: 'visualize-csv',
        exact: true,
        name: 'Data',
        Component: VisualizeCSV,
        access: 'COACH'
    },
    {
        path: 'events/detail',
        exact: true,
        name: 'Events',
        Component: SingleEvent,
        access: 'COACH'
    },
    {
        path: 'redirect/',
        exact: true,
        name: 'EventsCallback',
        Component: CallBack,
        access: 'COACH'
    }
];

export const studentRoutes = [
    {
        index: true,
        exact: true,
        name: 'Dashboard',
        Component: StudentDashboard,
        access: 'STUDENT'
    },
    {
        path: 'courses',
        exact: true,
        name: 'Courses',
        Component: Courses,
        access: 'STUDENT'
    },
    {
        path: 'request-meeting',
        exact: true,
        name: 'Dashboard',
        Component: MeetingRequest,
        access: 'STUDENT'
    },
    {
        path: 'courses/details',
        exact: true,
        name: 'Courses',
        Component: CourseDetail,
        access: 'STUDENT'
    },
    {
        path: 'courses/enrolled-course/:name?/:lec_name?',
        exact: true,
        name: 'Courses',
        Component: EnrolledCourseDetail,
        access: 'STUDENT'
    },
    {
        path: 'events',
        exact: true,
        name: 'Events',
        Component: EventPage,
        access: 'STUDENT'
    },
    {
        path: 'events/listing',
        exact: true,
        name: 'Events',
        Component: EventsListing,
        access: 'STUDENT'
    },
    {
        path: 'events/detail',
        exact: true,
        name: 'Events',
        Component: SingleEvent,
        access: 'STUDENT'
    },
    {
        path: 'visualize-csv',
        exact: true,
        name: 'Data',
        Component: VisualizeCSV,
        access: 'STUDENT'
    },
    {
        path: 'roadmap',
        exact: true,
        name: 'Roadmap',
        Component: Roadmap,
        access: 'STUDENT'
    },
    {
        path: 'settings',
        exact: true,
        name: 'Settings',
        Component: Settings,
        access: 'STUDENT'
    },
    {
        path: 'redirect/',
        exact: true,
        name: 'EventsCallback',
        Component: CallBack,
        access: 'STUDENT'
    }
];
