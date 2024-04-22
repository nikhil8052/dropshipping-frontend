import homeLight from '@icons/home-light.svg';
import homeDark from '@icons/home-dark.svg';
import groupLight from '@icons/group-light.svg';
import groupDark from '@icons/group-dark.svg';
import productLight from '@icons/product-light.svg';
import productDark from '@icons/product-dark.svg';
import logoutLight from '@icons/logout-light.svg';
import logoutDark from '@icons/logout-dark.svg';
// Sidebar Icons
import dashboardLight from '@icons/home-white.svg';
import coaches from '@icons/coaches.svg';
import student from '@icons/student.svg';
import courses from '@icons/courses.svg';
import events from '@icons/events.svg';
import payment from '@icons/currency_exchange.svg';
import settings from '@icons/settings.svg';
import logout from '@icons/logout-light.svg';
import csv from '@icons/csv.svg';

export const sideBarItems = [
    {
        id: 1,
        name: 'Home',
        iconLight: homeLight,
        iconDark: homeDark,
        linkTo: '/'
    },
    {
        id: 2,
        name: 'Products',
        iconLight: productLight,
        iconDark: productDark,
        linkTo: '/products'
    },
    {
        id: 3,
        name: 'Group Items',
        iconLight: groupLight,
        iconDark: groupDark,
        child: [
            {
                id: 4,
                name: 'Item1',
                iconLight: homeLight,
                iconDark: homeDark,
                linkTo: '/groups/1'
            },
            {
                id: 5,
                name: 'Item2',
                iconLight: productLight,
                iconDark: productDark,
                linkTo: '/groups/2'
            }
        ]
    },
    {
        id: 7,
        name: 'Logout',
        iconLight: logoutLight,
        iconDark: logoutDark
    }
];

export const adminSidebarItems = [
    {
        id: 1,
        name: 'Dashboard',
        iconLight: dashboardLight,
        linkTo: '/admin'
    },
    {
        id: 2,
        name: 'Coaches',
        iconLight: coaches, // Replace with your icon
        linkTo: '/admin/users'
    },
    {
        id: 3,
        name: 'Students',
        iconLight: student, // Replace with your icon
        linkTo: '/admin/courses'
    },
    {
        id: 4,
        name: 'Courses',
        iconLight: courses, // Replace with,
        linkTo: '/admin/courses'
    },
    {
        id: 5,
        name: 'Events',
        iconLight: events, // Replace with
        linkTo: '/admin/events'
    },
    {
        id: 6,
        name: 'Payment Management',
        iconLight: payment, // Replace with
        linkTo: '/admin/payment'
    },
    {
        id: 7,
        name: 'Settings',
        iconLight: settings, // Replace with
        linkTo: '/admin/settings'
    },
    {
        id: 8,
        name: 'Logout',
        iconLight: logout // Replace with
    }
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
        linkTo: '/coach/courses'
    },
    {
        id: 3,
        name: 'Courses',
        iconLight: courses, // Replace with
        linkTo: '/coach/courses'
    },
    {
        id: 4,
        name: 'Events',
        iconLight: events // Replace with
    },
    {
        id: 5,
        name: 'Settings',
        iconLight: settings // Replace with
    },
    {
        id: 6,
        name: 'Logout',
        iconLight: logout // Replace with
    }
];

export const studentSidebarItems = [
    {
        id: 1,
        name: 'Dashboard',
        iconLight: dashboardLight, // Replace with your icon
        linkTo: '/student'
    },
    {
        id: 2,
        name: 'Courses',
        iconLight: courses, // Replace with your icon
        linkTo: '/student/courses'
    },
    {
        id: 3,
        name: 'Events',
        iconLight: events, // Replace with your icon
        linkTo: '/student/events'
    },
    {
        id: 4,
        name: 'Visualize CSV',
        iconLight: csv, // Replace with your icon (optional)
        linkTo: '/student/visualize-csv'
    },
    {
        id: 5,
        name: 'Settings',
        iconLight: settings, // Replace with your icon
        linkTo: '/student/settings'
    },
    {
        id: 6,
        name: 'Logout',
        iconLight: logout // Replace with your icon
    }
];
