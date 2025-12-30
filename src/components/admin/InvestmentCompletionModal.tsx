import React, { useState, useEffect } from 'react';
import { Modal, Radio, Typography, Space, Divider } from 'antd';
import type { Investment } from '../../types';

const { Text } = Typography;

interface InvestmentCompletionModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (mode: 'Maturity' | 'Early') => void;
    investment: Investment | null;
}

const InvestmentCompletionModal: React.FC<InvestmentCompletionModalProps> = ({
    visible,
    onClose,
    onConfirm,
    investment
}) => {
    const [completionMode, setCompletionMode] = useState<'Maturity' | 'Early'>('Maturity');

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setCompletionMode('Maturity');
        }
    }, [visible]);

    if (!investment) return null;

    const originalInterest = investment.interest || 0;

    const handleConfirm = () => {
        onConfirm(completionMode);
    };

    return (
        <Modal
            open={visible}
            title="Mark Investment as Completed"
            onCancel={onClose}
            onOk={handleConfirm}
            okText="Confirm Completion"
            okButtonProps={{
                danger: completionMode === 'Early',
                style: completionMode === 'Maturity' ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}
            }}
            destroyOnClose
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Text>Select completion type for Investment <Text strong>{investment.id}</Text>:</Text>

                <Radio.Group
                    onChange={(e) => setCompletionMode(e.target.value)}
                    value={completionMode}
                    style={{ width: '100%' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Radio value="Maturity" className="completion-radio-item">
                            <div className="radio-content">
                                <Text strong>Completed on Maturity</Text>
                                <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                                    Full tenure completed. Full interest payout.
                                </Text>
                            </div>
                        </Radio>
                        <Radio value="Early" className="completion-radio-item">
                            <div className="radio-content">
                                <Text strong>Closed Early (Premature Withdrawal)</Text>
                                <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                                    Withdrawn before maturity date. Returns adjusted.
                                </Text>
                            </div>
                        </Radio>
                    </Space>
                </Radio.Group>

                <Divider style={{ margin: '12px 0' }} />

                {completionMode === 'Maturity' ? (
                    <div className="completion-summary maturity">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div className="summary-row">
                                <Text>Total Payout:</Text>
                                <Text strong style={{ color: '#52c41a' }}>
                                    ₹{investment.maturityAmount.toLocaleString()}
                                </Text>
                            </div>
                            <div className="summary-row">
                                <Text type="secondary">Settlement Status:</Text>
                                <Text type="success">Completed</Text>
                            </div>
                        </Space>
                    </div>
                ) : (
                    <div className="completion-summary early">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div className="summary-row">
                                <Text>Interest Payable:</Text>
                                <Text strong type="warning">₹{originalInterest.toLocaleString()}</Text>
                            </div>
                            <div className="summary-row">
                                <Text type="secondary">Settlement Status:</Text>
                                <Text type="warning">Adjusted</Text>
                            </div>
                            <div className="summary-row">
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    * Marked as Closed Early (No Penalty)
                                </Text>
                            </div>
                        </Space>
                    </div>
                )}
            </Space>
        </Modal>
    );
};

export default InvestmentCompletionModal;
