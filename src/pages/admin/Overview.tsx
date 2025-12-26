import React, { useState } from 'react';
import { Row, Col, Card, List, Typography, Button } from 'antd';
import {
    TeamOutlined,
    RiseOutlined,
    DollarCircleOutlined,
    HistoryOutlined,
    PlusOutlined,
    UserOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_DASHBOARD_STATS, MOCK_ACTIVITY, MOCK_MONTHLY_DATA } from '../../data/mockData';
import '../../styles/admin.css';

const { Title, Text } = Typography;

const AdminOverview: React.FC = () => {
    const stats = MOCK_DASHBOARD_STATS;
    const [period, setPeriod] = useState('Monthly');

    const pieData = [
        { name: '1 Month', value: 400, color: '#926132' },
        { name: '3 Month', value: 300, color: '#10b981' },
        { name: '6 Month', value: 300, color: '#8b5cf6' },
        { name: 'Yearly', value: 200, color: '#f59e0b' },
    ];

    const periods = ['Daily', 'Monthly', 'Quarterly', 'Annually'];

    return (
        <div className="dashboard-content-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Overview</div>
                <div className="header-flex-row">
                    <Title level={1} className="dashboard-main-title">Dashboard Overview</Title>
                    <div className="period-switcher">
                        {periods.map(p => (
                            <Button
                                key={p}
                                type="text"
                                className={`switcher-btn ${period === p ? 'active' : ''}`}
                                onClick={() => setPeriod(p)}
                            >
                                {p}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* NEW Stat Cards Layout */}
            <Row gutter={[24, 24]} className="stats-grid-container mt-24">
                <Col xs={24} md={12} xl={6}>
                    <Card className="fintech-stat-card" bordered={false}>
                        <div className="stat-card-header">
                            <div className="stat-icon-box blue">
                                <TeamOutlined />
                            </div>
                            <div className="stat-percent" style={{ color: '#10b981' }}>
                                +15%
                            </div>
                        </div>
                        <Text className="stat-label">Total Investors</Text>
                        <Title level={2} className="stat-value">{stats.totalInvestors.toLocaleString()}</Title>
                        <Text className="stat-period">Period: monthly</Text>
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card className="fintech-stat-card" bordered={false}>
                        <div className="stat-card-header">
                            <div className="stat-icon-box green">
                                <RiseOutlined />
                            </div>
                            <div className="stat-percent" style={{ color: '#10b981' }}>
                                +22%
                            </div>
                        </div>
                        <Text className="stat-label">Active Investments</Text>
                        <Title level={2} className="stat-value">{stats.activeInvestments.toLocaleString()}</Title>
                        <Text className="stat-period">Period: monthly</Text>
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card className="fintech-stat-card" bordered={false}>
                        <div className="stat-card-header">
                            <div className="stat-icon-box purple">
                                <DollarCircleOutlined />
                            </div>
                            <div className="stat-percent" style={{ color: '#10b981' }}>
                                +18%
                            </div>
                        </div>
                        <Text className="stat-label">Total Invested</Text>
                        <Title level={2} className="stat-value">₹{(stats.totalInvested / 1000000).toFixed(1)}M</Title>
                        <Text className="stat-period">Period: monthly</Text>
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card className="fintech-stat-card" bordered={false}>
                        <div className="stat-card-header">
                            <div className="stat-icon-box orange">
                                <HistoryOutlined />
                            </div>
                            <div className="stat-percent" style={{ color: '#10b981' }}>
                                +12%
                            </div>
                        </div>
                        <Text className="stat-label">Interest Payable</Text>
                        <Title level={2} className="stat-value">₹{(stats.interestPayable / 1000000).toFixed(1)}M</Title>
                        <Text className="stat-period">Period: monthly</Text>
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[24, 24]} className="mt-24">
                <Col xs={24} xl={14}>
                    <Card className="fintech-chart-card" bordered={false} bodyStyle={{ padding: 0 }}>
                        <div className="chart-card-header">
                            <Title level={5} className="chart-title">Investment Trend</Title>
                            <Text className="chart-period-label">monthly</Text>
                        </div>
                        <div className="chart-responsive-container padded">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={MOCK_MONTHLY_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        tickFormatter={(val) => `₹${val}K`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#f24c52"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#f24c52', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} xl={10}>
                    <Card className="fintech-chart-card" bordered={false} bodyStyle={{ padding: 0 }}>
                        <div className="chart-card-header">
                            <Title level={5} className="chart-title">Investment by Tenure</Title>
                            <Text className="chart-period-label">monthly</Text>
                        </div>
                        <div className="pie-responsive-container high">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="pie-legend-container horizontal">
                            {pieData.map((item: any) => (
                                <div key={item.name} className="flex-align-center">
                                    <div className="legend-dot" style={{ background: item.color }}></div>
                                    <Text style={{ fontSize: 12, color: '#64748b' }}>{item.name}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity Section */}
            <div className="mt-32">
                <Title level={4} className="mb-16" style={{ fontWeight: 700 }}>Recent Activity</Title>
                <Card bordered={false} className="fintech-list-card" bodyStyle={{ padding: 0 }}>
                    <List
                        dataSource={MOCK_ACTIVITY}
                        renderItem={(item) => (
                            <List.Item className="activity-item-custom">
                                <List.Item.Meta
                                    avatar={
                                        <div className={`activity-icon-container ${item.type === 'New Investment' ? 'investment' : 'user'}`}>
                                            {item.type === 'New Investment' ? <PlusOutlined /> : <UserOutlined />}
                                        </div>
                                    }
                                    title={<Text style={{ fontWeight: 700, fontSize: 15 }}>{item.type}</Text>}
                                    description={<Text type="secondary">{item.description}</Text>}
                                />
                                <Text type="secondary" style={{ fontSize: 12 }}>{item.timestamp}</Text>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;
