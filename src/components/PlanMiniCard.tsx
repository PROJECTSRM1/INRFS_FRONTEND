import React from 'react';
import { Card, Typography, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import type { InvestmentPlan } from '../types';
import '../styles/theme.css';

const { Title, Text } = Typography;

interface PlanMiniCardProps {
    plan: InvestmentPlan;
    onInvest: (plan: InvestmentPlan) => void;
    isPopular?: boolean;
}

const PlanMiniCard: React.FC<PlanMiniCardProps> = ({ plan, onInvest, isPopular }) => {
    return (
        <Card
            className={`plan-mini-card-v3 ${isPopular ? 'popular-glow' : ''}`}
            bordered={false}
        >
            {isPopular && <div className="popular-tag-v3">POPULAR</div>}

            <div className="plan-mini-card-header">
                <Text className="plan-tagline">{plan.name}</Text>
                <div className="plan-roi-display">
                    <Title level={2} className="plan-roi-value">
                        {plan.roi}%
                        <Text className="plan-roi-label">Returns</Text>
                    </Title>
                    <Text type="secondary">In {plan.duration * 30} days</Text>
                </div>
            </div>

            <div className="plan-highlights-container">
                {plan.highlights.map((h, i) => (
                    <div key={i} className="plan-highlight-item">
                        <CheckCircleFilled className="highlight-icon-green" />
                        <Text className="highlight-text">{h}</Text>
                    </div>
                ))}
            </div>

            <Button
                type="primary"
                block
                size="large"
                onClick={() => onInvest(plan)}
                className="btn-hero-primary"
                style={{ height: '44px', marginTop: 'auto', borderRadius: '8px' }}
            >
                Select Plan
            </Button>
        </Card>
    );
};

export default PlanMiniCard;
