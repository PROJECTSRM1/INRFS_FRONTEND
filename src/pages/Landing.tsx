import React, { useState } from 'react';
import { Typography, Button, Row, Col, Space, Card, Modal, Result } from 'antd';
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
    GlobalOutlined
} from '@ant-design/icons';
import { INVESTMENT_PLANS } from '../data/mockData';
import { fintechService } from '../services/fintechService';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/Logo';
import type { InvestmentPlan, Investment } from '../types';
import '../styles/theme.css';

const { Title, Text, Paragraph } = Typography;

interface PublicContext {
    openRegister: () => void;
}

const Landing: React.FC = () => {
    const { openRegister } = useOutletContext<PublicContext>();
    const { addInvestment, investments } = useAppContext();
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInvestInPlan = (plan: InvestmentPlan) => {
        const returnsData = fintechService.calculateReturns(plan.minAmount, plan.roi, plan.duration);

        const dummyInvestment: Investment = {
            id: fintechService.generateInvestmentId(investments.length),
            planId: plan.id,
            planName: plan.name,
            amount: plan.minAmount,
            returns: returnsData.interest,
            maturityAmount: returnsData.maturityAmount,
            tenure: plan.duration,
            status: 'Active',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            startDate: new Date().toISOString(),
            infrcNumber: `${plan.infrcPrefix}-${Math.floor(100000 + Math.random() * 900000)}`
        };

        addInvestment(dummyInvestment);
        setShowSuccess(true);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

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
                        Invest with confidence in diversified portfolios. Earn guaranteed returns with INRFS.
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
                                    Our platform uses bank-grade encryption and is fully compliant with modern financial regulations.
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
                                    We offer fixed-rate investment plans backed by solid institutional assets and prudent risk management.
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
                                    Every investment triggers the immediate issuance of a verifiable digital bond certificate.
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
            <section id="plans" className="section-padding bg-light-gray">
                <div className="dashboard-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Title level={2} style={{ fontSize: '2.5rem', fontWeight: 800 }}>Investment Plans</Title>
                        <div className="section-underline" />
                    </div>
                    <Row gutter={[24, 24]}>
                        {INVESTMENT_PLANS.map((plan) => (
                            <Col xs={24} sm={12} lg={6} key={plan.id}>
                                <Card
                                    className={`plan-card-v3 ${plan.duration === 6 ? 'plan-card-featured' : ''}`}
                                    bordered={false}
                                >
                                    {plan.duration === 6 && (
                                        <div className="popular-tag-v3">POPULAR</div>
                                    )}
                                    <div style={{ marginBottom: '20px' }}>
                                        <Text strong style={{ color: 'var(--primary-color)', fontSize: '13px' }}>{plan.name}</Text>
                                        <Title level={2} style={{ margin: '12px 0 4px', fontWeight: 800 }}>{plan.roi}% Returns</Title>
                                    </div>
                                    <div style={{ marginBottom: '24px' }}>
                                        <Space direction="vertical" size={10} style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <CheckCircleFilled style={{ color: 'var(--accent-color)', fontSize: '12px' }} />
                                                <Text type="secondary" style={{ fontSize: '13px' }}>{plan.duration <= 3 ? 'Quick returns' : 'High returns'}</Text>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <CheckCircleFilled style={{ color: 'var(--accent-color)', fontSize: '12px' }} />
                                                <Text type="secondary" style={{ fontSize: '13px' }}>Low risk coverage</Text>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <CheckCircleFilled style={{ color: 'var(--accent-color)', fontSize: '12px' }} />
                                                <Text type="secondary" style={{ fontSize: '13px' }}>Asset backed</Text>
                                            </div>
                                        </Space>
                                    </div>
                                    <Button
                                        type="primary"
                                        block
                                        className="register-btn-solid"
                                        style={{ height: '44px', borderRadius: '8px', background: 'var(--accent-color)' }}
                                        onClick={() => handleInvestInPlan(plan)}
                                    >
                                        Invest Now
                                    </Button>
                                </Card>
                            </Col>
                        ))}
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
                                <li><Link to="/">About Us</Link></li>
                                <li><Link to="/#plans" onClick={() => scrollToSection('plans')}>Investment Plans</Link></li>
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
                        <Text style={{ color: 'inherit' }}>© 2024 INRFS. All rights reserved. Regulated by Universal Financial Authority.</Text>
                        <Link to="/admin" className="footer-admin-link">
                            <LockOutlined />
                            <Text style={{ color: 'inherit', fontSize: '11px' }}>Admin Portal Access</Text>
                        </Link>
                    </div>
                </div>
            </footer>

            <Modal
                visible={showSuccess}
                onCancel={() => setShowSuccess(false)}
                footer={null}
                centered
            >
                <Result
                    status="success"
                    title="Investment Successful!"
                    subTitle="Login to your dashboard to view your new certificate."
                    extra={[
                        <Button
                            type="primary"
                            key="login"
                            className="register-btn-solid"
                            style={{ background: 'var(--primary-color)' }}
                            onClick={() => navigate('/auth/login')}
                        >
                            Login to Dashboard
                        </Button>
                    ]}
                />
            </Modal>
        </div>
    );
};

export default Landing;
