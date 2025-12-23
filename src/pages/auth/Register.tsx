import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Modal, Row, Col, Checkbox, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { fintechService } from '../../services/fintechService';
import '../../styles/theme.css';

const { Title, Text, Paragraph } = Typography;

const Register: React.FC = () => {
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
            setLoading(false);
            Modal.success({
                title: 'Registration Successful',
                content: (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Paragraph>Welcome to InvestPro. Your unique **Customer ID** is:</Paragraph>
                        <Title level={2} style={{ color: '#f24c52', margin: '16px 0', fontSize: '32px', fontWeight: 800 }}>{newId}</Title>
                        <Text strong>Please save this ID. You will need it to sign in.</Text>
                    </div>
                ),
                onOk: () => navigate(`/auth/login?role=investor&id=${newId}`)
            });
        }, 1500);
    };

    return (
        <div className="auth-layout-wrapper">
            <Card className="auth-card-mini" bordered={false}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Create Your Account</Title>
                </div>

                <Form layout="vertical" onFinish={onFinishInfo} requiredMark={false}>
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

                    <Form.Item label={<Text strong>Password</Text>} name="password" rules={[{ required: true, message: 'Required' }]}>
                        <Input.Password placeholder="••••••••" size="large" className="minimal-input" />
                    </Form.Item>

                    <Form.Item label={<Text strong>Confirm Password</Text>} name="confirm" rules={[{ required: true, message: 'Required' }]}>
                        <Input.Password placeholder="••••••••" size="large" className="minimal-input" />
                    </Form.Item>

                    <Form.Item name="agree" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Please agree to T&C') }]}>
                        <Checkbox>
                            <Text type="secondary">I agree to the Terms & Conditions and Privacy Policy</Text>
                        </Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        className="btn-primary"
                        style={{ height: '56px', fontSize: '1.1rem', background: '#1e3a8a' }}
                    >
                        Register & Verify
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <Text type="secondary">Already have an account? </Text>
                    <Link to="/auth/login" style={{ color: '#2563eb', fontWeight: 600 }}>Login here</Link>
                </div>
            </Card>

            {/* OTP Modal */}
            <Modal
                open={isOtpVisible}
                footer={null}
                closable={false}
                centered
                width={400}
                bodyStyle={{ padding: '40px' }}
            >
                <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ margin: '0 0 8px' }}>Verify Your Account</Title>
                    <Paragraph type="secondary">Enter the OTP sent to your email and mobile number</Paragraph>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '32px 0' }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Input
                                key={i}
                                style={{ width: '45px', height: '54px', textAlign: 'center', fontSize: '1.2rem', borderRadius: '8px' }}
                                maxLength={1}
                            />
                        ))}
                    </div>

                    <Button
                        type="primary"
                        block
                        loading={loading}
                        onClick={handleVerifyOtp}
                        style={{ height: '48px', fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}
                    >
                        Verify & Continue
                    </Button>

                    <Button
                        block
                        onClick={() => setIsOtpVisible(false)}
                        style={{ height: '48px', fontSize: '1rem', fontWeight: 600, color: '#2563eb', border: '1px solid #2563eb' }}
                    >
                        Cancel
                    </Button>

                    <div style={{ marginTop: '24px' }}>
                        <Text type="secondary">Didn't receive code? </Text>
                        <Link to="#" onClick={() => message.info('OTP Resent')}>Resend</Link>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Register;
