import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, MainPanel } from '@components/Dashboard';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Suspense, useEffect } from 'react';
import Loading from '../../components/Loading/Loading';
const DashboardLayout = () => {
    const { isLoggedIn, userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn || role !== 'coach') navigate('/login');
    }, [navigate, isLoggedIn, role]);

    return (
        <Container fluid className="p-0">
            {/* Collapsible Sidebar */}
            {/* Main Content */}
            <Sidebar />
            <MainPanel>
                <Suspense fallback={<Loading centered />}>
                    <Outlet />
                </Suspense>
            </MainPanel>
        </Container>
    );
};

export default DashboardLayout;
