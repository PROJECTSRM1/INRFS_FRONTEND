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
        <div className="section-padding" style={{ background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <Title level={1} style={{ fontWeight: 800 }}>Choose Your Investment Plan</Title>
                <Text type="secondary" style={{ fontSize: '1.2rem' }}>
                    Select the plan that best fits your financial goals
                </Text>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
