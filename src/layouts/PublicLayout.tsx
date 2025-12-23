import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import RegisterModal from '../components/auth/RegisterModal';
import '../styles/theme.css';

const { Header, Content } = Layout;

const PublicLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const openRegister = () => setIsRegisterModalOpen(true);

    const menuItems = [
        { key: '/', label: <Link to="/">Home</Link> },
        { key: '/#plans', label: <Link to="/#plans">Plans</Link> },
        { key: '/#about', label: <Link to="/#about">About</Link> },
    ];

    return (
        <Layout className="dashboard-layout-main">
            <Header className="dashboard-header">
                <Link to="/" className="dashboard-logo-link">
                    <Logo size={40} />
                </Link>

                <div className="dashboard-header-right">
                    <Menu
                        mode="horizontal"
                        disabledOverflow
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        className="dashboard-top-menu"
                    />
                    <Button
                        type="text"
                        onClick={() => navigate('/auth/login')}
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
            </Header>
            <Content>
                <Outlet context={{ openRegister }} />
                <RegisterModal open={isRegisterModalOpen} onCancel={() => setIsRegisterModalOpen(false)} />
            </Content>
        </Layout>
    );
};

export default PublicLayout;
