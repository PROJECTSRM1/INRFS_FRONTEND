import React, { useState } from 'react';
import { Modal, Input, Button, Typography, message, Form } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import '../../styles/theme.css';

const { Title, Text } = Typography;

interface ForgotPasswordModalProps {
    open: boolean;
    onCancel: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onCancel }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        console.log('🔵 [ForgotPassword] handleSubmit called');
        console.log('🔵 [ForgotPassword] Email value:', email);

        // Validate email
        if (!email) {
            console.log('🔴 [ForgotPassword] Validation failed: Email is empty');
            message.error('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('🔴 [ForgotPassword] Validation failed: Invalid email format');
            message.error('Please enter a valid email address');
            return;
        }

        console.log('✅ [ForgotPassword] Validation passed, making API call...');
        setLoading(true);

        try {
            console.log('🚀 [ForgotPassword] Calling authService.forgotPassword with email:', email);
            console.log('🚀 [ForgotPassword] Check Network tab now! Look for: /api/users/forgot-password');

            const response = await authService.forgotPassword(email);

            console.log('✅ [ForgotPassword] API call successful!');
            console.log('✅ [ForgotPassword] Response:', response);

            message.success({
                content: 'Password reset link has been sent to your email!',
                duration: 5,
            });

            // Reset and close
            setEmail('');
            form.resetFields();
            onCancel();
        } catch (error: any) {
            console.error('❌ [ForgotPassword] API call failed!');
            console.error('❌ [ForgotPassword] Error details:', error);
            console.error('❌ [ForgotPassword] Error response:', error.response);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.detail
                || 'Failed to send reset link. Please try again.';

            message.error(errorMessage);
        } finally {
            setLoading(false);
            console.log('🔵 [ForgotPassword] Request completed, loading state reset');
        }
    };

    const handleCancel = () => {
        setEmail('');
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            centered
            width={480}
            className="forgot-password-modal"
            styles={{ body: { padding: '40px 32px' } }}
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
                    <MailOutlined style={{ fontSize: '32px', color: '#926132' }} />
                </div>

                {/* Title */}
                <Title level={2} style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 600 }}>
                    Forgot Password?
                </Title>

                {/* Description */}
                <Text style={{ fontSize: '15px', color: '#6b7280', display: 'block', lineHeight: '1.6' }}>
                    No worries! Enter your email address and we'll send you a link to reset your password.
                </Text>
            </div>

            {/* Form */}
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                    ]}
                >
                    <Input
                        size="large"
                        prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            height: '48px',
                            fontSize: '15px',
                            borderRadius: '8px',
                        }}
                        onPressEnter={handleSubmit}
                    />
                </Form.Item>

                {/* Submit Button */}
                <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleSubmit}
                    loading={loading}
                    style={{
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        marginBottom: '16px',
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
                    Send Reset Link
                </Button>

                {/* Back to Login */}
                <Button
                    block
                    size="large"
                    onClick={handleCancel}
                    disabled={loading}
                    icon={<ArrowLeftOutlined />}
                    style={{
                        height: '48px',
                        fontSize: '15px',
                        fontWeight: 500,
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        color: '#374151',
                    }}
                >
                    Back to Login
                </Button>
            </Form>
        </Modal>
    );
};

export default ForgotPasswordModal;
