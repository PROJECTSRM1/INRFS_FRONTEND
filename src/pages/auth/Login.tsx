import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import '../../styles/theme.css';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const { setUser } = useAppContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    // Default to investor role
    const [role, setRole] = useState<'investor' | 'vendor'>('investor');

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'vendor') {
            setRole('vendor');
        }
    }, [searchParams]);

    const onFinish = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            // Fix: Logic to derive a consistent ID even if email is used
            const derivedId = values.id.includes('@') ? 'I4829' : values.id;

            setUser({
                id: '1',
                name: role === 'investor' ? 'Alex Johnson' : 'Partner Vendor',
                email: 'user@investpro.com',
                role: role,
                customerId: role === 'investor' ? derivedId : undefined
            });
            message.success('Authenticated Successfully');
            navigate('/dashboard');
        }, 1000);
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
                        {role === 'investor' ? 'Investor Login' : 'Vendor Portal'}
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
                        <Link to="#" className="brand-link">Forgot password?</Link>
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
        </div>
    );
};

export default Login;
