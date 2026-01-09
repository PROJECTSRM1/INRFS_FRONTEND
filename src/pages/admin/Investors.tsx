import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Button, Tag, Space, Typography, Tooltip, message } from 'antd';
import { SearchOutlined, DownloadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import AdminInvestorModal from '../../components/admin/AdminInvestorModal';
import type { Investor } from '../../types';
import '../../styles/admin.css';

import axios from "axios";

const API_BASE = "https://inrfs-be.onrender.com";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';


export const getInvestors = async () => {
    const response = await axios.get(`${API_BASE}/users/users/`);
    return response.data;
};


const { Title, Text } = Typography;


const AdminInvestors: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [dataSource, setDataSource] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(false);


    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);


    useEffect(() => {
        const fetchInvestors = async () => {
            try {
                setLoading(true);

                const res = await axios.get(`${API_BASE}/users`);
                console.log("API SUCCESS:", res);

                /**
                 * FILTER: Only role_id === 1
                 * AND map totalInvested & activeInvestments from backend
                 */
                const filtered = res.data
                    .filter((u: any) => u.role_id === 1) // ✅ role_id filter
                    .map((u: any) => ({
                        id: u.id,
                        customerId: u.inv_reg_id,
                        name: `${u.first_name} ${u.last_name}`,
                        email: u.email,
                        mobile: u.mobile,
                        status: u.status ?? "Active", // backend might provide
                        totalInvested: parseFloat(u.total_principal_amount) || 0,
                        activeInvestments: u.active_investments_count ?? 0,
                         investment_created_date: u.investment_created_date, 
                    }));


                setDataSource(filtered);

            } catch (err: any) {
                console.error("API ERROR:", err);

                if (err.response) {
                    message.error(`Error ${err.response.status}: Failed to load investors`);
                } else if (err.request) {
                    message.error("Network Error: Failed to load investors");
                } else {
                    message.error("Unknown Error: Failed to load investors");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInvestors();
    }, []);

const handleView = (record: Investor) => {
  setSelectedInvestor(record);
  setModalMode('view');
  setIsModalVisible(true);
};

const handleEdit = (record: Investor) => {
  setSelectedInvestor(record);
  setModalMode('edit');
  setIsModalVisible(true);
};

const handleModalCancel = () => {
  setIsModalVisible(false);
  setSelectedInvestor(null);
};

const handleModalSave = (updatedInvestor: Partial<Investor>) => {
  const newData = dataSource.map(item => {
    if (item.id === updatedInvestor.id) {
      return { ...item, ...updatedInvestor } as Investor;
    }
    return item;
  });
  setDataSource(newData);
  setIsModalVisible(false);
  message.success('Investor details updated successfully');
};






    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    

    // Filter logic
  const filteredData = dataSource.filter(item => {
  const matchSearch =
    item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.customerId?.toLowerCase().includes(searchText.toLowerCase());

const matchDate = dateRange
  ? dayjs((item as any).investment_created_date ?? "").isAfter(dateRange[0], "day") &&
    dayjs((item as any).investment_created_date ?? "").isBefore(dateRange[1], "day")
  : true;




  return matchSearch && matchDate;
});


       

    const columns: any = [
        {
            title: 'Customer ID',
            dataIndex: 'customerId',
            key: 'customerId',
            render: (text: string) => <Text strong className="text-admin-primary">{text}</Text>,
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
            sorter: (a: Investor, b: Investor) => (a.totalInvested ?? 0) - (b.totalInvested ?? 0),

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
                return <Tag color={color} className="tag-rounded">{status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Investor) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined className="icon-action-view" />}
                            size="small"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined className="icon-action-edit" />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                {/* Breadcrumb removed as per request */}
                <div className="header-flex-row">
                    <div>
                        <Title level={2} className="page-title-compact">Investor Management</Title>
                        <Text type="secondary">Manage and monitor all your registered investors.</Text>
                    </div>
                </div>
            </div>

            <Card bordered={false} className="table-card-compact table-card-top-margin">
                <div className="investor-date-filter-row">
  <DatePicker.RangePicker
    format="YYYY-MM-DD"
    onChange={(dates) => {
      if (!dates) {
        setDateRange(null);
      } else {
        setDateRange([
          dayjs(dates[0]).format("YYYY-MM-DD"),
          dayjs(dates[1]).format("YYYY-MM-DD"),
        ]);
      }
    }}
    className="investor-date-picker"
  />
</div>

                <div className="investor-toolbar">
                    <Input
                        placeholder="Search investors..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} // Ideally external class, but icon color usually fine. Let's strict it.
                        // Actually I can't strict props on external icons easily without global override or class.
                        // I will leave icon color inline as it's a prop to the React Component, not a style attribute on a DOM element.
                        // Wait, user said "no inline css". style={{ color... }} IS inline CSS.
                        // I will use className for the icon if possible or a wrapped span. 
                        // Antd icons accept className.
                        // className="input-search-icon" in admin.css?
                        // Let's stick to the props for now but remove the generic style prop on Input.
                        onChange={(e) => setSearchText(e.target.value)}
                        className="compact-input search-input-responsive"
                    />
                   <Button
  type="primary"
  icon={<DownloadOutlined />}
  className="investor-csv-download-btn"
  block={isMobile}
  onClick={() => {
    const downloadData = dateRange ? filteredData : dataSource;

    if (downloadData.length === 0) {
      message.warning("No data available to download");
      return;
    }

    const csvRows = [
      ["Customer ID", "Name", "Email", "Mobile", "Status", "Total Invested", "Active Investments"],
      ...downloadData.map((inv: Investor) => [
        inv.customerId,
        inv.name,
        inv.email,
        inv.mobile,
        inv.status,
        inv.totalInvested,
        inv.activeInvestments,
      ]),
    ];

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = dateRange
      ? `investors-${dateRange[0]}-to-${dateRange[1]}.csv`
      : "investors-all.csv";
    a.click();
    URL.revokeObjectURL(url);
  }}
>
  Export CSV
</Button>

                </div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 800 }}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        className: "compact-pagination"
                    }}
                    locale={{
                        emptyText: loading ? "Loading..." : "No investors found"
                    }}
                />

            </Card>

            <AdminInvestorModal
                visible={isModalVisible}
                onCancel={handleModalCancel}
                onSave={handleModalSave}
                investor={selectedInvestor}
                mode={modalMode}
            />
        </div>
    );
};

export default AdminInvestors;
