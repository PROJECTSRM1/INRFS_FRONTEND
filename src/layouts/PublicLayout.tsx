import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import Logo from '../components/Logo';
import RegisterModal from '../components/auth/RegisterModal';
import LoginModal from '../components/auth/LoginModal';
import '../styles/theme.css';
import '../styles/layout.css';

const { Header, Content } = Layout;

const PublicLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const openRegister = () => {
        setIsRegisterModalOpen(true);
        setMobileMenuOpen(false);
    };

    const handleScrollToSection = (sectionId: string) => {
        setMobileMenuOpen(false);
        // If not on landing page, navigate first
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation to complete, then scroll
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            // Already on landing page, just scroll
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const openLogin = () => {
        setIsLoginModalOpen(true);
        setMobileMenuOpen(false);
    };

    const menuItems = [
        { key: '/', label: <Link to="/">Home</Link> },
        { key: '/#plans', label: <Link to="/plans">Plans</Link> },
        { key: '/#about', label: <Link to="/about">About</Link> },
    ];

    return (
        <Layout className="dashboard-layout-main">
            <Header className="dashboard-header">
                <Link to="/" className="dashboard-logo-link">
                    <Logo size={40} />
                </Link>

                {/* Desktop Navigation */}
                <div className="dashboard-header-right desktop-nav">
                    <Menu
                        mode="horizontal"
                        disabledOverflow
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        className="dashboard-top-menu"
                    />
                    <Button
                        type="text"
                        onClick={openLogin}
                        className="login-btn-text"
                    >
                        Login
                    </Button>
                    <Button
                        type="primary"
                        onClick={openRegister}
                        className="register-btn-solid"
                    >
                        Register
                    </Button>
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
                            to="/"
                            className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <a
                            className="mobile-nav-link"
                            onClick={(e) => { e.preventDefault(); handleScrollToSection('plans'); }}
                        >
                            Plans
                        </a>
                        <a
                            className="mobile-nav-link"
                            onClick={(e) => { e.preventDefault(); handleScrollToSection('about'); }}
                        >
                            About
                        </a>
                        <Button
                            type="text"
                            block
                            onClick={openLogin}
                            className="mobile-nav-link mobile-login-drawer-btn"
                        >
                            Login
                        </Button>
                        <Button
                            type="primary"
                            block
                            onClick={openRegister}
                            className="mobile-logout-btn"
                        >
                            Register
                        </Button>
                    </div>
                </Drawer>
            </Header>
            <Content>
                <Outlet context={{ openRegister, openLogin }} />
                <RegisterModal open={isRegisterModalOpen} onCancel={() => setIsRegisterModalOpen(false)} />
                <LoginModal
                    visible={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                    openRegister={openRegister}
                />
            </Content>
        </Layout>
    );
};

export default PublicLayout;
