import React from 'react';
import { Modal, Typography, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fintechService } from '../services/fintechService';
import '../styles/Bonds.css';

const { Title } = Typography;

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: number;
    returns: number;
    planName: string;
    loading?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    visible,
    onClose,
    onConfirm,
    amount,
    returns,
    planName,
    loading = false
}) => {
    const handlePayment = (method: string) => {
        message.loading(`Processing ${method} payment...`, 1.5)
            .then(() => {
                onConfirm();
            });
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={450}
            className="payment-modal"
            centered
            closeIcon={<CloseOutlined />}
        >
            <div className="payment-modal-header">
                <Title level={3} style={{ margin: 0, textAlign: 'left' }}>Complete Payment</Title>
            </div>

            <div className="payment-card-summary">
                <div className="payment-summary-row">
                    <span>Plan Type:</span>
                    <span className="payment-summary-value">{planName}</span>
                </div>
                <div className="payment-summary-row">
                    <span>Amount to Pay:</span>
                    <span className="payment-summary-value" style={{ fontWeight: 800 }}>
                        {fintechService.formatCurrency(amount)}
                    </span>
                </div>
                <div className="payment-summary-row">
                    <span>Expected Returns:</span>
                    <span className="payment-summary-value highlight">
                        {fintechService.formatCurrency(returns)}
                    </span>
                </div>
            </div>

            <div className="payment-options-list">
                <button className="payment-option-btn" onClick={() => handlePayment('Stripe')}>
                    <img src="/assets/stripe-logo.png" alt="" className="payment-logo-icon" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span>Pay with Stripe</span>
                </button>
                <button className="payment-option-btn" onClick={() => handlePayment('PayPal')}>
                    <img src="/assets/paypal-logo.png" alt="" className="payment-logo-icon" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span>Pay with PayPal</span>
                </button>
                <button className="payment-option-btn" onClick={() => handlePayment('Bank Transfer')}>
                    <span>🏛️ Bank Transfer</span>
                </button>
            </div>

            <button className="payment-cancel-btn" onClick={onClose} disabled={loading}>
                Cancel
            </button>
        </Modal>
    );
};

export default PaymentModal;
