import React, { useState } from 'react';
import { Modal, Radio, Input, Button, Typography, message } from 'antd';
import '../../styles/theme.css';

const { Title, Text, Link } = Typography;

interface ForgotPasswordModalProps {
    open: boolean;
    onCancel: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onCancel }) => {
    const [method, setMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = () => {
        if (method === 'email' && !email) {
            message.error('Please enter your email');
            return;
        }
        if (method === 'phone' && !phone) {
            message.error('Please enter your phone number');
            return;
        }
        message.success(`Reset instructions sent via ${method === 'email' ? 'Email' : 'SMS'}!`);
        onCancel();
        // Reset fields
        setEmail('');
        setPhone('');
        setMethod('email');
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={550}
            className="forgot-password-modal"
            styles={{ body: { padding: '24px' } }}
        >
            <div style={{ padding: '8px 8px 32px' }}>
                <Title level={2} className="forgot-password-title" style={{ marginBottom: '8px' }}>
                    Update password, email or phone
                </Title>

                <Text style={{ fontSize: '15px', display: 'block', marginBottom: '24px', color: '#6b7280' }}>
                    How would you like to reset your password?
                </Text>

                <Radio.Group
                    onChange={(e) => setMethod(e.target.value)}
                    value={method}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}
                >
                    <Radio value="email" style={{ fontSize: '15px', alignItems: 'center' }}>
                        <span style={{ marginLeft: 8, fontSize: '15px' }}>Email</span>
                    </Radio>
                    <Radio value="phone" style={{ fontSize: '15px', alignItems: 'center' }}>
                        <span style={{ marginLeft: 8, fontSize: '15px', whiteSpace: 'nowrap' }}>Text Message (SMS)</span>
                    </Radio>
                </Radio.Group>

                <div style={{ marginBottom: '32px' }}>
                    <Text style={{ display: 'block', marginBottom: '16px', fontSize: '15px', color: '#6b7280' }}>
                        {method === 'email'
                            ? 'We will send you an email with instructions on how to reset your password.'
                            : 'We will send you a text message with a verification code to reset your password.'}
                    </Text>

                    {method === 'email' ? (
                        <Input
                            size="large"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ height: '56px', fontSize: '15px', borderRadius: '12px' }}
                        />
                    ) : (
                        <Input
                            size="large"
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ height: '56px', fontSize: '15px', borderRadius: '12px' }}
                        />
                    )}
                </div>

                <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleSubmit}
                    style={{
                        height: '56px',
                        fontSize: '16px',
                        fontWeight: 600,
                        borderRadius: '30px',
                        marginBottom: '24px',
                        backgroundColor: 'var(--primary-light-brown)',
                        borderColor: 'var(--primary-light-brown)',
                        color: '#fff'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-brown-hover)';
                        e.currentTarget.style.borderColor = 'var(--primary-brown-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-light-brown)';
                        e.currentTarget.style.borderColor = 'var(--primary-light-brown)';
                    }}
                >
                    {method === 'email' ? 'Email Me' : 'Text Me'}
                </Button>

                <div style={{ textAlign: 'center' }}>
                    <Link
                        href="#"
                        style={{ color: '#000', textDecoration: 'underline', fontSize: '14px', fontWeight: 500 }}
                        onClick={(e) => e.preventDefault()}
                    >
                        I can't remember my email address or phone number.
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export default ForgotPasswordModal;
