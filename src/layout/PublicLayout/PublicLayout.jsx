import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { useSelector } from 'react-redux';

const PublicLayout = () => {
    const { isLoggedIn, userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const navigate = useNavigate();
    const location = useLocation();
    const isRedirectUrl = location.pathname.includes('redirect');

    useEffect(() => {
        if (isLoggedIn && !isRedirectUrl) {
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'COACH') navigate('/coach');
            else if (role === 'STUDENT') navigate('/student');
        } else if (isLoggedIn && isRedirectUrl) {
            // also set the state if any in the url
            navigate(location.pathname + location.search);
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, role, isRedirectUrl]);

    return (
<div className='layout_public'>
<React.Fragment>
            <Suspense fallback={<Loading centered />}>
                <Outlet />
            </Suspense>
        </React.Fragment>
</div>
    );
};

export default PublicLayout;
