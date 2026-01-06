import React, { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(false);
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyingEmail, setVerifyingEmail] = useState('');
    const [submittable, setSubmittable] = useState(false);
    const [tempRegisterResponse, setTempRegisterResponse] = useState<any>(null); // Store register response temporarily
    const [form] = Form.useForm();

    // Watch all values to trigger validation check
    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(
                () => setSubmittable(true),
                () => setSubmittable(false),
            );
    }, [values, form]);

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            message.error('Please enter a valid 6-digit OTP');
            return;
        }
        setLoading(true);
        try {
            await authService.verifyOTP(verifyingEmail, otp);
            setIsOtpVisible(false);
            setOtp('');

            // Show Success Modal after OTP verification
            onCancel();
            Modal.success({
                title: 'Registration Successful!',
                centered: true,
                width: 500,
                content: (
                    <div className="registration-success-box">
                        <Paragraph>Welcome to INRFS. Your account has been created successfully.</Paragraph>
                        <div className="registration-success-info-box">
                            <Text type="secondary" className="registration-success-label">Your Investor ID:</Text>
                            <Title level={2} className="registration-success-id">{tempRegisterResponse?.inv_reg_id}</Title>
                            <Text type="secondary" className="registration-success-user-id">User ID: {tempRegisterResponse?.user_id}</Text>
                        </div>
                        <Text strong>Please use your email to login.</Text>
                    </div>
                ),
                okText: "Go to Login",
                onOk: () => {
                    if (onSuccess) {
                        onSuccess(verifyingEmail);
                    }
                }
            });

        } catch (error: any) {
            console.error('OTP Verification Error:', error);
            message.error(error.response?.data?.detail || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const onFinishInfo = async (values: any) => {
        setLoading(true);
        try {
            const dob = values.dob.format('YYYY-MM-DD');
            const age = dayjs().diff(values.dob, 'year');
            const genderMap: Record<string, number> = { 'male': 1, 'female': 2, 'other': 3 };

            const cleanMobile = values.mobile.replace(/\D/g, '');

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
                dob: dob,
                role_id: 1

            };

            const response = await authService.registerUser(payload);

            // Registration successful (OTP sent), now show OTP modal
            setTempRegisterResponse(response);
            setVerifyingEmail(values.email);
            setIsOtpVisible(true);
            message.success('Registration initiated. OTP sent to your email!');

        } catch (error: any) {
            console.error('Registration Error:', error);
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data.detail)) {
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

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinishInfo}
                    requiredMark={false}
                    className="auth-form-v2"
                >
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
                        <Input
                            placeholder="john.doe@example.com"
                            size="large"
                            className="minimal-input"
                        />
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
                        disabled={!submittable}
                    >
                        Register
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
                className="otp-modal-refined"
            >
                <div className="registration-header">
                    <Title level={3} className="auth-title-text">Verify Email</Title>
                    <Paragraph type="secondary">Enter the 6-digit OTP sent to {verifyingEmail}</Paragraph>
                    <div className="registration-content">
                        <div className="otp-input-container">
                            <Input.OTP
                                length={6}
                                value={otp}
                                onChange={(val) => setOtp(val)}
                            />
                        </div>

                        <div className="otp-button-group">
                            <Button
                                type="primary"
                                block
                                loading={loading}
                                onClick={handleVerifyOtp}
                                className="btn-solid-primary"
                                size="large"
                            >
                                Verify Email
                            </Button>
                            <Button
                                block
                                onClick={() => setIsOtpVisible(false)}
                                className="btn-hero-ghost-dark otp-cancel-button"
                                size="large"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RegisterModal;
