import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Input, Checkbox, Button, message, Row, Col } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import { INVESTMENT_PLANS } from '../../data/mockData';
import { fintechService } from '../../services/fintechService';
import PaymentModal from '../../components/PaymentModal';
import '../../styles/dashboard.css';

const { Title, Text } = Typography;

const CompleteInvestment: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { addInvestment, investments } = useAppContext();

    const plan = INVESTMENT_PLANS.find(p => p.id === planId) || INVESTMENT_PLANS[0];

    const [amount, setAmount] = useState<number | ''>('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    // Calculated values
    const [returns, setReturns] = useState(0);
    const [totalMaturity, setTotalMaturity] = useState(0);

    useEffect(() => {
        if (amount && typeof amount === 'number') {
            const result = fintechService.calculateReturns(amount, plan.roi, plan.duration);
            setReturns(result.interest);
            setTotalMaturity(result.maturityAmount);
        } else {
            setReturns(0);
            setTotalMaturity(0);
        }
    }, [amount, plan.roi, plan.duration]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0) {
            setAmount(val);
        } else if (e.target.value === '') {
            setAmount('');
        }
    };

    const handleProceed = () => {
        if (!amount || amount < plan.minAmount) {
            message.error(`Minimum investment amount is ${fintechService.formatCurrency(plan.minAmount)}`);
            return;
        }
        if (!agreed) {
            message.error('Please accept the Terms & Conditions');
            return;
        }
        setIsPaymentModalVisible(true);
    };

    const handlePaymentConfirm = () => {
        setLoading(true);
        // Simulate processing time after payment method selected
        setTimeout(() => {
            const newInvestment = {
                id: fintechService.generateInvestmentId(investments.length),
                planId: plan.id,
                planName: plan.name,
                amount: Number(amount),
                returns: returns,
                maturityAmount: totalMaturity,
                tenure: plan.duration,
                status: 'Active' as const,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                startDate: new Date().toISOString(),
                infrcNumber: `${plan.infrcPrefix}-${Math.floor(100000 + Math.random() * 900000)}`
            };

            addInvestment(newInvestment);
            setLoading(false);
            setIsPaymentModalVisible(false);
            message.success('Investment Successful!');
            navigate('/dashboard/bonds');
        }, 1000);
    };

    return (
        <div className="investor-dashboard-refined">
            <Typography.Title level={2} className="page-main-title">Complete Your Investment</Typography.Title>

            {/* Selected Plan Alert Banner */}
            <div className="selected-plan-banner">
                <InfoCircleFilled className="banner-icon" />
                <div className="banner-content">
                    <Text strong className="banner-title">Selected Plan: <span style={{ color: '#2563eb' }}>{plan.name}</span></Text>
                    <Text className="banner-desc">Enter your investment amount to see calculated returns</Text>
                </div>
            </div>

            <Row gutter={[24, 24]} className="investment-content-grid">
                {/* Row 1: Input and Returns (Side-by-Side on Desktop) */}
                <Col xs={24} md={12}>
                    <div className="content-card-refined h-full">
                        <Title level={4} className="card-section-title">Investment Amount</Title>
                        <Input
                            prefix="₹"
                            type="number"
                            placeholder="0"
                            className="investment-amount-input large-input"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        <Text type="secondary" className="input-helper-text">
                            Minimum: {fintechService.formatCurrency(plan.minAmount)} | Maximum: ₹1,000,000
                        </Text>
                    </div>
                </Col>
                <Col xs={24} md={12}>
                    <div className="returns-card-dark h-full">
                        <Text className="returns-label">Calculated Returns</Text>
                        <Title level={1} className="returns-value">
                            {fintechService.formatCurrency(returns)}
                        </Title>
                        <div className="returns-divider" />
                        <Text className="returns-sub">
                            Total Maturity: <span className="highlight-white">{fintechService.formatCurrency(totalMaturity)}</span>
                        </Text>
                    </div>
                </Col>

                {/* Row 2: Investment Summary */}
                <Col span={24}>
                    <div className="content-card-refined">
                        <Title level={4} className="card-section-title">Investment Summary</Title>
                        <div className="summary-grid-clean">
                            <div className="summary-item">
                                <Text className="s-label">Plan Type</Text>
                                <Text strong className="s-value">{plan.name}</Text>
                            </div>
                            <div className="summary-item">
                                <Text className="s-label">Investment Amount</Text>
                                <Text strong className="s-value">{amount ? fintechService.formatCurrency(Number(amount)) : '₹0'}</Text>
                            </div>
                            <div className="summary-item">
                                <Text className="s-label">Interest Rate</Text>
                                <Text strong className="s-value">{plan.roi}%</Text>
                            </div>
                            <div className="summary-item">
                                <Text className="s-label">Expected Returns</Text>
                                <Text strong className="s-value-green">{fintechService.formatCurrency(returns)}</Text>
                            </div>
                        </div>
                        <div className="total-maturity-bar">
                            <Text strong className="tm-label">Total Maturity Amount:</Text>
                            <Text strong className="tm-value">{fintechService.formatCurrency(totalMaturity)}</Text>
                        </div>
                    </div>
                </Col>

                {/* Row 3: Terms & Conditions */}
                <Col span={24}>
                    <div className="content-card-refined">
                        <Title level={4} className="card-section-title">Terms & Conditions</Title>
                        <div className="terms-list-clean">
                            <ol>
                                <li>Investment is locked for the selected tenure period.</li>
                                <li>Returns are calculated based on the fixed interest rate.</li>
                                <li>Digital bond will be issued immediately after payment confirmation.</li>
                                <li>Early withdrawal may incur penalties as per policy.</li>
                                <li>All investments are subject to regulatory compliance.</li>
                                <li>Interest is calculated on a simple interest basis.</li>
                                <li>Maturity amount will be credited to your registered account.</li>
                            </ol>
                        </div>
                        <Checkbox
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="terms-checkbox-clean"
                        >
                            I have read and agree to the Terms & Conditions
                        </Checkbox>
                    </div>
                </Col>

                {/* Row 4: Action Buttons */}
                <Col span={24}>
                    <div className="action-buttons-container">
                        <Button
                            size="large"
                            className="btn-outline-clean"
                            onClick={() => navigate('/dashboard/plans')}
                        >
                            Back to Plans
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="btn-solid-dark"
                            onClick={handleProceed}
                            loading={loading}
                        >
                            Proceed to Payment
                        </Button>
                    </div>
                </Col>
            </Row>

            <PaymentModal
                visible={isPaymentModalVisible}
                onClose={() => setIsPaymentModalVisible(false)}
                onConfirm={handlePaymentConfirm}
                amount={Number(amount)}
                returns={returns}
                planName={plan.name}
                loading={loading}
            />
        </div>
    );
};

export default CompleteInvestment;
