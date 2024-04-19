import React, { Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { useSelector } from 'react-redux';

const PublicLayout = () => {
    const { isLoggedIn } = useSelector((state) => state?.auth);

    const navigate = useNavigate();

    if (isLoggedIn) navigate('/');

    return (
        <React.Fragment>
            <Header></Header>
            <Suspense fallback={<Loading centered />}>
                <Outlet />
            </Suspense>
        </React.Fragment>
    );
};

export default PublicLayout;
