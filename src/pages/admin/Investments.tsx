import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Tag, Typography, Input } from 'antd';
import { MOCK_INVESTMENTS } from '../../data/mockData';
import { SearchOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import '../../styles/admin.css';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminInvestments: React.FC = () => {
    const [planFilter, setPlanFilter] = useState('All Plans');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [searchText, setSearchText] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [investments] = useState(MOCK_INVESTMENTS);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    // Helper function to parse date strings
    const parseMaturityDate = (dateStr?: string): Date => {
        if (!dateStr) return new Date(9999, 11, 31); // Far future for items without dates

        // Handle formats like "Jun 15, 2024" or "Apr 20, 2024"
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? new Date(9999, 11, 31) : parsed;
    };

    const columns: any = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => (
                <span style={{
                    fontFamily: 'monospace',
                    color: '#926132',
                    background: 'rgba(146, 97, 50, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap'
                }}>
                    {text}
                </span>
            ),
            width: 140,
        },
        {
            title: 'Investor (ID)',
            dataIndex: 'investorName',
            key: 'investorName',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Plan',
            dataIndex: 'planName',
            key: 'planName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => <Text strong>₹{val.toLocaleString()}</Text>,
            sorter: (a: any, b: any) => a.amount - b.amount,
        },
        {
            title: 'Interest',
            dataIndex: 'interest',
            key: 'interest',
            render: (val: number) => <Text type="success" strong>₹{val?.toLocaleString()}</Text>,
        },
        {
            title: 'Maturity',
            dataIndex: 'maturityDate',
            key: 'maturityDate',
            responsive: ['lg'],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = '#926132'; // Default/Active is now Bronze
                if (status === 'Completed') color = 'success';
                if (status === 'Matured') color = 'gold'; // Or keep gold/yellow
                // For 'Active' specifically, user wanted to change the blue.
                return (
                    <Tag
                        color={color}
                        style={{
                            borderRadius: '50px',
                            fontWeight: 600,
                            padding: '0 12px',
                            border: status === 'Active' ? '1px solid rgba(146, 97, 50, 0.3)' : 'none'
                        }}
                    >
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Settlement',
            dataIndex: 'settlementStatus',
            key: 'settlementStatus',
            width: 150,
            render: (settlementStatus: 'Completed' | 'Pending' | undefined) => {
                const status = settlementStatus || 'Pending';
                const isCompleted = status === 'Completed';
                return (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: isCompleted ? '#52c41a' : '#faad14',
                        fontWeight: 600,
                        fontSize: '13px'
                    }}>
                        {isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                        {status}
                    </div>
                );
            },
        },
    ];

    // Filter and sort data
    const dataSource = investments
        .filter(item => {
            const matchPlan = planFilter === 'All Plans' || item.planName === planFilter;
            const matchStatus = statusFilter === 'All Status' || item.status === statusFilter;
            const matchSearch =
                item.id.toLowerCase().includes(searchText.toLowerCase()) ||
                (item.investorName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                item.planName.toLowerCase().includes(searchText.toLowerCase());

            return matchPlan && matchStatus && matchSearch;
        })
        .sort((a, b) => {
            // Sort by maturity date (nearest first)
            const dateA = parseMaturityDate(a.maturityDate);
            const dateB = parseMaturityDate(b.maturityDate);
            return dateA.getTime() - dateB.getTime();
        });

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Investments</div>
                <div className="header-flex-row">
                    <div>
                        <Title level={2} style={{ margin: 0, letterSpacing: '-0.5px' }}>Investment Tracking</Title>
                        <Text type="secondary">Sorted by maturity date (nearest first) • Real-time settlement status</Text>
                    </div>
                </div>
            </div>

            <Card bordered={false} className="table-card-compact" style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Input
                        placeholder="Search by ID, Investor, Plan..."
                        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: isMobile ? '100%' : 250 }}
                        allowClear
                    />
                    <Select
                        defaultValue="All Plans"
                        onChange={setPlanFilter}
                        style={{ width: isMobile ? '100%' : 160 }}
                    >
                        <Option value="All Plans">All Plans</Option>
                        <Option value="6 Month">6 Month</Option>
                        <Option value="3 Month">3 Month</Option>
                        <Option value="Yearly">Yearly</Option>
                    </Select>
                    <Select
                        defaultValue="All Status"
                        onChange={setStatusFilter}
                        style={{ width: isMobile ? '100%' : 160 }}
                    >
                        <Option value="All Status">All Status</Option>
                        <Option value="Active">Active</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="Matured">Matured</Option>
                    </Select>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 800 }}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} investments`,
                        className: "compact-pagination"
                    }}
                />
            </Card>
        </div>
    );
};

export default AdminInvestments;
