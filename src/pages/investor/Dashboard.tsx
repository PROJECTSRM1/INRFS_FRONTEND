import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Table, Tag, Spin, message } from 'antd';
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
import { investmentService, type Investment } from '../../services/investmentService';
import { getPlanNameById } from '../../utils/planTypeMapping';
import '../../styles/dashboard.css';


const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    // State for API investments
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);


    // Fetch investments from API on component mount
    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                setLoading(true);
                const data = await investmentService.getInvestments();
                console.log('Dashboard - Fetched investments:', data);
                setInvestments(data);
            } catch (error) {
                console.error('Error fetching investments:', error);
                message.error('Failed to load investments data');
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    // Calculate statistics from investments
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.principal_amount || 0), 0);
    const totalReturns = investments.reduce((sum, inv) => sum + (inv.interest_amount || 0), 0);
    const activeInvestments = investments.filter(inv => inv.is_active).length;
    const digitalBonds = investments.length;

    // Prepare recent investments for table (last 3 most recent)
    const recentInvestments = investments
        .sort((a, b) => {
            // Sort by created_date in descending order (most recent first)
            const dateA = new Date(a.created_date || 0).getTime();
            const dateB = new Date(b.created_date || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 3)
        .map(inv => ({
            id: inv.uk_inv_id || 'N/A',
            planName: inv.plan_name || getPlanNameById(inv.plan_type_id || 0),
            amount: inv.principal_amount || 0,
            returns: inv.interest_amount || 0,
            status: inv.is_active ? 'Active' : 'Inactive',
            date: inv.maturity_date ? new Date(inv.maturity_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'N/A'
        }));

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
            {loading ? (
                <div className="dashboard-loading-overlay">
                    <Spin size="large" tip="Loading your dashboard..." />
                </div>
            ) : (
                <>
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
                                value={fintechService.formatCurrency(totalInvested)}
                                icon={<WalletOutlined />}
                                colorClass="stat-blue"
                                onClick={() => navigate('/dashboard/my-investments')}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatMiniCard
                                title="Total Returns"
                                value={fintechService.formatCurrency(totalReturns)}
                                icon={<LineChartOutlined />}
                                colorClass="stat-green"
                                onClick={() => navigate('/dashboard/my-investments')}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatMiniCard
                                title="Active Investments"
                                value={activeInvestments.toString()}
                                icon={<PieChartOutlined />}
                                colorClass="stat-purple"
                                onClick={() => navigate('/dashboard/my-investments')}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatMiniCard
                                title="Digital Bonds"
                                value={digitalBonds.toString()}
                                icon={<FileTextOutlined />}
                                colorClass="stat-orange"
                                onClick={() => navigate('/dashboard/my-investments')}
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
                                <div className="quick-action-card-white" onClick={() => navigate('/dashboard/my-investments')}>
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
                            dataSource={recentInvestments.map((inv, idx) => ({ ...inv, key: idx }))}
                            pagination={false}
                            className="refined-table-v2"
                            scroll={{ x: true }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
