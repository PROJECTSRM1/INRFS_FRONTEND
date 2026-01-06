import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Button, Empty, Spin, message } from 'antd';
import { DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fintechService } from '../../services/fintechService';
import { investmentService, type Investment } from '../../services/investmentService';
import { getPlanNameById, getPlanDurationById, getPlanInterestRateById } from '../../utils/planTypeMapping';
import CertificateModal from '../../components/CertificateModal';
import '../../styles/dashboard.css';

const { Title } = Typography;

const MyInvestments: React.FC = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const [selectedBond, setSelectedBond] = useState<any>(null);
    const [isCertModalVisible, setIsCertModalVisible] = useState(false);

    // API state
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);


    // Fetch investments from API on component mount
    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                setLoading(true);
                const data = await investmentService.getInvestments();
                console.log('Fetched investments:', data);
                setInvestments(data);
            } catch (error: any) {
                console.error('Error fetching investments:', error);
                message.error('Failed to load investments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const handleDownload = (investment: any) => {
        // Map API fields for certificate with plan type mapping
        const bondData = {
            ...investment,
            roi: investment.interest_rate || getPlanInterestRateById(investment.plan_type_id || 0),
            amount: investment.principal_amount,
            planName: investment.plan_name || getPlanNameById(investment.plan_type_id || 0),
            id: investment.uk_inv_id
        };
        setSelectedBond(bondData);
        setIsCertModalVisible(true);
    };

    const columns = [
        {
            title: 'Investment ID',
            dataIndex: 'uk_inv_id',
            key: 'uk_inv_id',
            render: (text: string) => <span className="investment-id-text">{text || 'N/A'}</span>
        },
        {
            title: 'Plan Name',
            key: 'plan_name',
            render: (_: any, record: Investment) => {
                // Use plan_name if available from API, otherwise map from plan_type_id
                const planName = record.plan_name || getPlanNameById(record.plan_type_id || 0);
                return <span className="plan-name-text">{planName}</span>;
            }
        },
        {
            title: 'Amount',
            dataIndex: 'principal_amount',
            key: 'principal_amount',
            render: (val: number) => <span className="amount-text">{val ? fintechService.formatCurrency(val) : '₹0'}</span>
        },
        {
            title: 'Returns',
            dataIndex: 'interest_amount',
            key: 'interest_amount',
            render: (val: number) => <span className="returns-text">{val ? fintechService.formatCurrency(val) : '₹0'}</span>
        },
        {
            title: 'Maturity',
            dataIndex: 'maturity_amount',
            key: 'maturity_amount',
            render: (val: number) => <span className="maturity-text">{val ? fintechService.formatCurrency(val) : '₹0'}</span>
        },
        {
            title: 'Tenure',
            key: 'tenure',
            render: (_: any, record: Investment) => {
                // Priority: 1. duration_months from API, 2. mapped from plan_type_id, 3. calculated from dates
                let months = record.duration_months;

                if (!months && record.plan_type_id) {
                    months = getPlanDurationById(record.plan_type_id);
                }

                if (!months && record.maturity_date && record.created_date) {
                    const start = new Date(record.created_date);
                    const end = new Date(record.maturity_date);
                    months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
                }

                return <span>{months || 'N/A'} {months ? 'Months' : ''}</span>;
            }
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: Investment) => {
                // Use status if available, otherwise derive from is_active
                const status = record.status || (record.is_active ? 'ACTIVE' : 'INACTIVE');
                const statusUpper = status.toUpperCase();
                const tagClass = statusUpper === 'ACTIVE' ? 'status-tag-active' : 'status-tag-default';
                return <Tag className={tagClass}>{statusUpper}</Tag>;
            }
        },
        {
            title: 'Date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (date: string) => {
                if (!date) return 'N/A';
                return new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Investment) => (
                <div className="action-buttons-group">
                    {/* <Button
                        size="small"
                        icon={<EyeOutlined />}
                        className="action-btn-view"
                        onClick={() => navigate('/dashboard/plans')}
                    >
                        See Plan
                    </Button> */}
                    <Button
                        size="small"
                        icon={<DownloadOutlined />}
                        type="primary"
                        className="action-btn-download"
                        onClick={() => handleDownload(record)}
                    >
                        Download
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="investor-dashboard-refined">
            <Button
                size="small"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/dashboard')}
                className="btn-back-refined btn-back-margin"
            >
                Back to Dashboard
            </Button>

            <Title level={2} className="section-header-title">My Investments</Title>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Spin size="large" tip="Loading your investments..." />
                </div>
            ) : investments.length > 0 ? (
                <div className="investments-table-card">
                    <Table
                        columns={columns}
                        dataSource={investments.map((inv, idx) => ({ ...inv, key: inv.id || idx }))}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        className="investments-table"
                        scroll={{ x: 1200 }}
                    />
                </div>
            ) : (
                <div className="empty-investments-container">
                    <Empty description="You don't have any investments yet." />
                </div>
            )}

            <CertificateModal
                visible={isCertModalVisible}
                onClose={() => setIsCertModalVisible(false)}
                bond={selectedBond}
                userName={user?.name || ''}
            />
        </div>
    );
};

export default MyInvestments;
