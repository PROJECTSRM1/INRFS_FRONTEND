import React, { useState } from 'react';
import { Layout, Button, Space, Drawer } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/Logo';
import '../styles/theme.css';
import '../styles/layout.css';

const { Header, Content } = Layout;

const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const { logout } = useAppContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        // Force navigation to home page
        window.location.href = '/';
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <Layout className="dashboard-layout-main">
            <Header className="dashboard-header">
                <div className="header-logo-container">
                    <Link to="/dashboard" className="header-logo-container">
                        <Logo size={36} />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="dashboard-header-right desktop-nav">
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
                        <Link to="/dashboard/profile" className={`nav-text-link ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}>
                            Profile
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

                {/* Mobile Menu Toggle */}
                <Button
                    className="mobile-menu-toggle"
                    icon={<MenuOutlined />}
                    onClick={() => setMobileMenuOpen(true)}
                />

                {/* Mobile Drawer Menu */}
                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={() => setMobileMenuOpen(false)}
                    open={mobileMenuOpen}
                    className="mobile-nav-drawer"
                >
                    <div className="mobile-nav-links">
                        <Link
                            to="/dashboard"
                            className={`mobile-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/dashboard/my-investments"
                            className={`mobile-nav-link ${location.pathname === '/dashboard/my-investments' ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            My Investments
                        </Link>
                        <Link
                            to="/dashboard/bonds"
                            className={`mobile-nav-link ${location.pathname === '/dashboard/bonds' ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            Bonds
                        </Link>
                        <Link
                            to="/dashboard/profile"
                            className={`mobile-nav-link ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            Profile
                        </Link>
                        <Button
                            type="primary"
                            danger
                            block
                            onClick={handleLogout}
                            className="mobile-logout-btn"
                        >
                            Logout
                        </Button>
                    </div>
                </Drawer>
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
