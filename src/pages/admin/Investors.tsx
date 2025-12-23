import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Button, Tag, Space, Typography, Tooltip } from 'antd';
import { SearchOutlined, DownloadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { MOCK_INVESTORS } from '../../data/mockData';
import type { Investor } from '../../types';
import '../../styles/admin.css';

const { Title, Text } = Typography;

const AdminInvestors: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columns: any = [
        {
            title: 'Customer ID',
            dataIndex: 'customerId',
            key: 'customerId',
            render: (text: string) => <Text strong style={{ color: 'var(--admin-primary)' }}>{text}</Text>,
            width: 120,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md'],
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
            responsive: ['lg'],
        },
        {
            title: 'Total Invested',
            dataIndex: 'totalInvested',
            key: 'totalInvested',
            render: (val: number) => <Text strong>${val.toLocaleString()}</Text>,
            sorter: (a: Investor, b: Investor) => a.totalInvested - b.totalInvested,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'Active') color = 'success';
                if (status === 'Pending') color = 'warning';
                if (status === 'Inactive') color = 'error';
                return <Tag color={color} style={{ borderRadius: '12px' }}>{status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button type="text" icon={<EyeOutlined style={{ color: '#3b82f6' }} />} size="small" />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button type="text" icon={<EditOutlined style={{ color: '#64748b' }} />} size="small" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const dataSource = MOCK_INVESTORS.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerId?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Investors</div>
                <div className="header-flex-row">
                    <div>
                        <Title level={2} style={{ margin: 0, letterSpacing: '-0.5px' }}>Investor Management</Title>
                        <Text type="secondary">Manage and monitor all your registered investors.</Text>
                    </div>
                </div>
            </div>

            <Card bordered={false} className="table-card-compact" style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Input
                        placeholder="Search investors..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: isMobile ? '100%' : 250 }}
                        className="compact-input"
                    />
                    <Button type="primary" icon={<DownloadOutlined />} className="compact-btn" block={isMobile}>
                        Export
                    </Button>
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
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        className: "compact-pagination"
                    }}
                />
            </Card>
        </div>
    );
};

export default AdminInvestors;
