import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Empty, Spin, message } from 'antd';
import { DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fintechService } from '../../services/fintechService';
import { investmentService, type Investment } from '../../services/investmentService';
import CertificateModal from '../../components/CertificateModal';
import '../../styles/dashboard.css';

const Bonds: React.FC = () => {
    const { investments: contextInvestments, user } = useAppContext();
    const navigate = useNavigate();
    const [selectedBond, setSelectedBond] = useState<any>(null);
    const [isCertModalVisible, setIsCertModalVisible] = useState(false);
    const [apiInvestments, setApiInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch investments from API on component mount
    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                setLoading(true);
                const investments = await investmentService.getInvestments();
                console.log('Fetched investments from API:', investments);
                setApiInvestments(investments);
            } catch (error) {
                console.error('Failed to fetch investments:', error);
                message.warning('Using local investment data');
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    // Use API investments if available, otherwise fallback to context
    const investments = apiInvestments.length > 0 ? apiInvestments : contextInvestments;

    const handleDownload = (investment: any) => {
        setSelectedBond({ ...investment, roi: 18 });
        setIsCertModalVisible(true);
    };


    const columns: any[] = [
        {
            title: 'Bond ID',
            dataIndex: 'wk_inv_id',
            key: 'wk_inv_id',
            render: (text: string, record: Investment) => (
                <span className="bond-id-text">{text || record.id || 'N/A'}</span>
            )
        },
        {
            title: 'Plan Name',
            dataIndex: 'plan_name',
            key: 'plan_name',
            render: (text: string, record: Investment) => (
                <span className="bond-plan-text">{text || record.planName || 'N/A'}</span>
            )
        },
        {
            title: 'Invested Amount',
            dataIndex: 'principal_amount',
            key: 'principal_amount',
            render: (val: number, record: Investment) => (
                <span className="bond-amount-text">
                    {fintechService.formatCurrency(val || record.amount || 0)}
                </span>
            )
        },
        {
            title: 'Maturity Value',
            dataIndex: 'maturity_amount',
            key: 'maturity_amount',
            render: (val: number, record: Investment) => (
                <span className="bond-maturity-text">
                    {fintechService.formatCurrency(val || record.maturityAmount || 0)}
                </span>
            )
        },
        {
            title: 'Tenure',
            dataIndex: 'duration_months',
            key: 'duration_months',
            render: (val: number, record: Investment) => (
                <span>{val || record.tenure || 'N/A'} Months</span>
            )
        },
        {
            title: 'Interest',
            dataIndex: 'interest_rate',
            key: 'interest_rate',
            render: (val: number) => <span>{val ? `${val}% p.a.` : '18% p.a.'}</span>
        },
        {
            title: 'User ID',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text: number) => <span>{text || 'N/A'}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag className={`bond-status-tag-${status?.toLowerCase() || 'active'}`}>
                    {status || 'Active'}
                </Tag>
            )
        },
        {
            title: 'Created Date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (date: string, record: Investment) => {
                const displayDate = date || record.date || record.startDate;
                if (!displayDate) return 'N/A';

                try {
                    const dateObj = new Date(displayDate);
                    return dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                } catch {
                    return displayDate;
                }
            }
        },
        {
            title: 'Maturity Date',
            dataIndex: 'maturity_date',
            key: 'maturity_date',
            render: (date: string) => {
                if (!date) return 'N/A';

                try {
                    const dateObj = new Date(date);
                    return dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                } catch {
                    return date;
                }
            }
        },
        {
            title: 'Bond Certificate',
            dataIndex: 'bond_certificate',
            key: 'bond_certificate',
            render: (cert: string) => (
                <span className="infrc-text">{cert || 'Pending'}</span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            render: (_: any, record: any) => (
                <div className="bond-action-buttons">
                    <Button
                        size="small"
                        icon={<DownloadOutlined />}
                        type="primary"
                        className="bond-action-btn-download"
                        onClick={() => handleDownload(record)}
                    >
                        Download
                    </Button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="investor-dashboard-refined">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Spin size="large" tip="Loading investments..." />
                </div>
            </div>
        );
    }

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

            <div className="bonds-page-header">
                <h2 className="bonds-title">My Investment Bonds</h2>
                <div className="bonds-subtitle">Secure access to your verified digital investment certificates</div>
            </div>

            {investments.length > 0 ? (
                <div className="bonds-table-card">
                    <Table
                        columns={columns}
                        dataSource={investments.map((inv, idx) => ({ ...inv, key: inv.id || idx }))}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        className="bonds-table"
                        scroll={{ x: 1800 }}
                    />
                </div>
            ) : (
                <div className="empty-bonds-container">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="empty-bonds-content">
                                <h3 className="empty-bonds-title">No Bonds Issued Yet</h3>
                                <p className="empty-bonds-desc">Complete an investment plan to receive your certified digital bonds.</p>
                            </div>
                        }
                    />
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

export default Bonds;
