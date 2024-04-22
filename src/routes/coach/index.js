const coachRoutes = [
    {
        path: '/coach/dashboard',
        exact: true,
        name: 'Coach Dashboard',
        component: CoachDashboard // Replace with your coach dashboard component
    },
    {
        path: '/coach/students',
        exact: true,
        name: 'My Students',
        component: Students // Replace with your student list component (for assigned students)
    },
    {
        path: '/coach/courses/:courseId', // Dynamic route for course details
        exact: true,
        name: 'Course Details',
        component: CourseDetails // Replace with your course details component (limited view)
    },
    {
        path: '/coach/events',
        exact: true,
        name: 'Events',
        component: Events // Replace with your events list component (relevant events)
    },
    {
        path: '/coach/chat',
        exact: true,
        name: 'Chat',
        component: Chat // Replace with your chat functionality with students
    }
    // ... other coach-specific routes ...
];
