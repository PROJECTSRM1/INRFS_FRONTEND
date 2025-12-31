import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Button, Space, Spin, message } from 'antd';
import {
    CheckCircleFilled,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { plansService } from '../../services/plansService';
import type { Plan } from '../../services/plansService';
import '../../styles/dashboard.css';

const { Title, Text } = Typography;

const InvestmentPlans: React.FC = () => {
    const navigate = useNavigate();

    // State for plans
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

    const handleInvest = (plan: Plan) => {
        navigate(`/dashboard/complete-investment/${plan.id}`);
    };

    return (
        <div className="investor-dashboard-refined">
            <Button
                size="small"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/dashboard')}
                className="btn-back-refined btn-back-margin"
            >
                Back to Dashboard
            </Button>

            <div className="section-header-centered">
                <Title level={2} className="plans-page-title">Choose Your Investment Plan</Title>
                <Text type="secondary" className="plans-page-subtitle">Select the plan that best fits your financial goals</Text>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Spin size="large" tip="Loading investment plans..." />
                </div>
            ) : (
                <Row gutter={[24, 24]} className="plans-grid-row">
                    {plans.map((plan: Plan) => (
                        <Col xs={24} sm={12} lg={6} key={plan.id}>
                            <Card
                                className={`plan-card-v3 ${plan.duration_months === 6 ? 'plan-card-featured' : ''}`}
                                bordered={false}
                            >
                                {plan.duration_months === 6 && (
                                    <div className="popular-tag-v3">POPULAR</div>
                                )}

                                <div className="plan-card-header-v3">
                                    <Title level={4} className="plan-name-themed">{plan.name}</Title>
                                </div>

                                <div className="plan-roi-section">
                                    <Title level={2} className="plan-roi-value-v3">{plan.returns_percentage}%</Title>
                                    <Text type="secondary">Returns in {plan.duration_months * 30} days</Text>
                                </div>

                                <div className="plan-features-section">
                                    <Space direction="vertical" size="middle" className="w-full">
                                        <div className="feature-item-compact">
                                            <CheckCircleFilled className="feature-icon-green" />
                                            <Text>{plan.duration_months <= 3 ? 'Quick returns' : plan.duration_months === 6 ? 'High returns' : 'Maximum returns'}</Text>
                                        </div>
                                        <div className="feature-item-compact">
                                            <CheckCircleFilled className="feature-icon-green" />
                                            <Text>{plan.duration_months <= 3 ? 'Low risk investment' : plan.duration_months === 6 ? 'Best value' : 'Long term growth'}</Text>
                                        </div>
                                        <div className="feature-item-compact">
                                            <CheckCircleFilled className="feature-icon-green" />
                                            <Text>Digital bond issued</Text>
                                        </div>
                                    </Space>
                                </div>

                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    className="plan-select-btn"
                                    onClick={() => handleInvest(plan)}
                                >
                                    Select Plan
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default InvestmentPlans;
