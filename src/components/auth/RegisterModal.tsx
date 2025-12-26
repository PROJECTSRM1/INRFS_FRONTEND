import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Checkbox, message, Typography, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { authService } from '../../services/authService';
import '../../styles/theme.css';

const { Title, Text, Paragraph } = Typography;

interface RegisterModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess?: (email: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onCancel, onSuccess }) => {
    // const { setUser } = useAppContext(); // Unused
    const [loading, setLoading] = useState(false);

    const onFinishInfo = async (values: any) => {
        setLoading(true);
        try {
            const dob = values.dob.format('YYYY-MM-DD');
            const age = dayjs().diff(values.dob, 'year');
            const genderMap: Record<string, number> = { 'male': 1, 'female': 2, 'other': 3 };

            // Format mobile number: remove all non-digits
            const cleanMobile = values.mobile.replace(/\D/g, '');

            // Basic client-side validation for mobile (10 digits required by backend)
            if (cleanMobile.length !== 10) {
                message.error('Mobile number must be exactly 10 digits');
                setLoading(false);
                return;
            }

            const payload = {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                mobile: cleanMobile,
                password: values.password,
                gender_id: genderMap[values.gender] || 0,
                age: age,
                dob: dob
            };

            const response = await authService.registerUser(payload);

            // Success Flow
            onCancel();
            Modal.success({
                title: 'Registration Successful!',
                centered: true,
                width: 500,
                content: (
                    <div className="registration-success-box">
                        <Paragraph>Welcome to INRFS. Your account has been created successfully.</Paragraph>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Your Investor ID:</Text>
                            <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>{response.inv_reg_id}</Title>
                            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>User ID: {response.user_id}</Text>
                        </div>
                        <Text strong>Please use your email to login.</Text>
                    </div>
                ),
                okText: "Go to Login",
                onOk: () => {
                    // Trigger login modal open from parent or navigate
                    // Since we can't easily open the sibling LoginModal directly from here without context/props,
                    // we'll use a hack or better, ensure we passed a "onAuthenticationSuccess" prop or similar.
                    // However, the cleanest way given current structure is to rely on the parent (PublicLayout) to handle "after register" flow if we emitted an event,
                    // but simpler is to just call a passed prop.
                    // Let's assume we can pass a callback for "openLogin" or we emit a custom event.
                    // For now, let's reopen the login modal if the prop exists, otherwise just close.
                    // Actually, we can use the `navigate` or just rely on the user.
                    // The user request says "clicking of ok on the popup should redirect to login page".
                    // Since Login is a modal, we need to open it.
                    if (onSuccess) {
                        onSuccess(values.email);
                    }
                }
            });
        } catch (error: any) {
            console.error('Registration Error:', error);
            if (error.response && error.response.data) {
                console.error('Validation Details:', error.response.data);
                // If it's a validation error (often 422 or 400), it might contain a "detail" array
                if (Array.isArray(error.response.data.detail)) {
                    // Show the first validation error
                    const firstError = error.response.data.detail[0];
                    message.error(`${firstError.loc.join(' -> ')}: ${firstError.msg}`);
                } else {
                    message.error(error.response.data.detail || error.response.data.message || 'Registration failed.');
                }
            } else {
                message.error('Registration failed. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
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
                    <Col xs={24} sm={12}>
                        <Form.Item label={<Text strong>First Name</Text>} name="firstName" rules={[{ required: true, message: 'Required' }]}>
                            <Input placeholder="John" size="large" className="minimal-input" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
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
                    <Col xs={24} sm={12}>
                        <Form.Item label={<Text strong>Date of Birth</Text>} name="dob" rules={[{ required: true, message: 'Required' }]}>
                            <DatePicker style={{ width: '100%' }} size="large" className="minimal-input" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item label={<Text strong>Gender</Text>} name="gender" rules={[{ required: true, message: 'Required' }]}>
                            <Select size="large" placeholder="Select" className="minimal-input">
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                                <Select.Option value="other">Other</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item label={<Text strong>Password</Text>} name="password" rules={[{ required: true, message: 'Required' }]}>
                            <Input.Password placeholder="••••••••" size="large" className="minimal-input" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
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
    );
};

export default RegisterModal;
