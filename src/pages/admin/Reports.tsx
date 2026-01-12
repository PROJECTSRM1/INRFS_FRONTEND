import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import {
    Row, Col, Card, Button, Typography, DatePicker, Select, Space, Table, message
} from "antd";
import { FilePdfOutlined, FileExcelOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { Tag } from "antd";


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface ReportItem {
    key: string;
    name: string;
    date: string;
    type: string;
    category: string;
    format: string;
    data: any;
}

const Reports: React.FC = () => {
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [filteredReports, setFilteredReports] = useState<ReportItem[]>([]);
    const [selectedType, setSelectedType] = useState("all");
    const [selectedFormat, setSelectedFormat] = useState("all");
    const [dateRange, setDateRange] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const investorsRes = await apiClient.get("/users/");
            const investmentsRes = await apiClient.get("/investments/");
            const investors = investorsRes.data.map((i: any, idx: number) => ({
                key: `investor-${i.id || idx}`,
                name: `${i.First_Name} ${i.Last_Name || ""}`.trim(),
                date: i.createdAt, // real unique date
                type: "Investor Report",
                category: "investor",
                format: i.reportFormat || "pdf",
                data: i,
            }));

            const investments = investmentsRes.data.map((inv: any, idx: number) => ({
                key: `investment-${inv.id || idx}`,
                name: `Investment by ${inv.investorName || inv.userName || "Investor"} (ID: ${inv.id})`,
                date: inv.createdAt || inv.date || inv.investmentDate, // real unique date
                type: "Investment Report",
                category: "investments",
                format: inv.reportFormat || "pdf",
                data: inv,
            }));




            setReports([...investors, ...investments]);
            setFilteredReports([...investors, ...investments]);


            const all = [...investors, ...investments];
            setReports(all);
            setFilteredReports(all);
            setFilteredReports(all);
            message.success("Backend data loaded successfully");
        } catch {
            message.error("Failed to load data");
        }
        setLoading(false);
    };

    const applyFilters = () => {
        const result = reports.filter(item => {
            const typeMatch = selectedType === "all" || item.category === selectedType;
            const formatMatch = selectedFormat === "all" || item.format === selectedFormat;
            let dateMatch = true;

            if (dateRange?.[0] && dateRange?.[1]) {
                const d = dayjs(item.date);
                dateMatch = (d as any).isBetween(dateRange[0], dateRange[1], "day", "[]");
            }

            return typeMatch && formatMatch && dateMatch;
        });

        setFilteredReports(result);
        message.success("Filters Applied");
    };

    const handleBulkDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Investors & Investments Report", 10, 10);

        let y = 20;
        filteredReports.forEach((r) => {
            doc.text(`${r.name} | ${dayjs(r.date).format("YYYY-MM-DD")} | ${r.type}`, 10, y);
            y += 8;
        });

        const url = URL.createObjectURL(doc.output("blob"));
        window.open(url);

        const a = document.createElement("a");
        a.href = url;
        a.download = "Reports.pdf";
        a.click();
    };


    const handleBulkDownloadCSV = () => {
        const rows = filteredReports.map((r) => r.data);
        if (!rows.length) return message.info("No data to export");

        const headers = Object.keys(rows[0]).join(",");
        const csv = rows.map((r) => Object.values(r).join(",")).join("\n");

        const blob = new Blob([headers + "\n" + csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Reports.csv";
        a.click();
    };


    const reportColumns = [
        {
            title: "Report Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (d: string) => dayjs(d).format("YYYY-MM-DD"), // unique for each row
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (t: string) => <Tag>{t}</Tag>,
        },
        {
            title: "Action",
            key: "action",
            fixed: "right" as "right",
            render: (_: any) => (
                <Space>
                    <Button type="text" icon={<FilePdfOutlined />} onClick={() => handleBulkDownloadPDF()} />
                    <Button type="text" icon={<FileExcelOutlined />} onClick={() => handleBulkDownloadCSV()} />
                </Space>
            ),
        },
    ];


    return (
        <div className="admin-reports-wrapper">
            <Card bordered={false} className="mt-24" title={<Title level={4}>Generate New Report</Title>} extra={
                <Space>
                    <Button icon={<FilePdfOutlined />} onClick={handleBulkDownloadPDF} />
                    <Button icon={<FileExcelOutlined />} onClick={handleBulkDownloadCSV} />
                </Space>
            }>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Text strong>Report Type</Text>
                        <Select value={selectedType} onChange={v => setSelectedType(v)} className="reports-select-full">
                            <Option value="all">All</Option>
                            <Option value="investor">Investor Reports</Option>
                            <Option value="investments">Investment Reports</Option>
                        </Select>
                    </Col>

                    <Col xs={24} md={8}>
                        <Text strong>Date Range</Text>
                        <RangePicker onChange={v => setDateRange(v)} className="reports-range-picker-full" />
                    </Col>

                    <Col xs={24} md={8}>
                        <Text strong>Format</Text>
                        <Select value={selectedFormat} onChange={v => setSelectedFormat(v)} className="reports-select-full">
                            <Option value="all">All</Option>
                            <Option value="pdf">PDF</Option>
                            <Option value="csv">CSV</Option>
                        </Select>
                    </Col>
                </Row>

                <Button type="primary" block icon={<FilterOutlined />} className="mt-16" onClick={applyFilters}>
                    Apply Filters
                </Button>
            </Card>

            <Card bordered={false} className="mt-24">
                <Table
                    columns={reportColumns}
                    dataSource={filteredReports}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 700 }}
                    locale={{ emptyText: "No reports found for these filters" }}
                />
            </Card>
        </div>
    );
};

export default Reports;
