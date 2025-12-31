import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Modal, Typography, Card, Spin, message } from 'antd';
import {
    SafetyCertificateOutlined,
    RocketOutlined,
    LineChartOutlined,
    WalletOutlined,
    PlayCircleOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    BankOutlined,
    MobileOutlined,
    FundProjectionScreenOutlined,
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { plansService } from '../services/plansService';
import type { Plan } from '../services/plansService';
import '../styles/landing.css';

// Using local paths to generated images. 
// In a real scenario, these would be moved to assets, but direct import works for vite if in src
// Assuming the images are available via URL or imported. 
// For now, I will use the paths provided in the artifact generation step if possible, or placeholder if needed.
// IMPORTANT: I must use the absolute path or move them. 
// Since I can't move them easily without a tool, I will assume they are in assets or use the file:// protocol if valid, 
// but for a web app, they should be in public or imported.
// I'll use placeholders that look like the generated images for now to ensure it runs, 
// OR I will assume the user has placed them. 
// Actually, I can use the `import` statement if I knew where they were. 
// I will use a placeholder service for stability, but describe the generated images.

const { Title, Text, Paragraph } = Typography;

interface PublicLayoutContext {
    openRegister: () => void;
    openLogin: () => void;
}

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const { openRegister, openLogin } = useOutletContext<PublicLayoutContext>();

    // Modal States
    const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    // Plans State
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch plans from API on component mount
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const fetchedPlans = await plansService.getPlans();
                // Filter only active plans
                const activePlans = fetchedPlans.filter(plan => plan.is_active);
                setPlans(activePlans);
            } catch (error) {
                console.error('Failed to fetch plans:', error);
                message.error('Failed to load investment plans. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Mapping plans to card colors and icons for the design
    const getCardStyle = (index: number) => {
        const styles = ['card-bg-1', 'card-bg-2', 'card-bg-3', 'card-bg-4'];
        return styles[index % styles.length];
    };

    const getIcon = (index: number) => {
        const icons = [
            <SafetyCertificateOutlined />,
            <RocketOutlined />,
            <LineChartOutlined />,
            <WalletOutlined />
        ];
        return icons[index % icons.length];
    };

    return (
        <div className="landing-container">
            {/* Navbar */}
            {/* Navbar */}
            <nav className="aesth-navbar animate-fade-in">
                <div className="nav-brand">
                    <img src="/infrs-logo.png" alt="INFRS" style={{ height: 40 }} />
                </div>

                <div className="nav-links">
                    <button className="nav-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
                    <button className="nav-link-btn" onClick={() => setIsPlansModalOpen(true)}>Plans</button>
                    <button className="nav-link-btn" onClick={() => setIsAboutModalOpen(true)}>About</button>
                </div>

                <div className="nav-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button className="btn-pill outline small" onClick={openLogin}>Login</button>
                    <button className="btn-pill primary small" onClick={openRegister} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                        Register
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="section-container hero-section animate-fade-in">
                <div className="hero-content">
                    <div className="hero-tag">
                        <BankOutlined /> Investment Platform
                    </div>
                    <h1 className="hero-title">
                        Your Wealth Journey, <br />
                        Simplified.
                    </h1>
                    <h2 className="hero-subtitle">
                        Growth. Security. Confidence.
                    </h2>
                    <p className="hero-desc">
                        Experience data-driven investment strategies tailored to your financial goals.
                        Secure, transparent, and high-yield opportunities all in one place.
                    </p>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <button className="btn-pill primary" onClick={openLogin}>
                            Start Investing <ArrowRightOutlined />
                        </button>
                    </div>
                </div>
                <div className="hero-image-wrapper">
                    {/* Using the generated image logic conceptually here. */}
                    <img
                        src="/hero-growth.png"
                        alt="Financial Growth"
                        className="hero-img"
                    />
                </div>
            </section>

            {/* Banner Section */}
            <section className="banner-section animate-fade-in">
                <h2 className="banner-title">
                    Experience the Future of <br />
                    Smart Investing in Action
                </h2>
                <p className="banner-desc">
                    Get a firsthand look at how INFRS transforms wealth management.
                    Explore seamless portfolio tracking, expert advisory, and real-time
                    analytics—all in one intuitive platform.
                </p>
                <div className="banner-actions">
                    <button className="btn-pill" onClick={openLogin}>
                        <PlayCircleOutlined /> Investor Workflow
                    </button>
                    <button className="btn-pill" onClick={() => navigate('/admin/login')}>
                        <PlayCircleOutlined /> Admin Workflow
                    </button>
                </div>
            </section>

            {/* Services / Plans Grid */}
            <section className="section-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Spin size="large" tip="Loading investment plans..." />
                    </div>
                ) : (
                    <div className="features-grid">
                        {plans.map((plan: Plan, index: number) => (
                            <div key={plan.id} className={`feature-card ${getCardStyle(index)}`}>
                                <div>
                                    <div className="feature-icon">
                                        {getIcon(index)}
                                    </div>
                                    <h3 className="feature-title">{plan.name}</h3>
                                    <p className="feature-desc">{plan.description}</p>
                                </div>
                                <div style={{ marginTop: 24 }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary-gold-dark)', fontSize: '1.5rem' }}>
                                        {plan.returns_percentage}% <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>ROI</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                        Duration: {plan.duration_months} Months
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Mobile App Section */}
            <section className="section-container mobile-showcase">
                <div className="features-list left">
                    <div className="feature-item">
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className="feature-icon-circle"><FundProjectionScreenOutlined /></div>
                        </div>
                        <h3>Smart Analytics</h3>
                        <p>Real-time insights into your portfolio performance.</p>
                    </div>
                    <div className="feature-item">
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className="feature-icon-circle"><SafetyCertificateOutlined /></div>
                        </div>
                        <h3>Bank-Grade Security</h3>
                        <p>Your assets are protected by industry-leading encryption.</p>
                    </div>
                </div>

                <div className="app-mockup-wrapper">
                    <img
                        src="/app-mockup.png"
                        alt="Mobile App"
                        className="app-mockup"
                    />
                </div>

                <div className="features-list right">
                    <div className="feature-item">
                        <div className="feature-icon-circle"><MobileOutlined /></div>
                    </div>
                    <h3>On-the-Go Access</h3>
                    <p>Manage your investments anytime, anywhere.</p>
                    <div className="feature-item">
                        <div className="feature-icon-circle"><CheckCircleFilled /></div>
                        <h3>Instant Settlements</h3>
                        <p>Quick and hassle-free withdrawals to your account.</p>
                    </div>
                </div>
            </section>

            {/* Rich Footer */}
            <footer className="aesth-footer">
                <div className="section-container footer-content">
                    <div className="footer-brand">
                        <div className="nav-brand" style={{ marginBottom: 16 }}>
                            <img src="/infrs-logo.png" alt="INFRS" style={{ height: 40 }} />
                        </div>
                        <p className="footer-desc">
                            Your trusted partner in decentralized wealth management. Secure, transparent, and built for growth.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon"><FacebookOutlined /></a>
                            <a href="#" className="social-icon"><TwitterOutlined /></a>
                            <a href="#" className="social-icon"><InstagramOutlined /></a>
                            <a href="#" className="social-icon"><LinkedinOutlined /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-heading">Company</h4>
                        <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</a>
                        <a href="#" onClick={() => setIsAboutModalOpen(true)}>About Us</a>
                        <a href="#" onClick={() => setIsPlansModalOpen(true)}>Investments</a>
                        <a href="#">Careers</a>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-heading">Resources</h4>
                        <a href="#">Help Center</a>
                        <a href="#">Market Analysis</a>
                        <a href="#">Security</a>
                        <a href="#">Terms of Service</a>
                    </div>

                    <div className="footer-contact">
                        <h4 className="footer-heading">Contact Us</h4>
                        <div className="contact-item">
                            <MailOutlined /> <span>support@infrs.com</span>
                        </div>
                        <div className="contact-item">
                            <PhoneOutlined /> <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="contact-item">
                            <EnvironmentOutlined /> <span>123 Finance District, New York, NY</span>
                        </div>
                    </div>
                </div>
                {/* <div className="footer-bottom">
                    <p>&copy; 2024 INFRS Investment Platform. All rights reserved.</p>
                </div> */}
            </footer>
            {/* Modals */}
            <Modal
                title="Investment Plans"
                open={isPlansModalOpen}
                onCancel={() => setIsPlansModalOpen(false)}
                footer={null}
                width={800}
                centered
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', padding: '16px 0' }}>
                    {plans.map((plan: Plan, index: number) => (
                        <Card key={plan.id} bordered={false} className={`feature-card ${getCardStyle(index)}`} style={{ padding: 16 }}>
                            <Title level={4} style={{ margin: 0 }}>{plan.name}</Title>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-gold-dark)', margin: '12px 0' }}>
                                {plan.returns_percentage}% ROI
                            </div>
                            <Paragraph ellipsis={{ rows: 2 }}>{plan.description}</Paragraph>
                            <div style={{ marginTop: 8 }}>
                                <div style={{ float: 'right' }}>{plan.duration_months} Month(s)</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Modal>

            <Modal
                title="About INFRS"
                open={isAboutModalOpen}
                onCancel={() => setIsAboutModalOpen(false)}
                footer={null}
                width={600}
                centered
            >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ width: 60, height: 60, background: 'var(--primary-gold)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BankOutlined style={{ fontSize: 30, color: 'white' }} />
                    </div>
                    <Title level={3}>Empowering Your Financial Growth</Title>
                    <Paragraph>
                        INFRS is a leading decentralized investment platform committed to providing secure, high-yield investment opportunities.
                        Our mission is to democratize access to institutional-grade wealth management strategies.
                    </Paragraph>
                    <Paragraph>
                        With state-of-the-art security, real-time analytics, and a user-centric approach, we ensure your assets work harder for you.
                    </Paragraph>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ margin: 0, color: 'var(--primary-gold-dark)' }}>$12M+</Title>
                            <Text>Assets Managed</Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ margin: 0, color: 'var(--primary-gold-dark)' }}>1.2K+</Title>
                            <Text>Happy Investors</Text>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Landing;
