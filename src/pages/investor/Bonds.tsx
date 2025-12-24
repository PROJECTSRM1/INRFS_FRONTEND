import React, { useState } from 'react';
import { Table, Tag, Button, Empty } from 'antd';
import { EyeOutlined, DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fintechService } from '../../services/fintechService';
import CertificateModal from '../../components/CertificateModal';
import '../../styles/dashboard.css';

const Bonds: React.FC = () => {
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
            title: 'Bond ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <span className="bond-id-text">{text}</span>
        },
        {
            title: 'Plan Name',
            dataIndex: 'planName',
            key: 'planName',
            render: (text: string) => <span className="bond-plan-text">{text} Bond</span>
        },
        {
            title: 'Invested Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => <span className="bond-amount-text">{fintechService.formatCurrency(val)}</span>
        },
        {
            title: 'Maturity Value',
            dataIndex: 'maturityAmount',
            key: 'maturityAmount',
            render: (val: number) => <span className="bond-maturity-text">{fintechService.formatCurrency(val)}</span>
        },
        {
            title: 'Tenure',
            dataIndex: 'tenure',
            key: 'tenure',
            render: (val: number) => <span>{val} Months</span>
        },
        {
            title: 'Interest',
            key: 'interest',
            render: () => <span>18% p.a.</span>
        },
        {
            title: 'INFRC No.',
            dataIndex: 'infrcNumber',
            key: 'infrcNumber',
            render: (text: string) => <span className="infrc-text">{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag className="bond-status-tag-active">{status}</Tag>
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
                <div className="bond-action-buttons">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        className="bond-action-btn-view"
                    >
                        See Plan
                    </Button>
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
                        dataSource={investments.map((inv, idx) => ({ ...inv, key: idx }))}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        className="bonds-table"
                        scroll={{ x: 1400 }}
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
