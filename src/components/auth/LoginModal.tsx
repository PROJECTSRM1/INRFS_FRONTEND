import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import '../../styles/theme.css';
import '../../styles/login-modal.css';
import { authService } from '../../services/authService';

const { Title, Text, Link } = Typography;

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    openRegister?: () => void;
    initialEmail?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, openRegister, initialEmail }) => {
    const navigate = useNavigate();
    const { setUser } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (visible && initialEmail) {
            form.setFieldsValue({ email: initialEmail });
        }
    }, [visible, initialEmail, form]);

    const handleLogin = async (values: { email: string; password: string; remember: boolean }) => {
        setLoading(true);
        try {
            const response = await authService.loginUser({
                email: values.email,
                password: values.password
            });

            // Map response to user context
            // Assuming backend returns similar structure to register or user details
            // If strictly following the provided schema in register response (user_id, inv_reg_id)
            // We might need to fetch profile if name is missed, but for now let's set what we have.
            setUser({
                id: response.user_id || '0',
                name: response.name || 'Investor', // Fallback if name not in login response
                email: values.email,
                role: 'investor',
                customerId: response.inv_reg_id || 'INV-000'
            });

            message.success('Login Successful!');
            form.resetFields();
            onClose();
            navigate('/dashboard');
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
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={480}
            centered
            className="login-modal"
        >
            <div className="login-modal-content">
                <div className="login-header">
                    <UserOutlined className="login-icon" />
                    <Title level={3} className="login-title">Welcome Back</Title>
                    <Text className="login-subtitle">Sign in to your account</Text>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={handleLogin}
                    layout="vertical"
                    className="login-form"
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your email"
                            size="large"
                            className="login-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                            size="large"
                            className="login-input"
                        />
                    </Form.Item>

                    <div className="login-options">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link className="forgot-link">Forgot password?</Link>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            block
                            className="login-button"
                        >
                            Sign In
                        </Button>
                    </Form.Item>

                    <div className="login-footer">
                        <Text className="footer-text">
                            Don't have an account?{' '}
                            <Link
                                className="signup-link"
                                onClick={() => {
                                    onClose();
                                    openRegister?.();
                                }}
                            >
                                Registration
                            </Link>
                        </Text>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default LoginModal;
