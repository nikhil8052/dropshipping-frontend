import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, MainPanel } from '@components/Dashboard';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
const DashboardLayout = () => {
    const { isLoggedIn } = useSelector((state) => state?.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) navigate('/login');
    }, [navigate, isLoggedIn]);

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
