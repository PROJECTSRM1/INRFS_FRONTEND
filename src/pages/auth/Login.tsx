import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';
import { authService } from '../../services/authService';
import '../../styles/theme.css';
import '../../styles/auth-mobile.css';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const { setUser } = useAppContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

    interface LoginValues {
        id: string;
        password?: string;
    }

    const onFinish = async (values: LoginValues) => {
        setLoading(true);
        try {
            const response = await authService.loginUser({
                email: values.id.includes('@') ? values.id : undefined,
                inv_reg_id: !values.id.includes('@') ? values.id : undefined,
                password: values.password || ''
            });

            // Store tokens in localStorage
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            localStorage.setItem('role_id', response.role_id.toString());

            // Determine user role based on role_id
            const userRole: 'investor' | 'admin' = response.role_id === 1 ? 'investor' : 'admin';

            setUser({
                id: response["Customer-ID"],
                name: response.First_Name,
                email: values.id.includes('@') ? values.id : '',
                role: userRole,
                customerId: response["Customer-ID"]
            });

            message.success('Authenticated Successfully');

            // Navigate based on role_id
            if (response.role_id === 1) {
                navigate('/dashboard');
            } else if (response.role_id === 2 || response.role_id === 3) {
                navigate('/admin/dashboard');
            } else {
                message.warning('Unknown role. Redirecting to home.');
                navigate('/');
            }
        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.detail
                || error.response?.data?.message
                || 'Login failed. Please check your credentials.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout-wrapper">
            <Card className="auth-card-mini" bordered={false}>
                <div className="auth-header-section">
                    <div className="auth-avatar-box">
                        <Avatar
                            size={64}
                            icon={<UserOutlined />}
                            className="auth-avatar-styled"
                        />
                    </div>
                    <Title level={2} className="auth-title-text">
                        Investor Login
                    </Title>
                    <Text type="secondary">Access your investment portfolio</Text>
                </div>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    initialValues={{ id: searchParams.get('id') || '' }}
                    className="auth-form-v2"
                >
                    <Form.Item
                        label={<Text strong>Email or Customer ID</Text>}
                        name="id"
                        rules={[{ required: true, message: 'Please enter your ID' }]}
                    >
                        <Input
                            placeholder="john.doe@example.com or I1234"
                            size="large"
                            className="minimal-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>Password</Text>}
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            placeholder="••••••••"
                            size="large"
                            className="minimal-input"
                        />
                    </Form.Item>

                    <div className="auth-options-row">
                        <Checkbox><Text type="secondary">Remember me</Text></Checkbox>
                        <a
                            href="#"
                            className="brand-link"
                            onClick={(e) => {
                                e.preventDefault();
                                setForgotPasswordOpen(true);
                            }}
                        >
                            Forgot password?
                        </a>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        className="btn-hero-primary"
                    >
                        Login
                    </Button>
                </Form>

                <div className="auth-footer-section">
                    <Text type="secondary">Don't have an account? </Text>
                    <Link to="/auth/register" className="brand-link">Register here</Link>
                </div>
            </Card>

            <ForgotPasswordModal
                open={forgotPasswordOpen}
                onCancel={() => setForgotPasswordOpen(false)}
            />
        </div>
    );
};

export default Login;
