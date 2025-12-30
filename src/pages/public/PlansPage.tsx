import React from 'react';
import { Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import PlanMiniCard from '../../components/PlanMiniCard';
import { INVESTMENT_PLANS } from '../../data/mockData';
import '../../styles/theme.css';

const { Title, Text } = Typography;

const PlansPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="section-padding plans-page-container">
            <div className="plans-page-header">
                <Title level={1} className="plans-page-title">Choose Your Investment Plan</Title>
                <Text type="secondary" className="plans-page-subtitle">
                    Select the plan that best fits your financial goals
                </Text>
            </div>

            <div className="plans-page-content">
                <Row gutter={[24, 24]}>
                    {INVESTMENT_PLANS.map((plan, idx) => (
                        <Col xs={24} sm={12} lg={6} key={plan.id}>
                            <PlanMiniCard
                                plan={plan}
                                onInvest={() => navigate(`/dashboard`)}
                                isPopular={idx === 2} // 6 Month plan as popular
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default PlansPage;
