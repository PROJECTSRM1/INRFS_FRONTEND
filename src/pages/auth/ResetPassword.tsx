import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Input, Button, Typography, message, Form } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import '../../styles/theme.css';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        // Extract token from URL query parameters
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            console.log('Token extracted from URL:', tokenFromUrl);
        } else {
            message.error('Invalid reset link. Please request a new password reset.');
            setTimeout(() => navigate('/'), 3000);
        }
    }, [searchParams, navigate]);

    const handleSubmit = async () => {
        // Validate passwords
        if (!password) {
            message.error('Please enter a new password');
            return;
        }

        if (password.length < 6) {
            message.error('Password must be at least 6 characters long');
            return;
        }

        if (!confirmPassword) {
            message.error('Please confirm your password');
            return;
        }

        if (password !== confirmPassword) {
            message.error('Passwords do not match');
            return;
        }

        if (!token) {
            message.error('Invalid reset token. Please request a new password reset.');
            return;
        }

        setLoading(true);

        try {
            console.log('Resetting password with token:', token);
            const response = await authService.resetPassword(token, password);
            console.log('Password reset response:', response);

            message.success({
                content: 'Password reset successful! Redirecting to login...',
                duration: 3,
            });

            // Clear form
            form.resetFields();
            setPassword('');
            setConfirmPassword('');

            // Redirect to home/login after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error: any) {
            console.error('Password reset error:', error);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.detail
                || 'Failed to reset password. Please try again or request a new reset link.';

            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '24px',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    {/* Icon */}
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}
                    >
                        <LockOutlined style={{ fontSize: '32px', color: '#926132' }} />
                    </div>

                    {/* Title */}
                    <Title level={2} style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 600 }}>
                        Reset Your Password
                    </Title>

                    {/* Description */}
                    <Text style={{ fontSize: '15px', color: '#6b7280', display: 'block', lineHeight: '1.6' }}>
                        Enter your new password below. Make sure both passwords match.
                    </Text>
                </div>

                {/* Form */}
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {/* New Password */}
                    <Form.Item
                        label={<Text strong>New Password</Text>}
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your new password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                height: '48px',
                                fontSize: '15px',
                                borderRadius: '8px',
                            }}
                        />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item
                        label={<Text strong>Confirm Password</Text>}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<CheckCircleOutlined style={{ color: '#9ca3af' }} />}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                height: '48px',
                                fontSize: '15px',
                                borderRadius: '8px',
                            }}
                            onPressEnter={handleSubmit}
                        />
                    </Form.Item>

                    {/* Password Requirements */}
                    <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <Text style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                            <strong>Password Requirements:</strong>
                        </Text>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6b7280' }}>
                            <li>At least 6 characters long</li>
                            <li>Both passwords must match</li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="primary"
                        block
                        size="large"
                        htmlType="submit"
                        loading={loading}
                        style={{
                            height: '48px',
                            fontSize: '16px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            backgroundColor: '#926132',
                            borderColor: '#926132',
                            color: '#fff',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = '#784f28';
                                e.currentTarget.style.borderColor = '#784f28';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#926132';
                            e.currentTarget.style.borderColor = '#926132';
                        }}
                    >
                        Reset Password
                    </Button>

                    {/* Back to Login */}
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Button
                            type="link"
                            onClick={() => navigate('/')}
                            disabled={loading}
                            style={{ color: '#926132', fontWeight: 500 }}
                        >
                            Back to Login
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
