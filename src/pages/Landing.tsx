import React, { useState, useRef } from 'react';
import { Typography, Button, Row, Col, Space, Card, Modal, Form, Input, Carousel } from 'antd';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import {
    SafetyOutlined,
    RiseOutlined,
    FileTextOutlined,
    CheckCircleFilled,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    LockOutlined,
    HeartOutlined,
    TeamOutlined,
    GlobalOutlined,
    UserOutlined,
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons';
import { INVESTMENT_PLANS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/Logo';
import type { InvestmentPlan } from '../types';
import '../styles/theme.css';
import '../styles/landing.css';
import '../styles/image-carousel.css';
import '../styles/hero-carousel.css';


const { Title, Text, Paragraph } = Typography;

interface PublicContext {
    openRegister: () => void;
}

const Landing: React.FC = () => {
    const { openRegister } = useOutletContext<PublicContext>();
    const { setUser } = useAppContext();
    const navigate = useNavigate();
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [loginForm] = Form.useForm();
    const carouselRef = useRef<any>(null);

    const handleLogin = async (values: { email: string; password: string }) => {
        // Reuse existing login logic
        setUser({
            id: '1',
            name: 'John Doe',
            email: values.email,
            role: 'investor',
            customerId: 'I4829'
        });
        setLoginModalVisible(false);
        navigate('/dashboard');
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const getPlanFeatures = (plan: InvestmentPlan) => {
        const features = [];
        if (plan.duration <= 3) {
            features.push('Quick returns', 'Low risk investment', 'Flexible amount', 'Digital bond issued');
        } else if (plan.duration === 6) {
            features.push('High returns', 'Best value', 'Recommended plan', 'Digital bond issued');
        } else {
            features.push('Maximum returns', 'Long term growth', 'Wealth building', 'Digital bond issued');
        }
        return features;
    };

    const carouselImages = [
        {
            src: '/images/growth.png',
            title: 'Grow Your Wealth',
            description: 'Watch your investments flourish with guaranteed returns'
        },
        {
            src: '/images/trading.png',
            title: 'Smart Investment Platform',
            description: 'Advanced tools and real-time tracking for your portfolio'
        },
        {
            src: '/images/nature.jpg',
            title: 'Sustainable Growth',
            description: 'Building a secure financial future for generations'
        }
    ];

    return (
        <div className="landing-page-wrapper">
            {/* Hero Section */}
            <section className="hero-v3">
                <div className="hero-v3-overlay" />
                <div className="hero-v3-content">
                    <Title className="hero-title-v3">
                        Secure Your Financial Future
                    </Title>
                    <Text className="hero-subtitle-v3">
                        Invest with confidence. Earn guaranteed returns.
                    </Text>
                    <div className="hero-btns-v3">
                        <Button className="btn-hero-primary" onClick={openRegister}>
                            Get Started
                        </Button>
                        <Button
                            className="btn-hero-ghost"
                            onClick={() => scrollToSection('plans')}
                        >
                            View Plans
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="section-padding bg-warm-gray">
                <div className="dashboard-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Title level={2} className="dashboard-logo-text" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Why Choose INRFS?</Title>
                        <div className="section-underline" />
                    </div>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={8}>
                            <div className="feature-card-v3">
                                <div className="feature-icon-wrapper">
                                    <SafetyOutlined />
                                </div>
                                <Title level={4}>Secure & Regulated</Title>
                                <Paragraph type="secondary">
                                    Your investments are protected with bank-grade security and full regulatory compliance.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="feature-card-v3">
                                <div className="feature-icon-wrapper">
                                    <RiseOutlined />
                                </div>
                                <Title level={4}>Guaranteed Returns</Title>
                                <Paragraph type="secondary">
                                    Earn fixed returns with transparent calculations and no hidden fees.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="feature-card-v3">
                                <div className="feature-icon-wrapper">
                                    <FileTextOutlined />
                                </div>
                                <Title level={4}>Digital Bonds</Title>
                                <Paragraph type="secondary">
                                    Receive instant digital bonds for all your investments with complete documentation.
                                </Paragraph>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="section-padding" style={{ backgroundColor: '#fff' }}>
                <div className="dashboard-container">
                    <Row gutter={[64, 64]} align="middle">
                        <Col xs={24} lg={12}>
                            <Title level={4} style={{ color: 'var(--accent-color)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px', marginBottom: '16px' }}>About INRFS</Title>
                            <Title level={2} style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>Empowering Your Wealth Building Journey</Title>
                            <Paragraph style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.8, marginBottom: '32px' }}>
                                INRFS (Institutional Returns & Financial Security) was founded on the principle that high-grade investment opportunities should be accessible to everyone. Our mission is to bridge the gap between institutional asset management and individual investors through technology and transparency.
                            </Paragraph>
                            <Row gutter={[32, 32]}>
                                <Col span={12}>
                                    <Space size="middle">
                                        <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                            <TeamOutlined style={{ fontSize: '24px', color: 'var(--primary-color)' }} />
                                        </div>
                                        <div>
                                            <Title level={5} style={{ margin: 0 }}>Expert Team</Title>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>Decades of fund management</Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={12}>
                                    <Space size="middle">
                                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                            <GlobalOutlined style={{ fontSize: '24px', color: 'var(--accent-color)' }} />
                                        </div>
                                        <div>
                                            <Title level={5} style={{ margin: 0 }}>Global Assets</Title>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>Diversified across markets</Text>
                                        </div>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card className="stat-card-refined" style={{ padding: '40px', background: 'var(--bg-light)', border: 'none' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '32px' }}>
                                        <HeartOutlined style={{ fontSize: '48px', color: 'var(--coral-red)' }} />
                                    </div>
                                    <Title level={3}>Our Core Values</Title>
                                    <Space direction="vertical" size="large" style={{ marginTop: '24px', textAlign: 'left', width: '100%' }}>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <CheckCircleFilled style={{ color: 'var(--accent-color)', marginTop: '4px' }} />
                                            <div>
                                                <Text strong>Transparency First</Text>
                                                <Paragraph type="secondary" style={{ margin: 0, fontSize: '13px' }}>Real-time tracking of every dollar invested.</Paragraph>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <CheckCircleFilled style={{ color: 'var(--accent-color)', marginTop: '4px' }} />
                                            <div>
                                                <Text strong>Guaranteed Solvency</Text>
                                                <Paragraph type="secondary" style={{ margin: 0, fontSize: '13px' }}>Capital reserves maintained at 120% of liabilities.</Paragraph>
                                            </div>
                                        </div>
                                    </Space>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Investment Plans Section */}
            {/* Investment Plans Section */}
            <section id="plans" className="plans-section-final">
                <div className="dashboard-container">
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <Title
                            level={2}
                            style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: 8 }}
                        >
                            Investment Plans
                        </Title>
                        <p style={{ color: "#6b7280", fontSize: "15px", margin: 0 }}>
                            Choose a plan that fits your investment horizon.
                        </p>
                    </div>

                    <Row gutter={[24, 24]} justify="center">
                        {INVESTMENT_PLANS.map((plan) => {
                            const getFeatures = (duration: number) => {
                                if (duration === 1) return ["Quick returns", "Low risk", "Flexible amount"];
                                if (duration === 3) return ["Better returns", "Balanced risk", "Popular choice"];
                                if (duration === 6) return ["High returns", "Best value", "Recommended"];
                                return ["Maximum returns", "Long term", "Wealth building"];
                            };

                            const isPopular = plan.duration === 6;

                            function handleInvestInPlan(plan: InvestmentPlan): void {
                                throw new Error('Function not implemented.');
                            }

                            return (
                                <Col xs={24} sm={12} lg={6} key={plan.id}>
                                    <Card
                                        bordered={false}
                                        className={`plan-card-final ${isPopular ? "plan-card-featured-final" : ""
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="popular-badge-final">POPULAR</div>
                                        )}

                                        <div className="plan-name-final">{plan.name}</div>

                                        <div className="plan-roi-final">{plan.roi}% Returns</div>

                                        <ul className="plan-features-final">
                                            {getFeatures(plan.duration).map((feature, idx) => (
                                                <li key={idx}>
                                                    <CheckCircleFilled />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            block
                                            className="invest-btn-final"
                                            onClick={() => handleInvestInPlan(plan)}
                                        >
                                            Invest Now
                                        </Button>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            </section>



            {/* Dark Footer -> Now Light Green Accented Deep Green */}
            <footer className="footer-dark-main">
                <div className="dashboard-container">
                    <Row gutter={[48, 48]} className="footer-top">
                        <Col xs={24} md={8}>
                            <div className="footer-brand">
                                <Logo size={40} light />
                                <Paragraph className="footer-brand-desc">
                                    Secure your financial future with institutional-grade returns and transparent, asset-backed investment plans.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col xs={12} md={5}>
                            <Title level={5} className="footer-col-title">Quick Links</Title>
                            <ul className="footer-links-list">
                                <li><a href="#about" onClick={() => scrollToSection('about')}>About Us</a></li>
                                <li><a href="#plans" onClick={() => scrollToSection('plans')}>Investment Plans</a></li>
                                <li><Link to="/">How It Works</Link></li>
                                <li><Link to="/">Contact</Link></li>
                            </ul>
                        </Col>
                        <Col xs={12} md={5}>
                            <Title level={5} className="footer-col-title">Legal</Title>
                            <ul className="footer-links-list">
                                <li><Link to="/">Terms & Conditions</Link></li>
                                <li><Link to="/">Privacy Policy</Link></li>
                                <li><Link to="/">Regulatory Compliance</Link></li>
                                <li><Link to="/">Risk Disclosure</Link></li>
                            </ul>
                        </Col>
                        <Col xs={24} md={6}>
                            <Title level={5} className="footer-col-title">Contact Us</Title>
                            <Space direction="vertical" size="middle">
                                <div className="footer-contact-item">
                                    <MailOutlined style={{ color: 'var(--accent-color)' }} />
                                    <Text style={{ color: 'inherit' }}>support@inrfs.com</Text>
                                </div>
                                <div className="footer-contact-item">
                                    <PhoneOutlined style={{ color: 'var(--accent-color)' }} />
                                    <Text style={{ color: 'inherit' }}>+1 800 123 4567</Text>
                                </div>
                                <div className="footer-contact-item">
                                    <EnvironmentOutlined style={{ color: 'var(--accent-color)' }} />
                                    <Text style={{ color: 'inherit' }}>123 Finance Street, NY</Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                    <div className="footer-bottom">
                        <Text style={{ color: 'inherit' }}>© 2024 INRFS. All rights reserved. Regulated by Financial Authority.</Text>
                        <Link to="/admin" className="footer-admin-link">
                            <LockOutlined />
                            <Text style={{ color: 'inherit', fontSize: '12px', marginLeft: '4px' }}>Admin Access</Text>
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Login Modal */}
            <Modal
                title={<Title level={3} style={{ margin: 0 }}>Login to Continue</Title>}
                open={loginModalVisible}
                onCancel={() => setLoginModalVisible(false)}
                footer={null}
                centered
                width={400}
                className="login-modal"
            >
                <Form
                    form={loginForm}
                    layout="vertical"
                    onFinish={handleLogin}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Email or Customer ID"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email or ID' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="john.doe@example.com or I1234"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            className="btn-hero-primary"
                        >
                            Login
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary">Don't have an account? </Text>
                        <Button
                            type="link"
                            onClick={() => {
                                setLoginModalVisible(false);
                                openRegister();
                            }}
                            style={{ padding: 0 }}
                        >
                            Register here
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Landing;
