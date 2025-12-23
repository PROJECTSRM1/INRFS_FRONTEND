import React from 'react';
import { Modal, Button, Typography, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import '../styles/Bonds.css';

const { Title, Text } = Typography;

interface PlanDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    plan: {
        planName: string;
        roi: number;
        tenure: number;
        minAmount?: number;
    } | null;
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({ visible, onClose, plan }) => {
    if (!plan) return null;

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            className="plan-details-modal"
            centered
            closeIcon={<CloseOutlined style={{ fontSize: '18px' }} />}
        >
            <div className="plan-details-header">
                <Title level={3} className="plan-detail-title">{plan.planName} Plan</Title>
                <Text type="secondary">Comprehensive details about your investment plan</Text>
            </div>

            <div className="plan-info-grid">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text type="secondary" className="bond-label">INTEREST RATE</Text><br />
                        <Title level={4} style={{ margin: 0, color: '#3b82f6' }}>{plan.roi}% p.a.</Title>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary" className="bond-label">DURATION</Text><br />
                        <Title level={4} style={{ margin: 0 }}>{plan.tenure} Months</Title>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary" className="bond-label">PAYOUT FREQUENCY</Text><br />
                        <Text strong>At Maturity</Text>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary" className="bond-label">LOCK-IN PERIOD</Text><br />
                        <Text strong>{plan.tenure} Months</Text>
                    </Col>
                </Row>
            </div>

            <div style={{ padding: '0 12px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>Plan Features & Terms</Title>
                <ul className="plan-terms-list">
                    <li>Fixed interest rate guaranteed for the entire tenure.</li>
                    <li>Digital Bond Certificate issued immediately upon investment.</li>
                    <li>No early withdrawal penalty after 50% of tenure completion.</li>
                    <li>Returns are subject to applicable taxes as per government regulations.</li>
                    <li>Principal and Interest credited directly to bank account on maturity.</li>
                    <li>Secured against infrastructure assets (low risk).</li>
                </ul>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <Button type="primary" size="large" onClick={onClose} style={{ width: '200px', borderRadius: '8px' }}>
                    Close Details
                </Button>
            </div>
        </Modal>
    );
};

export default PlanDetailsModal;
