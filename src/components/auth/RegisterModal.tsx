import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Checkbox, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fintechService } from '../../services/fintechService';
import '../../styles/theme.css';

const { Title, Text, Paragraph } = Typography;

interface RegisterModalProps {
    open: boolean;
    onCancel: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onCancel }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isOtpVisible, setIsOtpVisible] = useState(false);

    const onFinishInfo = () => {
        setLoading(true);
        setTimeout(() => {
            setIsOtpVisible(true);
            setLoading(false);
        }, 1000);
    };

    const handleVerifyOtp = () => {
        setLoading(true);
        setTimeout(() => {
            const newId = fintechService.generateCustomerId();
            setIsOtpVisible(false);
            onCancel();
            setLoading(false);
            Modal.success({
                title: 'Registration Successful',
                centered: true,
                width: 500,
                content: (
                    <div className="registration-success-box">
                        <Paragraph>Welcome to INRFS. Your unique **Customer ID** is:</Paragraph>
                        <Title level={1} className="success-id-display">{newId}</Title>
                        <Text strong>Please save this ID safely. You will need it to login.</Text>
                    </div>
                ),
                onOk: () => navigate(`/auth/login?role=investor&id=${newId}`)
            });
        }, 1500);
    };

    return (
        <>
            <Modal
                open={open && !isOtpVisible}
                onCancel={onCancel}
                footer={null}
                width={500}
                centered
                destroyOnClose
                title={null}
                className="ant-modal-refined"
            >
                <div className="registration-header">
                    <Title level={2} className="auth-title-text">Create Your Account</Title>
                    <Text type="secondary">Join INRFS today and start growing your wealth.</Text>
                </div>

                <Form layout="vertical" onFinish={onFinishInfo} requiredMark={false} className="auth-form-v2">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>First Name</Text>} name="firstName" rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="John" size="large" className="minimal-input" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Last Name</Text>} name="lastName" rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="Doe" size="large" className="minimal-input" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label={<Text strong>Email Address</Text>} name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
                        <Input placeholder="john.doe@example.com" size="large" className="minimal-input" />
                    </Form.Item>

                    <Form.Item label={<Text strong>Mobile Number</Text>} name="mobile" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="+1 234 567 8900" size="large" className="minimal-input" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Password</Text>} name="password" rules={[{ required: true, message: 'Required' }]}>
                                <Input.Password placeholder="••••••••" size="large" className="minimal-input" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Confirm Password</Text>} name="confirm" rules={[{ required: true, message: 'Required' }]}>
                                <Input.Password placeholder="••••••••" size="large" className="minimal-input" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="agree" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Please agree to T&C') }]}>
                        <Checkbox>
                            <Text type="secondary" className="compact-text">I agree to the Terms & Conditions and Privacy Policy</Text>
                        </Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        className="btn-hero-primary"
                    >
                        Register & Verify
                    </Button>
                </Form>
            </Modal>

            {/* OTP Modal */}
            <Modal
                open={isOtpVisible}
                footer={null}
                closable={false}
                centered
                width={420}
                title={null}
            >
                <div className="registration-header">
                    <Title level={3} className="auth-title-text">Verify Your Account</Title>
                    <Paragraph type="secondary">Enter the 6-digit OTP sent to your devices</Paragraph>

                    <div className="otp-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Input
                                key={i}
                                className="otp-input"
                                maxLength={1}
                            />
                        ))}
                    </div>

                    <Button
                        type="primary"
                        block
                        loading={loading}
                        onClick={handleVerifyOtp}
                        className="btn-hero-primary"
                    >
                        Verify & Continue
                    </Button>

                    <Button
                        block
                        onClick={() => setIsOtpVisible(false)}
                        className="btn-hero-ghost-dark"
                    >
                        Cancel
                    </Button>

                    <div className="auth-footer-section">
                        <Text type="secondary">Didn't receive code? </Text>
                        <Text className="brand-link" style={{ cursor: 'pointer' }} onClick={() => message.info('OTP Resent')}>Resend OTP</Text>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RegisterModal;
