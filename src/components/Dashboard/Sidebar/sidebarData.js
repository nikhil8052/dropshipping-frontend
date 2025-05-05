// Sidebar Icons
import dashboardLight from '@icons/home-white.svg';
import coaches from '@icons/coaches.svg';
import student from '@icons/student.svg';
import courses from '@icons/courses.svg';
import categories from '@icons/categories.svg';
import events from '@icons/events.svg';
import payment from '@icons/currency_exchange.svg';
import settings from '@icons/settings.svg';
import logout from '@icons/logout-light.svg';
import csv from '@icons/csv.svg';
import { roles } from '../../../utils/common';

export const sideBarItems = [
    {
        id: 1,
        name: 'Dashboard',
        iconLight: dashboardLight,
        linkTo: '/',
        access: roles
    },
    {
        id: 2,
        name: 'Coaches',
        iconLight: coaches, // Replace with your icon
        linkTo: `/${roles[0]}/coaches`,
        access: [roles[0]]
    },
    {
        id: 3,
        name: 'Students',
        iconLight: student, // Replace with your icon
        linkTo: '/students',
        access: [roles[0], roles[1]]
    },
    {
        id: 4,
        name: 'Courses',
        iconLight: courses, // Replace with,
        linkTo: '/courses',
        access: roles
    },
    {
        id: 5,
        name: 'Events',
        iconLight: events, // Replace with
        linkTo: '/events',
        access: roles
    },
    {
        id: 6,
        name: 'Payment Management',
        iconLight: payment, // Replace with
        linkTo: '/payment',
        access: [roles[0]]
    },
    {
        id: 7,
        name: 'Data',
        iconLight: csv,
        access: [roles[2]],
        linkTo: '/visualize-csv'
    },
    {
        id: 8,
        name: 'Settings',
        iconLight: settings, // Replace with
        linkTo: '/settings',
        access: roles
    },
    {
        id: 9,
        name: 'Logout',
        iconLight: logout, // Replace with
        access: roles
    }
];

export const adminSidebarItems = [
    {
        id: 1,
        name: 'Dashboard',
        iconLight: dashboardLight,
        linkTo: '/admin'
    },
    // {
    //     id: 2,
    //     name: 'Coaches',
    //     iconLight: coaches, // Replace with your icon
    //     linkTo: '/admin/coaches',
    //     pathCombinations: ['/admin/coaches', '/admin/coaches/new', '/admin/coaches/edit']
    // },
    // {
    //     id: 3,
    //     name: 'Students',
    //     iconLight: student, // Replace with your icon
    //     linkTo: '/admin/students',
    //     pathCombinations: ['/admin/visualize-csv']
    // },
    // {
    //     id: 4,
    //     name: 'Courses',
    //     iconLight: courses,
    //     linkTo: '/admin/courses',
    //     pathCombinations: [
    //         '/admin/courses',
    //         '/admin/courses/new',
    //         '/admin/courses/edit',
    //         '/admin/courses/details',
    //         '/admin/categories',
    //         '/admin/categories/new',
    //         '/admin/categories/edit'
    //     ],
    //     child: [
    //         {
    //             id: '4-1',
    //             name: 'All Courses',
    //             iconLight: courses,
    //             linkTo: '/admin/courses'
    //         },
    //         {
    //             id: '4-2',
    //             name: 'Category',
    //             iconLight: categories, // Replace with,
    //             linkTo: '/admin/category'
    //         }
    //     ]
    // },

    // {
    //     id: 4,
    //     name: 'Courses',
    //     iconLight: courses, // Replace with,
    //     linkTo: '/admin/courses',
    //     pathCombinations: ['/admin/courses', '/admin/courses/new', '/admin/courses/edit', '/admin/courses/details']
    // },
    // {
    //     id: 9,
    //     name: 'Courses Categories',
    //     iconLight: categories, // Replace with,
    //     linkTo: '/admin/categories',
    //     pathCombinations: ['/admin/categories', '/admin/categories/new', '/admin/categories/edit']

    // },
    // {
    //     id: 5,
    //     name: 'Events',
    //     iconLight: events, // Replace with
    //     linkTo: '/admin/events',
    //     pathCombinations: ['/admin/events', '/admin/events/new', '/admin/events/edit', '/admin/events/details']
    // },
    // {
    //     id: 6,
    //     name: 'Payment Management',
    //     iconLight: payment, // Replace with
    //     linkTo: '/admin/payment'
    // },
    // {
    //     id: 7,
    //     name: 'Settings',
    //     iconLight: settings, // Replace with
    //     linkTo: '/admin/settings'
    // },
    {
        id: 9,
        name: 'Courses',
        iconLight: courses,
        linkTo: '/admin/courses-supabase',
        pathCombinations: ['/admin/courses-supabase', '/admin/courses-supabase/new', '/admin/courses-supabase/edit', '/admin/courses-supabase/details']
    },
    {
        id: 10,
        name: 'Students',
        iconLight: student, 
        linkTo: '/admin/students-supabase',
        pathCombinations: ['/admin/students-supabase', '/admin/students-supabase/new', '/admin/students-supabase/edit', '/admin/students-supabase/details']
    },
    // {
    //     id: 8,
    //     name: 'Logout',
    //     iconLight: logout // Replace with
    // }
];
export const coachSidebarItems = [
    {
        id: 1,
        name: 'Dashboard',
        iconLight: dashboardLight,
        linkTo: '/coach'
    },
    {
        id: 2,
        name: 'Students',
        iconLight: student, // Replace with your icon
        linkTo: '/coach/students',
        pathCombinations: ['/coach/visualize-csv']
    },
    {
        id: 3,
        name: 'Courses',
        iconLight: courses, // Replace with
        linkTo: '/coach/courses',
        pathCombinations: [
            '/coach/courses',
            '/coach/courses/new',
            '/coach/courses/edit',
            '/coach/courses/details',
            '/coach/courses/all-students'
        ]
    },
    {
        id: 4,
        name: 'Events',
        iconLight: events, // Replace with
        linkTo: '/coach/events'
    },
    {
        id: 5,
        name: 'Settings',
        iconLight: settings, // Replace with
        linkTo: '/coach/settings'
    },
    {
        id: 6,
        name: 'Logout',
        iconLight: logout // Replace with
    }
];

export const studentSidebarItems = [
    // {
    //     id: 1,
    //     name: 'Dashboard',
    //     iconLight: dashboardLight, // Replace with your icon
    //     linkTo: '/student',
    //     pathCombinations: ['/student/request-meeting']
    // },
    // {
    //     id: 2,
    //     name: 'Courses',
    //     iconLight: courses, // Replace with your icon
    //     linkTo: '/student/courses',
    //     pathCombinations: ['/student/courses', '/student/courses/details']
    // },
    {
        id: 3,
        name: 'Courses',
        iconLight: courses, // Replace with your icon
        linkTo: '/student/courses-supabase',
        pathCombinations: ['/student/courses-supabase', '/student/courses-supabase/details']
    },
    // {
    //     id: 3,
    //     name: 'Events',
    //     iconLight: events, // Replace with your icon
    //     linkTo: '/student/events'
    // },
    // {
    //     id: 4,
    //     name: 'Data',
    //     iconLight: csv, // Replace with your icon (optional)
    //     linkTo: '/student/visualize-csv'
    // },
    // {
    //     id: 5,
    //     name: 'Settings',
    //     iconLight: settings, // Replace with your icon
    //     linkTo: '/student/settings'
    // },
    // {
    //     id: 6,
    //     name: 'Logout',
    //     iconLight: logout // Replace with your icon
    // }
];
