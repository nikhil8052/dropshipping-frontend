const adminRoutes = [
    {
        path: '/admin/dashboard',
        exact: true,
        name: 'Admin Dashboard',
        component: AdminDashboard // Replace with your admin dashboard component
    },
    {
        path: '/admin/users',
        exact: true,
        name: 'Manage Users',
        component: Users // Replace with your user management component
    },
    {
        path: '/admin/courses',
        exact: true,
        name: 'Manage Courses',
        component: Courses // Replace with your course management component
    },
    {
        path: '/admin/courses/:courseId', // Dynamic route for course details
        exact: true,
        name: 'Course Details',
        component: CourseDetails // Replace with your course details component
    },
    {
        path: '/admin/coaches',
        exact: true,
        name: 'Manage Coaches',
        component: Coaches // Replace with your coach management component
    },
    {
        path: '/admin/reports',
        exact: true,
        name: 'Reports',
        component: Reports // Replace with your reports component
    }
    // ... other admin-specific routes ...
];
