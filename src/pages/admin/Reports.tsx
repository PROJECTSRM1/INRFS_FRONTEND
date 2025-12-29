import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, DatePicker, Select, Space, Table, message, Tag } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import '../../styles/admin.css';

dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    // State to hold filters
    const [selectedType, setSelectedType] = useState('all');
    const [selectedFormat, setSelectedFormat] = useState('all');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
    const [activeDateRange, setActiveDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDownload = (record: any, format: 'pdf' | 'csv') => {
        message.loading(`Generating ${format.toUpperCase()} for ${record.name}...`, 1.5)
            .then(() => message.success(`${format.toUpperCase()} Downloaded Successfully`));
    };

    const applyFilters = () => {
        setActiveDateRange(dateRange);
        message.info('Filters Applied');
    };

    const reportColumns = [
        {
            title: 'Report Name',
            dataIndex: 'name',
            key: 'name',
            minWidth: 200,
            render: (text: string) => <Text strong>{text}</Text>
        },
        { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 180,
            render: (type: string) => <Tag color="blue">{type}</Tag>
        },
        {
            title: 'Format',
            dataIndex: 'format',
            key: 'format',
            width: 100,
            render: (format: string) => (
                <Tag color={format === 'pdf' ? 'red' : 'green'}>
                    {format.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 140,
            fixed: (isMobile ? false : 'right') as any,
            render: (_: any, record: any) => (
                <Space size="middle">
                    {record.format === 'pdf' || record.format === 'all' ? (
                        <Button
                            type="text"
                            icon={<FilePdfOutlined className="icon-pdf" />}
                            onClick={() => handleDownload(record, 'pdf')}
                        />
                    ) : null}
                    {record.format === 'csv' || record.format === 'all' ? (
                        <Button
                            type="text"
                            icon={<FileExcelOutlined className="icon-excel" />}
                            onClick={() => handleDownload(record, 'csv')}
                        />
                    ) : null}
                </Space>
            )
        },
    ];

    // Mock data with format property
    const allReportData = [
        { key: '1', name: 'Q3 Investor Demographics', date: '2025-09-30', type: 'Investor Report', category: 'investor', format: 'pdf' },
        { key: '2', name: 'New Investors - Nov 2025', date: '2025-11-30', type: 'Investor Report', category: 'investor', format: 'csv' },
        { key: '3', name: 'Annual Investment Summary', date: '2025-12-15', type: 'Investments Report', category: 'investments', format: 'pdf' },
        { key: '4', name: 'Portfolio Performance Q4', date: '2025-12-31', type: 'Investments Report', category: 'investments', format: 'csv' },
        { key: '5', name: 'Investments Q1 Preview', date: '2026-03-15', type: 'Investments Report', category: 'investments', format: 'pdf' },
    ];

    // Filter data based on selected type, format, and date range
    const filteredData = allReportData.filter(item => {
        const typeMatch = selectedType === 'all' || item.category === selectedType;
        const formatMatch = selectedFormat === 'all' || item.format === selectedFormat;

        // Date range filtering
        let dateMatch = true;
        if (activeDateRange && activeDateRange[0] && activeDateRange[1]) {
            const itemDate = dayjs(item.date);
            dateMatch = itemDate.isBetween(activeDateRange[0], activeDateRange[1], 'day', '[]');
        }

        return typeMatch && formatMatch && dateMatch;
    });

    return (
        <div className="admin-reports-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Reports</div>
                <div className="header-flex-row">
                    <Title level={1} className="dashboard-main-title">Reports & Analytics</Title>
                </div>
            </div>

            <Card className="fintech-chart-card mt-24" title="Generate New Report" bordered={false}>
                <Space direction="vertical" size="large" className="reports-full-width-space">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Text strong>Report Type</Text>
                            <Select
                                defaultValue="all"
                                className="reports-select-full"
                                onChange={(value) => setSelectedType(value)}
                                value={selectedType}
                            >
                                <Option value="all">All Reports</Option>
                                <Option value="investor">Investor Report</Option>
                                <Option value="investments">Investments Report</Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={8}>
                            <Text strong>Date Range</Text>
                            <div className="reports-range-picker-container">
                                <RangePicker
                                    className="reports-range-picker-full"
                                    onChange={(dates) => setDateRange(dates as any)}
                                />
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <Text strong>Format</Text>
                            <div className="reports-format-select-container">
                                <Select
                                    defaultValue="all"
                                    className="reports-format-select-full"
                                    onChange={(value) => setSelectedFormat(value)}
                                    value={selectedFormat}
                                >
                                    <Option value="all">All Formats</Option>
                                    <Option value="pdf">PDF Document</Option>
                                    <Option value="csv">Excel Spreadsheet (CSV)</Option>
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        block
                        size="large"
                        className="reports-generate-btn"
                        onClick={applyFilters}
                    >
                        Apply Filters
                    </Button>
                </Space>
            </Card>

            <Card
                className="fintech-chart-card mt-24 reports-table-card"
                title={`Results: ${filteredData.length} Reports Found`}
                bordered={false}
            >
                <Table
                    columns={reportColumns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 700 }}
                    size={isMobile ? 'small' : 'middle'}
                    locale={{ emptyText: 'No reports found for these filters' }}
                />
            </Card>
        </div>
    );
};

export default Reports;
