import React from 'react';
import { Row, Col, Typography, Table, Tag } from 'antd';
import {
    WalletOutlined,
    LineChartOutlined,
    PieChartOutlined,
    FileTextOutlined,
    PlusCircleFilled,
    UnorderedListOutlined,
    CloudDownloadOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import StatMiniCard from '../../components/StatMiniCard';
import { fintechService } from '../../services/fintechService';
import '../../styles/dashboard.css';


const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
    const { user, investments } = useAppContext();
    const navigate = useNavigate();

    const displayInvestments = investments.length > 0 ? investments : [
        { id: 'INV-2024-001', planName: '6 Month Plan', amount: 10000, returns: 1800, status: 'Active', date: 'Jun 15, 2024' },
        { id: 'INV-2024-002', planName: '3 Month Plan', amount: 5000, returns: 600, status: 'Active', date: 'Apr 20, 2024' },
        { id: 'INV-2023-045', planName: 'Yearly Plan', amount: 20000, returns: 4800, status: 'Completed', date: 'Dec 31, 2023' },
    ];

    const columns = [
        {
            title: 'Investment ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text className="table-id-link">{text}</Text>
        },
        {
            title: 'Plan',
            dataIndex: 'planName',
            key: 'planName',
            render: (text: string) => <Text className="table-plan-text">{text}</Text>
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => <Text className="table-amount-text">{fintechService.formatCurrency(val)}</Text>
        },
        {
            title: 'Returns',
            dataIndex: 'returns',
            key: 'returns',
            render: (val: number) => <Text className="table-returns-green">{fintechService.formatCurrency(val)}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'blue'} className="status-tag-v2">
                    {status}
                </Tag>
            )
        },
        {
            title: 'Maturity',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => <Text className="table-date-grey">{text}</Text>
        }
    ];

    return (
        <div className="investor-dashboard-refined">
            {/* Header Section */}
            <div className="welcome-header">
                <div>
                    <Title level={2} className="greeting-text">Welcome Back, <span>{user?.name || 'John Doe'}</span></Title>
                    <div className="id-details">
                        <Text className="id-label">Customer ID: </Text>
                        <Text className="id-highlight">{user?.customerId || 'I4829'}</Text>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <Row gutter={[24, 24]} className="kpi-row">
                <Col xs={24} sm={12} lg={6}>
                    <StatMiniCard
                        title="Total Invested"
                        value="₹45,000"
                        icon={<WalletOutlined />}
                        colorClass="stat-blue"
                        trend="+12.5%"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatMiniCard
                        title="Total Returns"
                        value="₹6,750"
                        icon={<LineChartOutlined />}
                        colorClass="stat-green"
                        trend="+8.2%"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatMiniCard
                        title="Active Investments"
                        value="5"
                        icon={<PieChartOutlined />}
                        colorClass="stat-purple"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatMiniCard
                        title="Digital Bonds"
                        value="8"
                        icon={<FileTextOutlined />}
                        colorClass="stat-orange"
                    />
                </Col>
            </Row>

            {/* Quick Actions - Independent Cards */}
            <div className="quick-actions-section">
                <Title level={4} className="section-header-margin">Quick Actions</Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={6}>
                        <div className="quick-action-card-white" onClick={() => navigate('/dashboard/plans')}>
                            <div className="quick-action-icon">
                                <PlusCircleFilled />
                            </div>
                            <Text className="quick-action-text">New Investment</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div className="quick-action-card-white" onClick={() => navigate('/dashboard/my-investments')}>
                            <div className="quick-action-icon">
                                <UnorderedListOutlined />
                            </div>
                            <Text className="quick-action-text">My Investments</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div className="quick-action-card-white" onClick={() => navigate('/dashboard/bonds')}>
                            <div className="quick-action-icon">
                                <CloudDownloadOutlined />
                            </div>
                            <Text className="quick-action-text">Download Bonds</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div className="quick-action-card-white" onClick={() => navigate('/dashboard/profile')}>
                            <div className="quick-action-icon">
                                <UserOutlined />
                            </div>
                            <Text className="quick-action-text">Profile</Text>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Recent Investments Table - Inside Card */}
            <div className="recent-table-card">
                <Title level={4} className="section-header-margin">Recent Investments</Title>
                <Table
                    columns={columns}
                    dataSource={displayInvestments.map((inv, idx) => ({ ...inv, key: idx }))}
                    pagination={false}
                    className="refined-table-v2"
                    scroll={{ x: true }}
                />
            </div>
        </div>
    );
};

export default Dashboard;
