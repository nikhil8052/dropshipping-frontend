const studentRoutes = [
    {
        path: '/student/dashboard',
        exact: true,
        name: 'Student Dashboard'
        // component: StudentDashboard // Replace with your student dashboard component
    },
    {
        path: '/student/analytics',
        exact: true,
        name: 'Analytics Dashboard'
        // component: AnalyticsDashboard // Replace with your analytics dashboard component
    },
    {
        path: '/student/courses',
        exact: true,
        name: 'Courses'
        // component: Courses // Replace with your courses list component
    },
    {
        path: '/student/courses/:courseId', // Dynamic route for course details
        exact: true,
        name: 'Course Details'
        // component: CourseDetails // Replace with your course details component
    },
    {
        path: '/student/events',
        exact: true,
        name: 'Events'
        // component: Events // Replace with your events list component
    },
    {
        path: '/student/events/:eventId', // Dynamic route for event details
        exact: true,
        name: 'Event Details'
        // component: EventDetails // Replace with your event details component
    },
    {
        path: '/student/visualize-csv',
        exact: true,
        name: 'Visualize CSV'
        // component: VisualizeCSV // Replace with your visualize CSV component
    },
    {
        path: '/student/settings',
        exact: true,
        name: 'Settings'
        // component: Settings // Replace with your settings component
    }
];
