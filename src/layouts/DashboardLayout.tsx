import React from 'react';
import { Layout, Button, Space } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/Logo';
import '../styles/theme.css';

const { Header, Content } = Layout;

const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAppContext();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Layout className="dashboard-layout-main">
            <Header className="dashboard-header">
                <div className="header-logo-container">
                    <Link to="/dashboard" className="header-logo-container">
                        <Logo size={36} />
                    </Link>
                </div>

                <div className="dashboard-header-right">
                    <Space size={32} className="nav-links-right">
                        <Link to="/dashboard" className={`nav-text-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                            Dashboard
                        </Link>
                        <Link to="/dashboard/my-investments" className={`nav-text-link ${location.pathname === '/dashboard/my-investments' ? 'active' : ''}`}>
                            My Investments
                        </Link>
                        <Link to="/dashboard/bonds" className={`nav-text-link ${location.pathname === '/dashboard/bonds' ? 'active' : ''}`}>
                            Bonds
                        </Link>
                        <Button
                            type="link"
                            className="btn-logout-red"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Space>
                </div>
            </Header>
            <Content className="dashboard-main-content">
                <div className="dashboard-container">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default DashboardLayout;
