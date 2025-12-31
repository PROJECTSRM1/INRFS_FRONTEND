import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    TeamOutlined,
    RiseOutlined,
    DollarCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_DASHBOARD_STATS, MOCK_MONTHLY_DATA, MOCK_STATS_BY_PERIOD, MOCK_CHART_DATA_BY_PERIOD, MOCK_PIE_DATA } from '../../data/mockData';
import '../../styles/admin.css';

const { Title, Text } = Typography;

const AdminOverview: React.FC = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('Monthly');

    // Dynamic Data Selection
    const stats = MOCK_STATS_BY_PERIOD[period] || MOCK_DASHBOARD_STATS;
    const chartData = MOCK_CHART_DATA_BY_PERIOD[period] || MOCK_MONTHLY_DATA;

    // Use Mock Data for Pie Logic (Could be dynamic too, but static for now as per requirement)
    const pieData = MOCK_PIE_DATA;

    const periods = ['Daily', 'Monthly', 'Quarterly', 'Annually'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
                    <p className="label" style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{label}</p>
                    <p className="intro" style={{ margin: '4px 0 0', color: '#64748b', fontSize: '12px' }}>
                        Invested: <span style={{ color: '#f24c52', fontWeight: 600 }}>₹{payload[0].value.toLocaleString()}</span>
                    </p>
                    <p className="desc" style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
                        Investors: <span style={{ color: '#0f172a', fontWeight: 600 }}>{payload[0].payload.count}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
                    <p className="label" style={{ margin: 0, fontWeight: 600, color: data.payload.color }}>{data.name}</p>
                    <p className="intro" style={{ margin: '4px 0 0', color: '#64748b', fontSize: '12px' }}>
                        Amount: <span style={{ color: '#0f172a', fontWeight: 600 }}>₹{(data.value / 1000).toFixed(0)}K</span>
                    </p>
                    <p className="desc" style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
                        Investors: <span style={{ color: '#0f172a', fontWeight: 600 }}>{data.payload.count}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-fixed-container">
            {/* Header Section */}
            <div className="dashboard-header-row">
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

            {/* Stats Row - Fixed Height */}
            <div className="dashboard-stats-row">
                <Row gutter={[16, 16]} className="h-100">
                    <Col xs={24} md={6} className="h-100">
                        <Card
                            className="fintech-stat-card compact clickable-stat-card"
                            bordered={false}
                            onClick={() => navigate('/admin/investors')}
                        >
                            <div className="stat-card-header compact">
                                <div className="stat-icon-box blue compact">
                                    <TeamOutlined />
                                </div>
                                <div className="stat-percent">+15%</div>
                            </div>
                            <div className="stat-info-compact">
                                <Text className="stat-label">Total Investors</Text>
                                <Title level={2} className="stat-value compact">{stats.totalInvestors.toLocaleString()}</Title>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={6} className="h-100">
                        <Card
                            className="fintech-stat-card compact clickable-stat-card"
                            bordered={false}
                            onClick={() => navigate('/admin/investments', { state: { defaultStatus: 'Active' } })}
                        >
                            <div className="stat-card-header compact">
                                <div className="stat-icon-box green compact">
                                    <RiseOutlined />
                                </div>
                                <div className="stat-percent">+22%</div>
                            </div>
                            <div className="stat-info-compact">
                                <Text className="stat-label">Active Investments</Text>
                                <Title level={2} className="stat-value compact">{stats.activeInvestments.toLocaleString()}</Title>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={6} className="h-100">
                        <Card
                            className="fintech-stat-card compact clickable-stat-card"
                            bordered={false}
                            onClick={() => navigate('/admin/investments')}
                        >
                            <div className="stat-card-header compact">
                                <div className="stat-icon-box purple compact">
                                    <DollarCircleOutlined />
                                </div>
                                <div className="stat-percent">+18%</div>
                            </div>
                            <div className="stat-info-compact">
                                <Text className="stat-label">Total Invested</Text>
                                <Title level={2} className="stat-value compact">₹{(stats.totalInvested / 1000000).toFixed(1)}M</Title>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={6} className="h-100">
                        <Card
                            className="fintech-stat-card compact clickable-stat-card"
                            bordered={false}
                            onClick={() => navigate('/admin/reports')}
                        >
                            <div className="stat-card-header compact">
                                <div className="stat-icon-box orange compact">
                                    <HistoryOutlined />
                                </div>
                                <div className="stat-percent">+12%</div>
                            </div>
                            <div className="stat-info-compact">
                                <Text className="stat-label">Interest Payable</Text>
                                <Title level={2} className="stat-value compact">₹{(stats.interestPayable / 1000000).toFixed(1)}M</Title>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Main Content Area - Flexible Height */}
            <div className="dashboard-main-content">
                <Row gutter={[16, 16]} className="h-100">
                    {/* Left Column: Trend Chart (Top) + Activity (Bottom) */}
                    <Col xs={24} lg={16} className="flex-col-gap-16">

                        {/* Trend Chart - Flex 1 */}
                        <Card
                            className="fintech-chart-card dashboard-card-container"
                            bordered={false}
                            bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                        >
                            <div className="chart-card-header compact">
                                <Title level={5} className="chart-title">Investment Trend</Title>
                                <Text className="chart-period-label">{period.toLowerCase()}</Text>
                            </div>
                            <div className="chart-responsive-container flex-grow-chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val}K`} dx={-10} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                        <Line type="monotone" dataKey="value" stroke="#f24c52" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    {/* Right Column: Pie Chart (Full Height) */}
                    <Col xs={24} lg={8} className="h-100">
                        <Card
                            className="fintech-chart-card dashboard-card-container"
                            bordered={false}
                            bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                        >
                            <div className="chart-card-header compact">
                                <Title level={5} className="chart-title">Tenure Distribution</Title>
                                <Text className="chart-period-label">{period.toLowerCase()}</Text>
                            </div>
                            <div className="pie-responsive-container flex-grow-pie">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="pie-legend-container horizontal compact">
                                {pieData.map((item: any) => (
                                    <div key={item.name} className="flex-align-center">
                                        <div className="legend-dot" style={{ background: item.color }}></div>
                                        <Text className="text-small-muted">{item.name}</Text>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AdminOverview;
