import React from 'react';
import { Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { RiseOutlined } from '@ant-design/icons';
import '../styles/auth.css';
import '../styles/global.css';

const { Title } = Typography;

const AuthLayout: React.FC = () => {
    return (
        <div className="auth-layout-wrapper">
            <div className="auth-header-logo">
                <Link to="/">
                    <div className="logo-icon-circle">
                        <RiseOutlined />
                    </div>
                </Link>
                <Title level={2} className="premium-brand-text">InvestPro</Title>
                <Typography.Text type="secondary">Grow your wealth with confidence</Typography.Text>
            </div>
            <div className="auth-content-container">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
