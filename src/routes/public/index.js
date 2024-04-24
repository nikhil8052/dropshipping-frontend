import { lazy } from 'react';

const Login = lazy(() => import('@pages/Auth/Login'));
const Signup = lazy(() => import('@pages/Auth/SignUp'));

const publicRoutes = [
    {
        path: 'login',
        exact: true,
        name: 'Login',
        Component: Login,
        access: 'public'
    },
    {
        path: 'signup',
        exact: true,
        name: 'Register',
        Component: Signup,
        access: 'public'
    }
];
export default publicRoutes;
