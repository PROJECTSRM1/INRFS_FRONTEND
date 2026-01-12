import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    TeamOutlined,
    RiseOutlined,
    DollarCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import type { TooltipProps } from 'recharts';
import { fetchAdminDashboardById } from "../../utils/fetchAdminDashboardById";
import '../../styles/admin.css';

const { Title, Text } = Typography;

interface ChartDataItem {
    name: string;
    value: number;
    count: number;
}

interface PieDataItem {
    name: string;
    value: number;
    count: number;
    duration: string;
}

const CustomTooltip = ({ active, payload, label, period }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={`dashboard-tooltip ${period.toLowerCase()}`}>
                <p className="label">{label}</p>
                <p className="intro">
                    Invested: <span className="value">₹{payload[0].value?.toLocaleString()}K</span>
                </p>
                <p className="desc">
                    Investors: <span className="value">{payload[0].payload.count}</span>
                </p>
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload, period }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0];
        return (
            <div className={`dashboard-tooltip ${period.toLowerCase()}`}>
                <p className="label">{d.name}</p>
                <p className="intro">
                    Amount: <span className="value">₹{(d.value/1000).toFixed(0)}K</span>
                </p>
                <p className="desc">
                    Investors: <span className="value">{d.payload.count}</span>
                </p>
            </div>
        );
    }
    return null;
};

const AdminOverview: React.FC = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('Monthly');
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState({
        totalInvestors: 0,
        activeInvestments: 0,
        totalInvested: 0,
        interestPayable: 0,
    });

    const [pieData, setPieData] = useState<PieDataItem[]>([]);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const planType =
                    period.toLowerCase() === "monthly" ? 1 :
                    period.toLowerCase() === "quarterly" ? 2 :
                    period.toLowerCase() === "half-yearly" ? 3 :
                    period.toLowerCase() === "yearly" ? 4 : 5;

                const data = await fetchAdminDashboardById(planType);

                if (!data) {
                    message.error("Failed to load dashboard data");
                    return;
                }

                setStats({
                    totalInvestors: data.summary?.total_investors || 0,
                    activeInvestments: data.summary?.active_investments || 0,
                    totalInvested: data.summary?.total_invested || 0,
                    interestPayable: data.summary?.interest_payable || 0,
                });

                if (data.plan_distribution) {
                    setPieData(
                        data.plan_distribution.map((p:any) => ({
                            name: p.plan_type,
                            value: p.investment_count,
                            count: p.investment_count,
                            duration: p.duration
                        }))
                    );
                }

                const selectedTrend = data.plan_distribution || [];

                setChartData(
                    selectedTrend.map((t:any) => ({
                        name: t.duration,
                        value: (t.investment_count || 0),
                        count: t.investment_count || 0,
                    }))
                );

                console.log("Dashboard API Response:", data);
                console.log("Trend used for chart:", selectedTrend);

            } catch (err) {
                console.error("Dashboard Load Error:", err);
                message.error("An error occurred while loading dashboard data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [period]);

    const periods = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'];

    return (
        <div className="dashboard-fixed-container">
            <Spin spinning={loading} tip="Loading Dashboard Data..." size="large">

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

                <div className="dashboard-stats-row">
                    <Row gutter={[16, 16]} className="h-100">

                        <Col xs={24} md={6} className="h-100">
                            <Card className="fintech-stat-card compact clickable-stat-card" bordered={false}
                                onClick={() => navigate('/admin/investors')}>
                                <div className="stat-card-header compact">
                                    <div className="stat-icon-box blue compact"><TeamOutlined /></div>
                                    <div className="stat-percent green">+15%</div>
                                </div>
                                <div className="stat-info-compact">
                                    <Text className="stat-label">Total Investors</Text>
                                    <Title level={2} className="stat-value compact">{stats.totalInvestors.toLocaleString()}</Title>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={6} className="h-100">
                            <Card className="fintech-stat-card compact clickable-stat-card" bordered={false}
                                onClick={() => navigate('/admin/investments', { state: { defaultStatus: 'Active' } })}>
                                <div className="stat-card-header compact">
                                    <div className="stat-icon-box green compact"><RiseOutlined /></div>
                                    <div className="stat-percent green">+22%</div>  {/* green percent back */}
                                </div>
                                <div className="stat-info-compact">
                                    <Text className="stat-label">Active Investments</Text>
                                    <Title level={2} className="stat-value compact">{stats.activeInvestments.toLocaleString()}</Title>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={6} className="h-100">
                            <Card className="fintech-stat-card compact clickable-stat-card" bordered={false}
                                onClick={() => navigate('/admin/investments')}>
                                <div className="stat-card-header compact">
                                    <div className="stat-icon-box purple compact"><DollarCircleOutlined /></div>
                                    <div className="stat-percent green">+18%</div>
                                </div>
                                <div className="stat-info-compact">
                                    <Text className="stat-label">Total Invested</Text>
                                    <Title level={2} className="stat-value compact">₹{(stats.totalInvested / 1000000).toFixed(1)}M</Title>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={6} className="h-100">
                            <Card className="fintech-stat-card compact clickable-stat-card" bordered={false}>
                                <div className="stat-card-header compact">
                                    <div className="stat-icon-box orange compact"><HistoryOutlined /></div>
                                    <div className="stat-percent green">+12%</div>
                                </div>
                                <div className="stat-info-compact">
                                    <Text className="stat-label">Interest Payable</Text>
                                    <Title level={2} className="stat-value compact">₹{(stats.interestPayable / 1000000).toFixed(1)}M</Title>
                                </div>
                            </Card>
                        </Col>

                    </Row>
                </div>

                <div className="dashboard-main-content">
                    <Row gutter={[16, 16]}>

                        <Col xs={24} lg={16} className="h-100">
                            <Card className="fintech-chart-card dashboard-card-container" bordered={false}>
                                <div className="chart-card-header compact">
                                    <Title level={5} className="chart-title">Investment Trend</Title>
                                    <Text className="chart-period-label">{period.toLowerCase()}</Text>
                                </div>
                                <div className="chart-box">
                                    <ResponsiveContainer width="100%" height={260}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis tickFormatter={(v) => `₹${v}K`} />
                                            <Tooltip content={<CustomTooltip period={period} />} />
                                            <Line type="monotone" dataKey="value" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8} className="h-100">
                            <Card className="fintech-chart-card dashboard-card-container" bordered={false}>
                                <div className="chart-card-header compact">
                                    <Title level={5} className="chart-title">Tenure Distribution</Title>
                                    <Text className="chart-period-label">{period.toLowerCase()}</Text>
                                </div>
                                <div className="pie-responsive-container">
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                                {pieData.map((_, i) => (
                                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip period={period} />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </Col>

                    </Row>
                </div>

            </Spin>
        </div>
    );
};

export default AdminOverview;
