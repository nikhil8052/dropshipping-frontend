import { lazy } from 'react';
// Component Imports
const Dashboard = lazy(() => import('@pages/Dashboard/Dashboard/Dashboard'));
const Coaches = lazy(() => import('@pages/Dashboard/Coaches/Coaches'));
const NewCoach = lazy(() => import('@pages/Dashboard/Coaches/NewCoach/NewCoach'));
const Students = lazy(() => import('@pages/Dashboard/Students/Students'));
const Courses = lazy(() => import('@pages/Dashboard/Courses/Courses'));
const Events = lazy(() => import('@pages/Dashboard/Events/Events'));
const Payment = lazy(() => import('@pages/Dashboard/Payments/Payments'));
const VisualizeCSV = lazy(() => import('@pages/Dashboard/VisualizeCsv/VisualizeCsv'));
const Settings = lazy(() => import('@pages/Dashboard/Settings/Settings'));

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
        path: 'courses',
        exact: true,
        name: 'Courses',
        Component: Courses,
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
        Component: Dashboard,
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
        Component: Events,
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
