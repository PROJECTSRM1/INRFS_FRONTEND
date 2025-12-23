import React from 'react';
import { Typography, Row, Col, Card, Timeline } from 'antd';
import { RocketOutlined, SafetyOutlined, UsergroupAddOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
    return (
        <div style={{ padding: '60px 50px' }}>
            <Row gutter={[48, 48]} align="middle">
                <Col xs={24} md={12}>
                    <Title level={1}>About InvestPro</Title>
                    <Paragraph style={{ fontSize: '18px' }}>
                        InvestPro is a leading fintech platform dedicated to making wealth management accessible, transparent, and secure for everyone.
                    </Paragraph>
                    <Paragraph>
                        Founded in 2020, we have grown from a small startup to a trusted name in the industry, serving thousands of investors across the globe. Our mission is to empower individuals to achieve financial independence through smart technology and expert insights.
                    </Paragraph>
                </Col>
                <Col xs={24} md={12}>
                    <img src="/vite.svg" alt="About Us" style={{ width: '100%', maxWidth: '500px', display: 'block', margin: '0 auto' }} />
                </Col>
            </Row>

            <Row gutter={[32, 32]} style={{ marginTop: '80px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }}><RocketOutlined /></div>
                        <Title level={4}>Innovation</Title>
                        <Paragraph>Constantly evolving our technology to provide the best tools for our users.</Paragraph>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }}><SafetyOutlined /></div>
                        <Title level={4}>Security</Title>
                        <Paragraph>Your data and assets are protected by top-tier security protocols.</Paragraph>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }}><UsergroupAddOutlined /></div>
                        <Title level={4}>Community</Title>
                        <Paragraph>Join a growing community of informed and successful investors.</Paragraph>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }}><GlobalOutlined /></div>
                        <Title level={4}>Accessibility</Title>
                        <Paragraph>Investing made easy, no matter where you are or what your level of experience is.</Paragraph>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: '80px', maxWidth: '800px', margin: '80px auto 0' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>Our Journey</Title>
                <Timeline
                    mode="alternate"
                    items={[
                        { children: 'InvestPro Founded in 2020' },
                        { children: 'Reached 10,000 active users in 2021', color: 'green' },
                        { children: 'Launched advanced analytics tools in 2022' },
                        { children: 'Expanded to international markets in 2023', color: 'blue' },
                        { children: 'Voted #1 Fintech App for 2024' },
                    ]}
                />
            </div>
        </div>
    );
};

export default AboutPage;
