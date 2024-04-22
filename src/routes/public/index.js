const publicRoutes = [
  {
    path: '/', // Landing page
    exact: true,
    name: 'Home',
    component: Home, // Replace with your home page component
  },
  {
    path: '/about',
    exact: true,
    name: 'About Us',
    component: About, // Replace with your about us page component
  },
  {
    path: '/contact',
    exact: true,
    name: 'Contact Us',
    component: Contact, // Replace with your contact us page component
  },
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: Login, // Replace with your login page component
  },
  {
    path: '/register',
    exact: true,
    name: 'Register',
    component: Register, // Replace with your register page component
  },
  // ... other public routes ...
];
