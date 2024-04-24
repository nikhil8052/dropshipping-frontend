import React, { Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { useSelector } from 'react-redux';

const PublicLayout = () => {
    const { isLoggedIn, userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            if (role === 'admin') navigate('/admin');
            else if (role === 'coach') navigate('/coach');
            else if (role === 'student') navigate('/student');
        } else navigate('/login');
    }, [navigate, isLoggedIn, role]);

    return (
        <React.Fragment>
            <Suspense fallback={<Loading centered />}>
                <Outlet />
            </Suspense>
        </React.Fragment>
    );
};

export default PublicLayout;
