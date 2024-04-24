import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import CoachLayout from '@layout/CoachLayout/CoachLayout';
import StudentLayout from '@layout/StudentLayout/StudentLayout';
import AdminLayout from '@layout/AdminLayout/AdminLayout';
import PublicLayout from '@layout/PublicLayout/PublicLayout';
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));
import { adminRoutes, coachesRoutes, studentRoutes } from './protectedRoutes.js';
import publicRoutes from './public/index.js';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                {publicRoutes.map(({ Component, exact, path, index }, keyIndex) => (
                    <Route key={keyIndex} path={path} index={index} exact={exact} element={<Component />} />
                ))}
            </Route>
            {/* protected layout */}

            <Route path="/admin" element={<AdminLayout />}>
                {adminRoutes.map(({ Component, exact, path, index }, keyIndex) => (
                    <Route key={keyIndex} path={path} index={index} exact={exact} element={<Component />} />
                ))}
            </Route>
            <Route path="/coach" element={<CoachLayout />}>
                {coachesRoutes.map(({ Component, exact, path, index }, keyIndex) => (
                    <Route key={keyIndex} path={path} index={index} exact={exact} element={<Component />} />
                ))}
            </Route>
            <Route path="/student" element={<StudentLayout />}>
                {studentRoutes.map(({ Component, exact, path, index }, keyIndex) => (
                    <Route key={keyIndex} path={path} index={index} exact={exact} element={<Component />} />
                ))}
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default MainRoutes;
