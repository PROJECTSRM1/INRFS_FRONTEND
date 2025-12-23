import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, DatePicker, Select, Space, Table } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import '../../styles/admin.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const reportColumns = [
        {
            title: 'Report Name',
            dataIndex: 'name',
            key: 'name',
            minWidth: 200,
            render: (text: string) => <Text strong>{text}</Text>
        },
        { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
        { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
        {
            title: 'Action',
            key: 'action',
            width: 140,
            fixed: (isMobile ? false : 'right') as any,
            render: () => (
                <Space size="middle">
                    <Button type="link" icon={<FilePdfOutlined />} style={{ padding: 0 }}>PDF</Button>
                    <Button type="link" icon={<FileExcelOutlined />} style={{ padding: 0 }}>CSV</Button>
                </Space>
            )
        },
    ];

    const reportData = [
        { key: '1', name: 'Annual Performance Report 2023', date: '2023-12-31', type: 'System' },
        { key: '2', name: 'Monthly Investor Inflow - Nov', date: '2023-11-30', type: 'Financial' },
        { key: '3', name: 'Audit Log - Q4', date: '2023-12-15', type: 'Compliance' },
    ];

    return (
        <div className="admin-reports-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Reports</div>
                <div className="header-flex-row">
                    <Title level={1} className="dashboard-main-title">Reports & Analytics</Title>
                </div>
            </div>

            <Card className="fintech-chart-card mt-24" title="Generate New Report" bordered={false}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Text strong>Report Type</Text>
                            <Select defaultValue="performance" style={{ width: '100%', marginTop: '8px' }}>
                                <Select.Option value="performance">Performance Analysis</Select.Option>
                                <Select.Option value="investors">Investor Growth</Select.Option>
                                <Select.Option value="financial">Financial Statements</Select.Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={8}>
                            <Text strong>Date Range</Text>
                            <div style={{ marginTop: '8px' }}>
                                <RangePicker style={{ width: '100%' }} />
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <Text strong>Format</Text>
                            <div style={{ marginTop: '8px' }}>
                                <Select defaultValue="pdf" style={{ width: '100%' }}>
                                    <Select.Option value="pdf">PDF Document</Select.Option>
                                    <Select.Option value="csv">Excel Spreadsheet (CSV)</Select.Option>
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Button type="primary" icon={<FilterOutlined />} block size="large" className="mt-8">
                        Generate Report
                    </Button>
                </Space>
            </Card>

            <Card className="fintech-chart-card mt-24" title="Recent Reports" bordered={false} bodyStyle={{ padding: 0 }}>
                <Table
                    columns={reportColumns}
                    dataSource={reportData}
                    pagination={false}
                    scroll={{ x: 700 }}
                    size={isMobile ? 'small' : 'middle'}
                />
            </Card>
        </div>
    );
};

export default Reports;
