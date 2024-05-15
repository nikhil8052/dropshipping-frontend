import { lazy } from 'react';
// Component Imports
const Dashboard = lazy(() => import('@pages/Dashboard/Dashboard/Dashboard'));
const StudentDashboard = lazy(() => import('@pages/Dashboard/Dashboard/StudentDashboard'));
const Coaches = lazy(() => import('@pages/Dashboard/Coaches/Coaches'));
const NewCoach = lazy(() => import('@pages/Dashboard/Coaches/NewCoach/NewCoach'));
const NewStudent = lazy(() => import('@pages/Dashboard/Students/NewStudent/NewStudent'));
const Students = lazy(() => import('@pages/Dashboard/Students/Students'));
const Courses = lazy(() => import('@pages/Dashboard/Courses/Courses'));
const Events = lazy(() => import('@pages/Dashboard/Events/Events'));
const EventsListing = lazy(() => import('@pages/Dashboard/Events/EventsListing/EventsListing'));
const NewEvent = lazy(() => import('@pages/Dashboard/Events/NewEvent/NewEvent'));
const EventDetails = lazy(() => import('@pages/Dashboard/Events/EventDetails'));
const Payment = lazy(() => import('@pages/Dashboard/Payments/Payments'));
const VisualizeCSV = lazy(() => import('@pages/Dashboard/VisualizeCsv/VisualizeCsv'));
const Settings = lazy(() => import('@pages/Dashboard/Settings/Settings'));
const NewCourse = lazy(() => import('@pages/Dashboard/Courses/AddNewCourse'));
const CourseDetail = lazy(() => import('@pages/Dashboard/Courses/CourseDetail'));
const AllStudents = lazy(() => import('@pages/Dashboard/Courses/AllStudents'));
const ViewProgress = lazy(() => import('@pages/Dashboard/Courses/ViewProgress'));

export const adminRoutes = [
    {
        index: true,
        exact: true,
        name: 'Dashboard',
        Component: Dashboard,
        access: 'admin'
    },
    {
        path: 'coaches',
        exact: true,
        name: 'Coaches',
        Component: Coaches,
        access: 'admin'
    },
    {
        path: 'coaches/new',
        exact: true,
        name: 'Coaches',
        Component: NewCoach,
        access: 'admin'
    },
    {
        path: 'coaches/edit',
        exact: true,
        name: 'Coaches',
        Component: NewCoach,
        access: 'admin'
    },
    {
        path: 'students',
        exact: true,
        name: 'Students',
        Component: Students,
        access: 'admin'
    },
    {
        path: 'students/new',
        exact: true,
        name: 'Students',
        Component: NewStudent,
        access: 'admin'
    },
    {
        path: 'students/edit',
        exact: true,
        name: 'Students',
        Component: NewStudent,
        access: 'admin'
    },
    {
        path: 'courses',
        exact: true,
        name: 'Courses',
        Component: Courses,
        access: 'admin'
    },
    {
        path: 'courses/new',
        exact: true,
        name: 'Courses',
        Component: NewCourse,
        access: 'admin'
    },
    {
        path: 'courses/details',
        exact: true,
        name: 'Courses',
        Component: CourseDetail,
        access: 'admin'
    },
    {
        path: 'courses/all-students',
        exact: true,
        name: 'Courses',
        Component: AllStudents,
        access: 'admin'
    },
    {
        path: 'courses/view-progress',
        exact: true,
        name: 'Courses',
        Component: ViewProgress,
        access: 'admin'
    },
    {
        path: 'events',
        exact: true,
        name: 'Events',
        Component: Events,
        access: 'admin'
    },
    {
        path: 'events/new',
        exact: true,
        name: 'Events',
        Component: NewEvent,
        access: 'admin'
    },
    {
        path: 'events/edit',
        exact: true,
        name: 'Events',
        Component: NewEvent,
        access: 'admin'
    },
    {
        path: 'events/details',
        exact: true,
        name: 'Events',
        Component: EventDetails,
        access: 'admin'
    },
    {
        path: 'payment',
        exact: true,
        name: 'Payment Management',
        Component: Payment,
        access: 'admin'
    },
    {
        path: 'settings',
        exact: true,
        name: 'Settings',
        Component: Settings,
        access: 'admin'
    }
];
export const coachesRoutes = [
    {
        index: true,
        exact: true,
        name: 'Dashboard',
        Component: Dashboard,
        access: 'coach'
    },
    {
        path: 'students',
        exact: true,
        name: 'Students',
        Component: Students,
        access: 'coach'
    },
    {
        path: 'courses',
        exact: true,
        name: 'Courses',
        Component: Courses,
        access: 'coach'
    },
    {
        path: 'courses/new',
        exact: true,
        name: 'Courses',
        Component: NewCourse,
        access: 'coach'
    },
    {
        path: 'courses/details',
        exact: true,
        name: 'Courses',
        Component: CourseDetail,
        access: 'coach'
    },
    {
        path: 'courses/all-students',
        exact: true,
        name: 'Courses',
        Component: AllStudents,
        access: 'coach'
    },
    {
        path: 'courses/view-progress',
        exact: true,
        name: 'Courses',
        Component: ViewProgress,
        access: 'coach'
    },
    {
        path: 'events',
        exact: true,
        name: 'Events',
        Component: Events,
        access: 'coach'
    },
    {
        path: 'settings',
        exact: true,
        name: 'Settings',
        Component: Settings,
        access: 'coach'
    }
];

export const studentRoutes = [
    {
        index: true,
        exact: true,
        name: 'Dashboard',
        Component: StudentDashboard,
        access: 'student'
    },
    {
        path: 'courses',
        exact: true,
        name: 'Courses',
        Component: Courses,
        access: 'student'
    },
    {
        path: 'events',
        exact: true,
        name: 'Events',
        Component: EventsListing,
        access: 'student'
    },
    {
        path: 'visualize-csv',
        exact: true,
        name: 'Visualize CSV',
        Component: VisualizeCSV,
        access: 'student'
    },
    {
        path: 'settings',
        exact: true,
        name: 'Settings',
        Component: Settings,
        access: 'student'
    }
];
