// import { Row, Col, Card, Tag, Button, Typography, Space, Input, message } from 'antd';
// import { Typography } from 'antd';

// import { DownloadOutlined, MailOutlined, FilePdfOutlined, CheckCircleFilled, SearchOutlined } from '@ant-design/icons';

// import { MOCK_INVESTMENTS } from '../../data/mockData';

// import '../../styles/admin.css';

// const { Title, Text } = Typography;

// const AdminBonds: React.FC = () => {
    /* 
    const [searchText, setSearchText] = React.useState('');

    const bonds = MOCK_INVESTMENTS.filter(inv => {
        const isBond = inv.status === 'Active';
        const matchSearch =
            inv.id.toLowerCase().includes(searchText.toLowerCase()) ||
            (inv.investorName || '').toLowerCase().includes(searchText.toLowerCase());
        return isBond && matchSearch;
    });
    */


    /* 
    const handleDownload = (bondId: string) => {
        message.loading({ content: `Generating certificate for ${bondId}...`, key: 'download' });
        setTimeout(() => {
            message.success({ content: `Certificate for ${bondId} downloaded successfully`, key: 'download', duration: 3 });
        }, 1000);
    };

    const handleResend = (bondId: string) => {
        message.success(`Bond certificate for ${bondId} resent to investor email`);
    };
    */


    // return (
    //     <div className="admin-dashboard-wrapper">
    //         <div className="page-header-compact">
    //             {/* Breadcrumb removed */}
    //             <div className="header-flex-row">
    //                 <div>
    //                     <Title level={2} className="page-title-compact">Bond Management</Title>
    //                     <Text type="secondary">Manage issued investment bonds and digital certificates.</Text>
    //                 </div>
    //             </div>
    //         </div>

            {/* 
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
            */}
//         </div>
//     );
// };

// export default AdminBonds;
