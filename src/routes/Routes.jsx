import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import CoachLayout from '@layout/CoachLayout/CoachLayout';
import StudentLayout from '@layout/StudentLayout/StudentLayout';
import AdminLayout from '@layout/AdminLayout/AdminLayout';
import DashboardLayout from '@layout/DashboardLayout/DashboardLayout';
import PublicLayout from '@layout/PublicLayout/PublicLayout';
import { routes } from './index.js';
import { useSelector } from 'react-redux';
import { roles } from '../utils/common.js';

const Home = lazy(() => import('@pages/Home/Home'));
const Login = lazy(() => import('@pages/Auth/Login'));
const SignUp = lazy(() => import('@pages/Auth/SignUp'));
const Listing = lazy(() => import('@pages/Listing/Listing'));
const ListingDetails = lazy(() => import('@pages/ListingDetails/ListingDetails'));
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));

const MainRoutes = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const role = userInfo?.role;

    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route path="login" exact element={<Login />} />
                <Route path="signup" exact element={<SignUp />} />
            </Route>
            {/* protected layout */}
            {/* Map the routes array w.r.t roles */}

            <Route path="/admin" element={<AdminLayout />}>
                {routes(role).map(({ Component, exact, path, index }, keyIndex) => (
                    <Route key={keyIndex} path={path} index={index} exact={exact} element={<Component />} />
                ))}
            </Route>
            <Route path="/coach" element={<CoachLayout />}>
                {routes(role).map(({ Component, exact, path, index }, keyIndex) => (
                    <Route key={keyIndex} path={path} index={index} exact={exact} element={<Component />} />
                ))}
            </Route>
            <Route path="/student" element={<StudentLayout />}>
                {routes(role).map(({ Component, exact, path, index }, keyIndex) => (
                    <Route key={keyIndex} path={path} index={index} exact={exact} element={<Component />} />
                ))}
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default MainRoutes;
