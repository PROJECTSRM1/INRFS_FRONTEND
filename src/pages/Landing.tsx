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
import '../styles/landing.css';


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
                    <div className="landing-centered-heading">
                        <Title level={2} className="dashboard-logo-text landing-large-title">Why Choose INRFS?</Title>
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
            <section id="about" className="section-padding landing-white-bg">
                <div className="dashboard-container">
                    <Row gutter={[64, 64]} align="middle">
                        <Col xs={24} lg={12}>
                            <Title level={4} className="about-accent-text">About INRFS</Title>
                            <Title level={2} className="about-main-title">Empowering Your Wealth Building Journey</Title>
                            <Paragraph className="about-desc-text">
                                INRFS (Institutional Returns & Financial Security) was founded on the principle that high-grade investment opportunities should be accessible to everyone. Our mission is to bridge the gap between institutional asset management and individual investors through technology and transparency.
                            </Paragraph>
                            <Row gutter={[32, 32]}>
                                <Col span={12}>
                                    <Space size="middle">
                                        <div className="feature-icon-box-blue">
                                            <TeamOutlined className="feature-icon-blue" />
                                        </div>
                                        <div>
                                            <Title level={5} className="feature-title-compact">Expert Team</Title>
                                            <Text type="secondary" className="feature-subtext-small">Decades of fund management</Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={12}>
                                    <Space size="middle">
                                        <div className="feature-icon-box-green">
                                            <GlobalOutlined className="feature-icon-green-alt" />
                                        </div>
                                        <div>
                                            <Title level={5} className="feature-title-compact">Global Assets</Title>
                                            <Text type="secondary" className="feature-subtext-small">Diversified across markets</Text>
                                        </div>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card className="stat-card-refined about-stat-card">
                                <div className="about-card-centered">
                                    <div className="about-card-icon-wrapper">
                                        <HeartOutlined className="about-card-icon-coral" />
                                    </div>
                                    <Title level={3}>Our Core Values</Title>
                                    <Space direction="vertical" size="large" className="about-card-check-list">
                                        <div className="about-card-check-item">
                                            <CheckCircleFilled className="about-card-check-icon" />
                                            <div>
                                                <Text strong>Transparency First</Text>
                                                <Paragraph type="secondary" className="about-card-check-desc">Real-time tracking of every dollar invested.</Paragraph>
                                            </div>
                                        </div>
                                        <div className="about-card-check-item">
                                            <CheckCircleFilled className="about-card-check-icon" />
                                            <div>
                                                <Text strong>Guaranteed Solvency</Text>
                                                <Paragraph type="secondary" className="about-card-check-desc">Capital reserves maintained at 120% of liabilities.</Paragraph>
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
                    <div className="plans-header-centered">
                        <Title level={2} className="plans-main-title">
                            Investment Plans
                        </Title>
                        <p className="plans-main-subtitle">
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
                                    <MailOutlined className="footer-contact-icon" />
                                    <Text className="footer-contact-text">support@inrfs.com</Text>
                                </div>
                                <div className="footer-contact-item">
                                    <PhoneOutlined className="footer-contact-icon" />
                                    <Text className="footer-contact-text">+1 800 123 4567</Text>
                                </div>
                                <div className="footer-contact-item">
                                    <EnvironmentOutlined className="footer-contact-icon" />
                                    <Text className="footer-contact-text">123 Finance Street, NY</Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                    <div className="footer-bottom">
                        <Text className="footer-bottom-text">© 2024 INRFS. All rights reserved. Regulated by Financial Authority.</Text>
                        <Link to="/admin" className="footer-admin-link">
                            <LockOutlined />
                            <Text className="footer-admin-text">Admin Access</Text>
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
                            className="register-btn-solid register-btn-solid-override"
                            onClick={() => navigate('/dashboard')}
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
