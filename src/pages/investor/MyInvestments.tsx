import React, { useState } from 'react';
import { Typography, Table, Tag, Button, Empty } from 'antd';
import { EyeOutlined, DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fintechService } from '../../services/fintechService';
import CertificateModal from '../../components/CertificateModal';
import '../../styles/theme.css';
import '../../styles/my-investments.css';

const { Title } = Typography;

const MyInvestments: React.FC = () => {
    const { investments, user } = useAppContext();
    const navigate = useNavigate();
    const [selectedBond, setSelectedBond] = useState<any>(null);
    const [isCertModalVisible, setIsCertModalVisible] = useState(false);

    const handleDownload = (investment: any) => {
        setSelectedBond({ ...investment, roi: 18 });
        setIsCertModalVisible(true);
    };

    const columns = [
        {
            title: 'Investment ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <span className="investment-id-text">{text}</span>
        },
        {
            title: 'Plan Name',
            dataIndex: 'planName',
            key: 'planName',
            render: (text: string) => <span className="plan-name-text">{text}</span>
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => <span className="amount-text">{fintechService.formatCurrency(val)}</span>
        },
        {
            title: 'Returns',
            dataIndex: 'returns',
            key: 'returns',
            render: (val: number) => <span className="returns-text">{fintechService.formatCurrency(val)}</span>
        },
        {
            title: 'Maturity',
            dataIndex: 'maturityAmount',
            key: 'maturityAmount',
            render: (val: number) => <span className="maturity-text">{fintechService.formatCurrency(val)}</span>
        },
        {
            title: 'Tenure',
            dataIndex: 'tenure',
            key: 'tenure',
            render: (val: number) => <span>{val} Months</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag className="status-tag-active">{status}</Tag>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="action-buttons-group">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        className="action-btn-view"
                    >
                        View
                    </Button>
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
        <div className="portfolio-refined">
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/dashboard')}
                style={{ marginBottom: 24 }}
            >
                Back to Dashboard
            </Button>

            <Title level={2} className="section-header-title">My Investments</Title>

            {investments.length > 0 ? (
                <div className="investments-table-card">
                    <Table
                        columns={columns}
                        dataSource={investments.map((inv, idx) => ({ ...inv, key: idx }))}
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
