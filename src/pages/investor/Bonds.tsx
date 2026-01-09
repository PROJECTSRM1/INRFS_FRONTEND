import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Empty, Spin, message } from 'antd';
import { DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { investmentService, type Investment } from '../../services/investmentService';
import { fintechService } from '../../services/fintechService';
import { getPlanNameById, getPlanInterestRateById } from '../../utils/planTypeMapping';
import CertificateModal from '../../components/CertificateModal';

import '../../styles/dashboard.css';

interface BondRecord extends Omit<Investment, 'id'> {
    id?: string | number;
    roi?: number;
    amount?: number;
    planName?: string;
}

const Bonds: React.FC = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const [selectedBond, setSelectedBond] = useState<BondRecord | null>(null);
    const [isCertModalVisible, setIsCertModalVisible] = useState(false);

    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch investments from API on component mount
    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                setLoading(true);
                const data = await investmentService.getInvestments();
                console.log('Fetched investments from API:', data);
                setInvestments(data);
            } catch (error) {
                console.error('Failed to fetch investments:', error);
                message.warning('Using local investment data if available');
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const handleDownload = (investment: Investment) => {
        const bondData = {
            ...investment,
            roi: investment.interest_rate || getPlanInterestRateById(investment.plan_type_id || 0),
            amount: investment.principal_amount,
            planName: investment.plan_name || getPlanNameById(investment.plan_type_id || 0),
            id: investment.uk_inv_id || investment.id
        };
        setSelectedBond(bondData);
        setIsCertModalVisible(true);
    };

    const columns = [
        {
            title: 'Bond ID',
            key: 'bond_id',
            render: (_: unknown, record: Investment) => (
                <span className="investment-id-text">
                    {record.uk_inv_id ? `BOND-${record.uk_inv_id.split('-').pop()}` : `BOND-${record.id?.toString().substring(0, 8)}`}
                </span>
            )
        },
        {
            title: 'Plan Name',
            key: 'plan_name',
            render: (_: unknown, record: Investment) => {
                const planName = record.plan_name || getPlanNameById(record.plan_type_id || 0);
                return <span className="plan-name-text">{planName}</span>;
            }
        },
        {
            title: 'Invested Amount',
            dataIndex: 'principal_amount',
            key: 'principal_amount',
            render: (val: number) => <span className="amount-text">{val ? fintechService.formatCurrency(val) : '₹0'}</span>
        },
        {
            title: 'Returns (ROI)',
            key: 'roi',
            render: (_: unknown, record: Investment) => {
                const roi = record.interest_rate || getPlanInterestRateById(record.plan_type_id || 0);
                return <span className="returns-text">{roi}% p.a.</span>;
            }
        },
        {
            title: 'Maturity Date',
            dataIndex: 'maturity_date',
            key: 'maturity_date',
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
            title: 'Status',
            key: 'status',
            render: (_: unknown, record: Investment) => {
                const status = record.status || (record.is_active ? 'ACTIVE' : 'INACTIVE');
                const tagClass = status.toUpperCase() === 'ACTIVE' ? 'status-tag-active' : 'status-tag-default';
                return <Tag className={tagClass}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Investment) => (
                <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    type="primary"
                    className="action-btn-download"
                    onClick={() => handleDownload(record)}
                >
                    Download Certificate
                </Button>
            )
        }
    ];

    if (loading) {
        return (
            <div className="investor-dashboard-refined">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Spin size="large" tip="Loading bonds..." />
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
                        pagination={{ pageSize: 15, showSizeChanger: true }}
                        className="bonds-table"
                        scroll={{ x: 1000 }}
                    />
                </div>
            ) : (
                <div className="empty-bonds-container">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="empty-bonds-content">
                                <h3 className="empty-bonds-title">No Bonds Issued Yet</h3>
                                <p className="empty-bonds-desc">Your investment bonds will appear here once they are verified and issued.</p>
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
