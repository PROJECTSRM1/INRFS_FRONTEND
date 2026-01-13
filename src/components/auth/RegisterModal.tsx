import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Row, Col, Checkbox, message, Typography, DatePicker, Select, Alert } from 'antd';
import dayjs from 'dayjs';
import { authService } from '../../services/authService';
import '../../styles/theme.css';
import '../../styles/register-modal.css';


const { Title, Text, Paragraph } = Typography;

interface RegisterModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess?: (email: string) => void;
}

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    dob: dayjs.Dayjs;
    gender: string;
    password: string;
    confirm: string;
    agree: boolean;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onCancel, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyingEmail, setVerifyingEmail] = useState('');
    const [submittable, setSubmittable] = useState(false);
    const [tempRegisterResponse, setTempRegisterResponse] = useState<{ inv_reg_id?: string; user_id?: number } | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [form] = Form.useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


    // Watch all values to trigger validation check
    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(
                () => setSubmittable(true),
                () => setSubmittable(false),
            );
    }, [values, form]);

    useEffect(() => {
        if (!open) {
            form.resetFields();
            setIsOtpVisible(false);
            setOtp('');
        }
    }, [open, form]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            message.error('Please enter a valid 6-digit OTP');
            return;
        }
        setLoading(true);
        try {
            await authService.verifyOTP(verifyingEmail, otp);
            message.success('OTP verified successfully');
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
                        <Alert
                            message="Do not share your Investor ID with anyone."
                            type="warning"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />
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

        } catch (error: unknown) {
            console.error('OTP Verification Error:', error);
            const err = error as { response?: { data?: { detail?: string } } };
            message.error(err.response?.data?.detail || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        if (!verifyingEmail) {
            message.error('Email not found. Please try again.');
            return;
        }
        setLoading(true);
        try {
            await authService.sendOTP(verifyingEmail);
            message.success('OTP sent successfully!');
            setResendCooldown(60);
        } catch (error: any) {
            console.error('Resend OTP Error:', error);
            const detail = error.response?.data?.detail || error.response?.data?.message || error.message;
            message.error(`Failed to resend OTP: ${detail}`);
        } finally {
            setLoading(false);
        }
    };

    const onFinishInfo = async (values: RegisterFormValues) => {
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
            setResendCooldown(60);
            message.success('OTP sent successfully!');

        } catch (error: unknown) {
            console.error('Registration Error:', error);
            const err = error as { response?: { data?: { detail?: unknown; message?: string } } };
            if (err.response && err.response.data) {
                if (err.response.data.detail && Array.isArray(err.response.data.detail)) {
                    const firstError = err.response.data.detail[0];
                    message.error(`${firstError.loc.join(' -> ')}: ${firstError.msg}`);
                } else {
                    message.error((err.response.data.detail as string) || err.response.data.message || 'Registration failed.');
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
                     onFinishFailed={() => {
    message.error('Please fill all mandatory fields');
  }}
                    className="auth-form-v2"
                     requiredMark
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label={<Text strong>First Name</Text>} name="firstName"   normalize={(value) => value?.trim()} rules={[{ required: true, message: 'Required' },{
      pattern: /^[A-Za-z\s]+$/,
      message: 'First name should contain only letters',
    },]}>
                                <Input placeholder="John" size="large" className="minimal-input" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label={<Text strong>Last Name</Text>} name="lastName"  normalize={(value) => value?.trim()}  rules={[{ required: true, message: 'Required' }, {
      pattern: /^[A-Za-z\s]+$/,
      message: 'Last name should contain only letters',
    },]}>
                                <Input placeholder="Doe" size="large" className="minimal-input" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label={<Text strong>Email Address</Text>} name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}>
                        <Input
                            placeholder="john.doe@example.com"
                            size="large"
                            className="minimal-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>Mobile Number</Text>}
                        name="mobile"
                        rules={[
                            { required: true, message: 'Required' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
                        ]}
                    >
                        <Input
                            addonBefore="+91"
                            placeholder="9876543210"
                            size="large"
                            className="minimal-input"
                            maxLength={10}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label={<Text strong>Date of Birth</Text>} name="dob" rules={[{ required: true, message: 'Required' }]}>
                               <DatePicker
  style={{ width: '100%' }}
  size="large"
  className="minimal-input"
  disabledDate={(current) => current && current > dayjs().endOf('day')}
/>

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
                            <Form.Item
                                label={<Text strong>Password</Text>}
                                name="password"
                                rules={[
                                    { required: true, message: 'Required' },
                                     {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$!%*?&]{6,}$/,
      message: 'Password must be at least 6 characters and contain letters and numbers',
    },
                                ]}
                            >
                                <Input.Password placeholder="••••••••" size="large" className="minimal-input"  visibilityToggle={{visible: passwordVisible,
  onVisibleChange: setPasswordVisible,   }}   onBlur={() => setPasswordVisible(false)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={<Text strong>Confirm Password</Text>}
                                name="confirm"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Required' },
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
                                <Input.Password placeholder="••••••••" size="large" className="minimal-input"  visibilityToggle={{ visible: confirmPasswordVisible,  onVisibleChange: setConfirmPasswordVisible, }}   onBlur={() => setConfirmPasswordVisible(false)}/>
                            </Form.Item>
                        </Col>
                    </Row>

                <Form.Item
  name="agree"
  valuePropName="checked"
  rules={[
    {
      validator: (_, value) =>
        value
          ? Promise.resolve()
          : Promise.reject(
              new Error('Please accept the Terms & Conditions to proceed')
            ),
    },
  ]}
>
  <Checkbox>
    <Text type="secondary" className="compact-text">
      I agree to the Terms & Conditions and Privacy Policy
    </Text>
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
                                block
                                type="primary"
                                onClick={handleVerifyOtp}
                                loading={loading}
                                size="large"
                                className="otp-verify-btn"
                            >
                                Verify Email
                            </Button>

                            <div className="otp-helpers" style={{ marginTop: '16px', textAlign: 'center' }}>
                                <Text type="secondary">Didn't receive email? </Text>
                                <Button
                                    type="link"
                                    onClick={handleResendOtp}
                                    disabled={resendCooldown > 0}
                                    style={{ padding: 0 }}
                                    className="otp-resend-link"
                                >
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
                                </Button>
                            </div>

                            <Button
                                block
                                onClick={() => {
                                setOtp('');               
                             setIsOtpVisible(false);   
                             }}
                                size="large"
                                style={{ marginTop: '16px' }}
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
