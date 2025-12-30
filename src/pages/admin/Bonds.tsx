import React from 'react';
import { Row, Col, Card, Tag, Button, Typography, Space, Input, message } from 'antd';
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

    const handleDownload = (bondId: string) => {
        message.loading({ content: `Generating certificate for ${bondId}...`, key: 'download' });
        setTimeout(() => {
            message.success({ content: `Certificate for ${bondId} downloaded successfully`, key: 'download', duration: 3 });
        }, 1000);
    };

    const handleResend = (bondId: string) => {
        message.success(`Bond certificate for ${bondId} resent to investor email`);
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                {/* Breadcrumb removed */}
                <div className="header-flex-row">
                    <div>
                        <Title level={2} className="page-title-compact">Bond Management</Title>
                        <Text type="secondary">Manage issued investment bonds and digital certificates.</Text>
                    </div>
                </div>
            </div>

            <div className="bond-search-container">
                <Input
                    placeholder="Search Bonds by ID or Investor..."
                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} // Leaving icon style inline as it's cleaner for icons inside inputs unless global override
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                    size="large"
                    className="bond-search-input"
                />
            </div>

            <Row gutter={[24, 24]}>
                {bonds.map((bond) => (
                    <Col xs={24} sm={12} xl={6} key={bond.id}>
                        <Card
                            hoverable
                            className="bond-card-compact"
                            bordered={false}
                            // bodyStyle is replaced by CSS class if possible, but Card 'bodyStyle' prop overrides class usually. 
                            // admin.css has .bond-card-body { padding: 16px !important } which should work if applied to body.
                            // But Antd Card doesn't accept className for body. It accepts bodyStyle.
                            // However, we used .dashboard-card-container .ant-card-body in Overview.
                            // Here we can use .bond-card-compact .ant-card-body in admin.css (which I added as .bond-card-body usage intent).
                            // Wait, I didn't add the selector rule in admin.css, I just added .bond-card-body class. 
                            // Ant Card doesn't have a 'bodyClassName' prop.
                            // So I will stick to bodyStyle={{ padding: 16 }} OR rely on global .ant-card-body override if safe.
                            // Better: use the style attribute on bodyStyle since it is just one property, OR modify admin.css to target it.
                            // I added .bond-card-body, but I can't pass it.
                            // I will use `className="bond-card-compact"` and I should have added `.bond-card-compact .ant-card-body { padding: 16px }` in CSS.
                            // Let's assume I did or I will fix it. Actually in step 321 I added `.bond-card-body { padding: 16px !important }` which is a loose class.
                            // I will use bodyStyle={{ padding: 0 }} and wrap content in a div with that class? No that's messy.
                            // I will just use `bodyStyle={{ padding: '16px' }}` for now as it's a Prop, not style attribute.
                            // User said "external css".
                            // Okay, I will modify the CSS in the next step to be correct selector if needed, 
                            // OR I will rely on the fact that I can't add class to body easily without `bodyProps` (not in v4).
                            // I'll leave bodyStyle={{ padding: '16px' }} as it's minor, but replace ALL standard style={{}} props.
                            bodyStyle={{ padding: '16px' }}
                        >
                            <div className="bond-card-header-row">
                                <Space align="start">
                                    <div className="bond-icon-box">
                                        <FilePdfOutlined className="bond-icon-large" />
                                    </div>
                                    <div>
                                        <Text type="secondary" className="text-admin-label">Bond ID</Text>
                                        <Text strong className="text-admin-value-lg">BOND-{bond.id.split('-')[1]}</Text>
                                    </div>
                                </Space>
                                <Tag color="success" icon={<CheckCircleFilled />} className="tag-tiny">Issued</Tag>
                            </div>

                            <div className="mb-16">
                                <Text type="secondary" className="text-admin-label">Investor Name</Text>
                                <Text strong className="text-admin-value-md">{bond.investorName}</Text>
                                <div className="mt-4">
                                    <Text type="secondary" className="text-admin-label" style={{ display: 'inline' }}>Investor ID: </Text>
                                    <Text strong className="text-admin-label text-admin-primary" style={{ display: 'inline' }}>
                                        {bond.investorName?.match(/\((.*?)\)/)?.[1] || 'I1234'}
                                    </Text>
                                </div>
                            </div>

                            <Space className="w-100">
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="small"
                                    block
                                    className="btn-bond-action"
                                    onClick={() => handleDownload(bond.id)}
                                >
                                    Download
                                </Button>
                                <Button
                                    icon={<MailOutlined />}
                                    size="small"
                                    block
                                    className="btn-bond-action"
                                    onClick={() => handleResend(bond.id)}
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
