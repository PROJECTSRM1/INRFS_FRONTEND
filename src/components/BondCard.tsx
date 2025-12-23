import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { SafetyCertificateOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import CertificateModal from './CertificateModal';
import PlanDetailsModal from './PlanDetailsModal';
import type { Investment } from '../types';
import { fintechService } from '../services/fintechService';
import '../styles/Bonds.css';


interface BondCardProps {
    investment: Investment;
    userName: string;
}

const BondCard: React.FC<BondCardProps> = ({ investment, userName }) => {
    const [isCertModalVisible, setIsCertModalVisible] = useState(false);
    const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);

    // Prepare data for modals
    // Note: Assuming ROI is fixed or available in investment object. If not, defaulting to 18 as per earlier mock.
    // In a real app, investment would have an ROI field.
    const bondData = {
        ...investment,
        roi: 18 // Default fallback if not present, should conceptually come from investment
    };

    return (
        <>
            <div className="bond-card-v4">
                <div className="bond-card-header">
                    <div className="bond-icon-container">
                        <SafetyCertificateOutlined />
                    </div>
                    <div className="bond-title-group">
                        <h4 className="bond-name">{investment.planName} Bond</h4>
                        <span className="bond-id">ID: {investment.id}</span>
                    </div>
                    <div>
                        <span className="bond-status-active">
                            ACTIVE
                        </span>
                    </div>
                </div>

                <div className="bond-body">
                    <div className="bond-info-row">
                        <div className="bond-info-item">
                            <span className="bond-label">Invested Amount</span>
                            <span className="bond-value-highlight" style={{ color: '#1e3a8a' }}>{fintechService.formatCurrency(investment.amount)}</span>
                        </div>
                        <div className="bond-info-item" style={{ alignItems: 'flex-start' }}>
                            <span className="bond-label">Maturity Value</span>
                            <span className="bond-value-highlight" style={{ color: '#166534' }}>
                                {fintechService.formatCurrency(investment.maturityAmount)}
                            </span>
                        </div>
                    </div>

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div className="bond-info-item">
                                <span className="bond-label">Tenure</span>
                                <span className="bond-value" style={{ fontSize: '15px' }}>{investment.tenure} Months</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="bond-info-item">
                                <span className="bond-label">Interest</span>
                                <span className="bond-value" style={{ fontSize: '15px' }}>18% p.a.</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="bond-info-item">
                                <span className="bond-label">Date</span>
                                <span className="bond-value">{investment.date}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="bond-info-item">
                                <span className="bond-label">INFRC No.</span>
                                <span className="bond-value" style={{ wordBreak: 'break-all', fontSize: '13px' }}>{investment.infrcNumber}</span>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="bond-footer">
                    <Button
                        className="btn-bond-action btn-bond-secondary"
                        icon={<EyeOutlined />}
                        onClick={() => setIsPlanModalVisible(true)}
                        style={{ flex: 4 }}
                    >
                        See Plan
                    </Button>
                    <Button
                        className="btn-bond-action btn-bond-primary"
                        icon={<DownloadOutlined />}
                        onClick={() => setIsCertModalVisible(true)}
                        style={{ flex: 1, minWidth: '40px' }}
                    />
                </div>
            </div>

            {/* Modals */}
            <CertificateModal
                visible={isCertModalVisible}
                onClose={() => setIsCertModalVisible(false)}
                bond={bondData}
                userName={userName}
            />

            <PlanDetailsModal
                visible={isPlanModalVisible}
                onClose={() => setIsPlanModalVisible(false)}
                plan={{
                    planName: investment.planName,
                    roi: 18,
                    tenure: investment.tenure,
                    minAmount: investment.amount
                }}
            />
        </>
    );
};

export default BondCard;
