import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Tag, Typography, Input, Button, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'react-router-dom';
import { SearchOutlined, CheckCircleOutlined, ClockCircleOutlined, CheckSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import InvestmentCompletionModal from '../../components/admin/InvestmentCompletionModal';
import type { Investment } from '../../types';
import '../../styles/admin.css';
import axios from 'axios';
import { deleteInvestment } from '../../utils/investmentsapi';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';



const { Title, Text } = Typography;
const { Option } = Select;
const PLAN_NAME_MAP: Record<number, string> = {
  1: "Monthly",
  2: "Quarterly",
  3: "Yearly",
  4: "Half Yearly",
  
};


interface InvestmentApiItem {
    id: number;
    uk_inv_id?: string;
    created_by: number;
    plan_type_id: number;
    principal_amount: number;
    interest_amount: number;
    maturity_date: string;
    is_active: boolean;
    tenure: number;
    infrc_number?: string;
    inv_reg_id?:number|string;
    
}

const AdminInvestments: React.FC = () => {
    const location = useLocation();
    const [planFilter, setPlanFilter] = useState('All Plans');
    const [statusFilter, setStatusFilter] = useState(() => location.state?.defaultStatus || 'All Status');
    const [searchText, setSearchText] = useState('');
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCompletionModalVisible, setIsCompletionModalVisible] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);

    const getTokens = () => ({
        access: localStorage.getItem("access_token"),
        refresh: localStorage.getItem("refresh_token"),
    });

    const saveAccessToken = (token: string) => localStorage.setItem("access_token", token);

    const refreshAccessToken = React.useCallback(async () => {
        const { refresh } = getTokens();
        try {
            const res = await axios.post("https://inrfs-be.onrender.com/users/refresh", {
                refresh_token: refresh,
            });
            const newAccess = res.data.access_token;
            saveAccessToken(newAccess);
            return newAccess;
        } catch (error) {
            console.error("Failed to refresh token", error);
            throw error;
        }
    }, []);

    const fetchInvestmentData = React.useCallback(async () => {
        try {
            setLoading(true);
            const { access } = getTokens();

            const res = await axios.get("https://inrfs-be.onrender.com/investments/", {
                headers: { Authorization: `Bearer ${access}` },
            });

            const mapped: Investment[] = res.data.map((item: InvestmentApiItem) => ({
                id: item.uk_inv_id || String(item.id),
                investorName: item.inv_reg_id,
                planName: PLAN_NAME_MAP[item.plan_type_id] || "Unknown",
                amount: item.principal_amount || 0,
                interest: item.interest_amount || 0,
                maturityDate: item.maturity_date || '',
                status: item.is_active ? "Active" : "Completed",
                settlementStatus: item.is_active ? "Pending" : "Completed",
                maturityAmount: (item.principal_amount || 0) + (item.interest_amount || 0),
                tenure: item.tenure || 0,
                date: item.maturity_date || '',
                planId: String(item.plan_type_id || ''),
                
                infrcNumber: item.infrc_number || ''
            }));

            setInvestments(mapped);
        } catch (err: unknown) {
            console.error("Error fetching investments:", err);
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                try {
                    const newAccess = await refreshAccessToken();
                    const retry = await axios.get("https://inrfs-be.onrender.com/investments/", {
                        headers: { Authorization: `Bearer ${newAccess}` },
                    });

                    const mappedRetry: Investment[] = retry.data.map((item: InvestmentApiItem) => ({
                        id: item.uk_inv_id || String(item.id),
                        investorName: `ID-${item.created_by}`,
                        planName: PLAN_NAME_MAP[item.plan_type_id] || "Unknown",
                        amount: item.principal_amount || 0,
                        interest: item.interest_amount || 0,
                        maturityDate: item.maturity_date || '',
                        status: item.is_active ? "Active" : "Completed",
                        settlementStatus: item.is_active ? "Pending" : "Completed",
                        maturityAmount: (item.principal_amount || 0) + (item.interest_amount || 0),
                        tenure: item.tenure || 0,
                        date: item.maturity_date || '',
                        planId: String(item.plan_type_id || ''),
                        
                        infrcNumber: item.infrc_number || ''
                    }));
                    setInvestments(mappedRetry);
                } catch (retryErr) {
                    console.error("Retry fetch failed:", retryErr);
                    message.error("Session expired. Please login again.");
                }
            } else {
                message.error("Failed to load investments from backend");
            }
        } finally {
            setLoading(false);
        }
    }, [refreshAccessToken]);

    useEffect(() => {
        fetchInvestmentData();
    }, [fetchInvestmentData]);

    // Handle navigation from Dashboard with pre-selected filter
    useEffect(() => {
        if (location.state && location.state.defaultStatus) {
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Helper function to parse date strings
    const parseMaturityDate = (dateStr?: string): Date => {
        if (!dateStr) return new Date(9999, 11, 31);
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? new Date(9999, 11, 31) : parsed;
    };

    const handleMarkAsCompleted = (investment: Investment) => {
        setSelectedInvestment(investment);
        setIsCompletionModalVisible(true);
    };

   const handleConfirmCompletion = async (mode: 'Maturity' | 'Early') => {
    if (!selectedInvestment) return;

    try {
        setLoading(true);

        // Call DELETE API using uk_inv_id (your ID field stores uk_inv_id if exists)
        await deleteInvestment(selectedInvestment.id);

        message.success(
            mode === 'Early'
                ? 'Investment closed early with adjustment'
                : 'Investment marked as completed successfully'
        );

        // Refresh list from backend so state is permanent
        await fetchInvestmentData();

        setIsCompletionModalVisible(false);
        setSelectedInvestment(null);
    } catch (error) {
        console.error("DELETE failed:", error);
        message.error("Failed to update investment status");
    } finally {
        setLoading(false);
    }
};


    const columns: ColumnsType<Investment> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => (
                <span className="investment-id-badge">{text}</span>
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
            sorter: (a: Investment, b: Investment) => a.amount - b.amount,
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
                if (status === 'Closed Early') color = 'error'; // Red badge for Closed Early

                return (
                    <Tag
                        color={color}
                        className={`investment-status-tag ${status === 'Active' ? 'active' : ''}`}
                    // border logic for 'Active' moved to CSS via 'active' class
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
            render: (settlementStatus: 'Completed' | 'Pending' | 'Adjusted' | undefined) => {
                const status = settlementStatus || 'Pending';
                const isCompleted = status === 'Completed';
                const isAdjusted = status === 'Adjusted';

                // Determine class based on status for styling
                let statusClass = 'pending';
                let icon = <ClockCircleOutlined />;

                if (isCompleted) {
                    statusClass = 'completed';
                    icon = <CheckCircleOutlined />;
                } else if (isAdjusted) {
                    statusClass = 'adjusted';
                    icon = <ExclamationCircleOutlined />;
                }

                return (
                    <div className={`settlement-status-container ${statusClass}`}>
                        {icon}
                        <span>{status}</span>
                    </div>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: unknown, record: Investment) => (
                <Tooltip title={record.status === 'Completed' ? 'Already Completed' : 'Mark as Completed'}>
                    <Button
                        type="default" // Changed to default to use our custom class borders
                        icon={<CheckSquareOutlined />}
                        disabled={record.status === 'Completed' || record.status === 'Closed Early'}
                        onClick={() => handleMarkAsCompleted(record)}
                        className={`modern-action-btn ${record.status === 'Active' || record.status === 'Matured' ? 'active-action' : ''}`}
                    />
                </Tooltip>
            ),
        },
    ];

    const dataSource = investments
  .filter(item => {
    const matchPlan = planFilter === "All Plans" || item.planName === planFilter;
    const matchStatus = statusFilter === "All Status" || item.status === statusFilter;
    const matchSearch =
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.investorName ?? "").toString().toLowerCase().includes(searchText.toLowerCase());

    const matchDate = dateRange
      ? (dayjs(item.maturityDate ?? "").isSame(dateRange[0], 'day') ||
         dayjs(item.maturityDate ?? "").isAfter(dateRange[0], 'day')) &&
        (dayjs(item.maturityDate ?? "").isSame(dateRange[1], 'day') ||
         dayjs(item.maturityDate ?? "").isBefore(dateRange[1], 'day'))
      : true;

    return matchPlan && matchStatus && matchSearch && matchDate;
  })
  .sort((a, b) => {
    const dateA = new Date(a.maturityDate ?? "");
    const dateB = new Date(b.maturityDate ?? "");
    return dateA.getTime() - dateB.getTime();
  });



        

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                {/* Breadcrumb removed */}
                <div className="header-flex-row">
                    <div>
                        <Title level={2} className="page-title-compact">Investment Tracking</Title>
                        <Text type="secondary">Sorted by maturity date (nearest first) • Real-time settlement status</Text>
                    </div>
                </div>
            </div>



            <Card bordered={false} className="table-card-compact table-card-top-margin">
                <div className="investment-filter-container">
                    <Input
                        placeholder="Search by ID, Investor, Plan..."
                        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className="investment-search-input"
                        allowClear
                    />
     <Button
  icon={<SearchOutlined />}
  className="investment-csv-btn"
  onClick={() => {
    // Use the already filtered `dataSource` (DO NOT recalc)

    if (dataSource.length === 0) {
      message.warning("No data available to download");
      return;
    }

    const csvRows = [
      ["ID", "Investor", "Plan", "Amount", "Interest", "Maturity Date", "Status", "Settlement", "Maturity Amount"],
      ...dataSource.map(inv => [
        inv.id,
        inv.investorName,
        inv.planName,
        inv.amount,
        inv.interest,
        inv.maturityDate,
        inv.status,
        inv.settlementStatus,
        inv.maturityAmount,
      ]),
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${planFilter === "All Plans" ? "all-investments" : planFilter.toLowerCase()}-investments.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }}
>
  Export CSV
</Button>


                    <Select
  defaultValue="All Plans"
  onChange={setPlanFilter}
  className="investment-filter-select"
>
  <Option value="All Plans">All Plans</Option>
  <Option value="Monthly">Monthly (1 Month)</Option>
  <Option value="Quarterly">Quarterly (3 Months)</Option>
  <Option value="Half Yearly">Half Yearly (6 Months)</Option>
    
  <Option value="Yearly">Yearly (12 Months)</Option>
</Select>

                    <Select
                        defaultValue="All Status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        className="investment-filter-select"
                    >
                        <Option value="All Status">All Status</Option>
                        <Option value="Active">Active</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="Matured">Matured</Option>
                    </Select>
                </div>
                <div className="investment-date-filter-row">
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
    className="investment-date-picker"
  />
</div>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={loading}
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

            <InvestmentCompletionModal
                visible={isCompletionModalVisible}
                onClose={() => setIsCompletionModalVisible(false)}
                onConfirm={handleConfirmCompletion}
                investment={selectedInvestment}
            />
        </div>
    );
};

export default AdminInvestments;