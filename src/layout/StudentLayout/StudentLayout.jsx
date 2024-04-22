import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, MainPanel } from '@components/Dashboard';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
const DashboardLayout = () => {
    const { isLoggedIn, userInfo } = useSelector((state) => state?.auth);
    const email = userInfo?.email.toLowerCase();
    const role = email?.includes('admin') ? 'admin' : email?.includes('coach') ? 'coach' : 'student';

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn || role !== 'student') navigate('/login');
    }, [navigate, isLoggedIn, role]);

    return (
        <Container fluid className="p-0">
            {/* Collapsible Sidebar */}
            {/* Main Content */}
            <Sidebar />
            <MainPanel>
                <Outlet />
            </MainPanel>
        </Container>
    );
};

export default DashboardLayout;
