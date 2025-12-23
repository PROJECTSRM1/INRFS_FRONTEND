import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Tag, Typography } from 'antd';
import { MOCK_INVESTMENTS } from '../../data/mockData';
import '../../styles/admin.css';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminInvestments: React.FC = () => {
    const [planFilter, setPlanFilter] = useState('All Plans');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columns: any = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text strong style={{ color: 'var(--admin-primary)' }}>{text}</Text>,
            width: 100,
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
            render: (val: number) => <Text strong>${val.toLocaleString()}</Text>,
            sorter: (a: any, b: any) => a.amount - b.amount,
        },
        {
            title: 'Interest',
            dataIndex: 'interest',
            key: 'interest',
            render: (val: number) => <Text type="success" strong>${val?.toLocaleString()}</Text>,
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
                let color = 'processing';
                if (status === 'Completed') color = 'success';
                if (status === 'Matured') color = 'gold';
                return <Tag color={color} style={{ borderRadius: '12px' }}>{status}</Tag>;
            },
        },
    ];

    const dataSource = MOCK_INVESTMENTS.filter(item => {
        const matchPlan = planFilter === 'All Plans' || item.planName === planFilter;
        const matchStatus = statusFilter === 'All Status' || item.status === statusFilter;
        return matchPlan && matchStatus;
    });

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Investments</div>
                <div className="header-flex-row">
                    <div>
                        <Title level={2} style={{ margin: 0, letterSpacing: '-0.5px' }}>Investment Tracking</Title>
                        <Text type="secondary">Real-time status of all portfolio investments.</Text>
                    </div>
                </div>
            </div>

            <Card bordered={false} className="table-card-compact" style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
