import { lazy } from 'react';
import { roles } from '../../utils/common';

const Login = lazy(() => import('@pages/Auth/Login'));
const Signup = lazy(() => import('@pages/Auth/SignUp'));

const publicRoutes = [
    {
        path: 'login',
        exact: true,
        name: 'Login',
        Component: Login,
        access: [roles[3]]
    },
    {
        path: 'register',
        exact: true,
        name: 'Register',
        Component: Signup,
        access: [roles[3]]
    }
];
export default publicRoutes;
