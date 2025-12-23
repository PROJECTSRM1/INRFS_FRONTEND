import React from 'react';
import { Row, Col, Typography, Card, Button, Space } from 'antd';
import {
    CheckCircleFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { INVESTMENT_PLANS } from '../../data/mockData';
import type { InvestmentPlan } from '../../types';
import '../../styles/theme.css';

const { Title, Text } = Typography;

const InvestmentPlans: React.FC = () => {
    const navigate = useNavigate();

    const handleInvest = (plan: InvestmentPlan) => {
        navigate(`/dashboard/complete-investment/${plan.id}`);
    };

    return (
        <div className="plans-page-wrapper">
            <div className="section-header-centered">
                <Title level={2} className="plans-page-title">Choose Your Investment Plan</Title>
                <Text type="secondary" className="plans-page-subtitle">Select the plan that best fits your financial goals</Text>
            </div>

            <Row gutter={[24, 24]} className="plans-grid-row">
                {INVESTMENT_PLANS.map((plan) => (
                    <Col xs={24} sm={12} lg={6} key={plan.id}>
                        <Card
                            className={`plan-card-v3 ${plan.duration === 6 ? 'plan-card-featured' : ''}`}
                            bordered={false}
                        >
                            {plan.duration === 6 && (
                                <div className="popular-tag-v3">POPULAR</div>
                            )}

                            <div className="plan-card-header-v3">
                                <Title level={4} className="plan-name-themed">{plan.name}</Title>
                            </div>

                            <div className="plan-roi-section">
                                <Title level={2} className="plan-roi-value-v3">{plan.roi}%</Title>
                                <Text type="secondary">Returns in {plan.duration * 30} days</Text>
                            </div>

                            <div className="plan-features-section">
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div className="feature-item-compact">
                                        <CheckCircleFilled className="feature-icon-green" />
                                        <Text>{plan.duration <= 3 ? 'Quick returns' : plan.duration === 6 ? 'High returns' : 'Maximum returns'}</Text>
                                    </div>
                                    <div className="feature-item-compact">
                                        <CheckCircleFilled className="feature-icon-green" />
                                        <Text>{plan.duration <= 3 ? 'Low risk investment' : plan.duration === 6 ? 'Best value' : 'Long term growth'}</Text>
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
                                className="register-btn-solid"
                                style={{ height: '48px', borderRadius: '12px', background: 'var(--accent-color)' }}
                                onClick={() => handleInvest(plan)}
                            >
                                Select Plan
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default InvestmentPlans;
