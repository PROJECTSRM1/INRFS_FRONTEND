import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import {
    LockOutlined,
    SafetyCertificateFilled,
    ArrowLeftOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import '../../styles/admin.css';

const { Title, Text } = Typography;

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        console.log('Login attempt:', values);
        navigate('/admin/dashboard');
    };

    return (
        <div className="admin-login-container">
            <Card className="admin-login-card" bordered={false}>
                <div className="admin-login-header">
                    <div className="admin-shield-icon-container">
                        <SafetyCertificateFilled />
                    </div>
                    <Title level={2} className="admin-login-title">
                        Admin Access
                    </Title>
                    <Text className="admin-login-subtitle">
                        Authorized personnel only
                    </Text>
                </div>

                <Alert
                    className="admin-restricted-alert"
                    message="This is a restricted area. Unauthorized access attempts are logged and monitored."
                    type="error"
                    showIcon
                    icon={<ExclamationCircleFilled />}
                />

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    size="large"
                >
                    <Form.Item
                        label={<span className="admin-label-text">Admin Username</span>}
                        name="username"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input
                            placeholder="admin@inrfs.com"
                            className="admin-input-dark"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="admin-label-text">Admin Password</span>}
                        name="password"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input.Password
                            placeholder="••••••••"
                            className="admin-input-dark"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="admin-label-text">Two-Factor Authentication Code</span>}
                        name="2fa"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input
                            placeholder="000000"
                            className="admin-input-dark"
                            maxLength={6}
                            style={{ letterSpacing: '2px', textAlign: 'center' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<LockOutlined />}
                            className="admin-submit-btn"
                            block
                        >
                            Secure Login
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <a href="/" className="back-home-link">
                        <ArrowLeftOutlined /> Back to Home
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default AdminLogin;
