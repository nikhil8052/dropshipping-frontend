import { lazy } from 'react';

const Login = lazy(() => import('@pages/Auth/Login'));
const Signup = lazy(() => import('@pages/Auth/SignUp'));

const ForgotPassword = lazy(() => import('@pages/Auth/ForgotPassword'));
const VerificationCode = lazy(() => import('@pages/Auth/VerificationCode'));
const ResetPassword = lazy(() => import('@pages/Auth/ResetPassword'));
const CallBack = lazy(() => import('@pages/Auth/Callback'));

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
    },
    {
        path: 'forgot-password',
        exact: true,
        name: 'ForgotPassword',
        Component: ForgotPassword,
        access: 'public'
    },
    {
        path: 'verification-code',
        exact: true,
        name: 'VerificationCode',
        Component: VerificationCode,
        access: 'public'
    },
    {
        path: 'reset-password',
        exact: true,
        name: 'ResetPassword',
        Component: ResetPassword,
        access: 'public'
    },
    {
        path: 'redirect/',
        exact: true,
        name: 'EventsCallback',
        Component: CallBack,
        access: 'public'
    }
];
export default publicRoutes;
