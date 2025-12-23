import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
import '../../styles/auth.css';

const { Title, Text } = Typography;

const RoleSelection: React.FC = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'investor',
            title: 'Investor Login',
            description: 'Manage your portfolio and track investments',
            icon: <UserOutlined />,
            path: '/auth/login?role=investor'
        },
        {
            id: 'vendor',
            title: 'Vendor (Lender) Login',
            description: 'Access the lender portal for business tools',
            icon: <ShopOutlined />,
            path: '/auth/login?role=vendor'
        }
    ];

    return (
        <Row gutter={[24, 24]} style={{ maxWidth: '800px', width: '100%' }}>
            {roles.map((role) => (
                <Col xs={24} sm={12} key={role.id}>
                    <Card
                        hoverable
                        className="role-selection-card"
                        onClick={() => navigate(role.path)}
                    >
                        <div className="role-icon-wrapper">
                            {role.icon}
                        </div>
                        <Title level={4}>{role.title}</Title>
                        <Text type="secondary">{role.description}</Text>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default RoleSelection;
