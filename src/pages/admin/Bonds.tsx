import React from 'react';
import { Row, Col, Card, Tag, Button, Typography, Space, Input } from 'antd';
import { DownloadOutlined, MailOutlined, FilePdfOutlined, CheckCircleFilled, SearchOutlined } from '@ant-design/icons';
import { MOCK_INVESTMENTS } from '../../data/mockData';
import '../../styles/admin.css';

const { Title, Text } = Typography;

const AdminBonds: React.FC = () => {
    const [searchText, setSearchText] = React.useState('');

    const bonds = MOCK_INVESTMENTS.filter(inv => {
        const isBond = inv.status === 'Active';
        const matchSearch =
            inv.id.toLowerCase().includes(searchText.toLowerCase()) ||
            (inv.investorName || '').toLowerCase().includes(searchText.toLowerCase());
        return isBond && matchSearch;
    });

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Bonds</div>
                <div className="header-flex-row">
                    <div>
                        <Title level={2} style={{ margin: 0, letterSpacing: '-0.5px' }}>Bond Management</Title>
                        <Text type="secondary">Manage issued investment bonds and digital certificates.</Text>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <Input
                    placeholder="Search Bonds by ID or Investor..."
                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ maxWidth: 400 }}
                    allowClear
                    size="large"
                />
            </div>

            <Row gutter={[24, 24]}>
                {bonds.map((bond) => (
                    <Col xs={24} sm={12} xl={6} key={bond.id}>
                        <Card
                            hoverable
                            className="bond-card-compact"
                            bordered={false}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Space align="start">
                                    <div className="bond-icon-box">
                                        <FilePdfOutlined style={{ fontSize: '20px', color: 'var(--admin-primary)' }} />
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>Bond ID</Text>
                                        <Text strong style={{ fontSize: '14px' }}>BOND-{bond.id.split('-')[1]}</Text>
                                    </div>
                                </Space>
                                <Tag color="success" icon={<CheckCircleFilled />} style={{ margin: 0, borderRadius: '4px', fontSize: '10px' }}>Issued</Tag>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>Investor Name</Text>
                                <Text strong style={{ fontSize: '13px' }}>{bond.investorName}</Text>
                                <div style={{ marginTop: '4px' }}>
                                    <Text type="secondary" style={{ fontSize: '11px' }}>Investor ID: </Text>
                                    <Text strong style={{ fontSize: '11px', color: 'var(--admin-primary)' }}>
                                        {bond.investorName?.match(/\((.*?)\)/)?.[1] || 'I1234'}
                                    </Text>
                                </div>
                            </div>

                            <Space style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="small"
                                    block
                                    style={{ borderRadius: '6px', fontSize: '12px' }}
                                >
                                    Download
                                </Button>
                                <Button
                                    icon={<MailOutlined />}
                                    size="small"
                                    block
                                    style={{ borderRadius: '6px', fontSize: '12px' }}
                                >
                                    Resend
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminBonds;
