import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Input, Checkbox, Button, message, Card, Row, Col } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import { INVESTMENT_PLANS } from '../../data/mockData';
import { fintechService } from '../../services/fintechService';
import PaymentModal from '../../components/PaymentModal';
import '../../styles/theme.css';
import '../../styles/complete-investment.css';

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
        <div className="complete-investment-page">
            <Title level={2} className="page-main-title">Complete Your Investment</Title>

            {/* Blue Info Box */}
            <div className="info-box-blue">
                <InfoCircleFilled className="info-icon" />
                <div className="info-content">
                    <Text strong className="info-title">Selected Plan: {plan.name}</Text>
                    <Text className="info-desc">Enter your investment amount to see calculated returns</Text>
                </div>
            </div>

            <Row gutter={[32, 32]} className="investment-main-row">
                {/* Left Col: Inputs & Summary */}
                <Col xs={24} lg={14}>
                    <div className="input-section">
                        <Text strong className="input-label">Investment Amount</Text>
                        <Input
                            prefix="$"
                            type="number"
                            placeholder="0"
                            className="investment-amount-input"
                            value={amount}
                            onChange={handleAmountChange}
                            size="large"
                        />
                        <Text type="secondary" className="input-helper">
                            Minimum: {fintechService.formatCurrency(plan.minAmount)} | Maximum: $1,000,000
                        </Text>
                    </div>

                    <div className="investment-summary-section">
                        <Title level={4} className="section-subtitle">Investment Summary</Title>

                        <div className="summary-row">
                            <Text className="summary-label">Plan Type:</Text>
                            <Text strong className="summary-value">{plan.name}</Text>
                        </div>
                        <div className="summary-row">
                            <Text className="summary-label">Investment Amount:</Text>
                            <Text strong className="summary-value">{amount ? fintechService.formatCurrency(Number(amount)) : '$0'}</Text>
                        </div>
                        <div className="summary-row">
                            <Text className="summary-label">Interest Rate:</Text>
                            <Text strong className="summary-value">{plan.roi}%</Text>
                        </div>
                        <div className="summary-row">
                            <Text className="summary-label">Expected Returns:</Text>
                            <Text strong className="summary-value-green">{fintechService.formatCurrency(returns)}</Text>
                        </div>

                        <div className="divider-line" />

                        <div className="summary-row total-row">
                            <Text strong className="total-label">Total Maturity Amount:</Text>
                            <Text strong className="total-value-blue">{fintechService.formatCurrency(totalMaturity)}</Text>
                        </div>
                    </div>

                    <div className="terms-section">
                        <Text strong className="terms-title">Terms & Conditions</Text>
                        <div className="terms-scrollbox">
                            <ol className="terms-list">
                                <li>Investment is locked for the selected tenure period.</li>
                                <li>Returns are calculated based on the fixed interest rate.</li>
                                <li>Digital bond will be issued immediately after payment confirmation.</li>
                                <li>Early withdrawal may incur penalties as per policy.</li>
                                <li>All investments are subject to regulatory compliance.</li>
                                <li>Interest is calculated on a simple interest basis.</li>
                                <li>Maturity amount will be credited to your registered account.</li>
                            </ol>
                        </div>
                        <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="terms-checkbox">
                            I have read and agree to the Terms & Conditions
                        </Checkbox>
                    </div>

                    <div className="action-buttons-row">
                        <Button size="large" className="btn-hero-ghost-dark action-btn" onClick={() => navigate('/dashboard/plans')}>
                            Back to Plans
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="btn-solid-primary action-btn"
                            onClick={handleProceed}
                            loading={loading}
                        >
                            Proceed to Payment
                        </Button>
                    </div>
                </Col>

                {/* Right Col: Dark Display Card (Desktop Only mostly) */}
                <Col xs={24} lg={10}>
                    <Card className="returns-card-blue" bordered={false}>
                        <Text className="dark-card-label">Calculated Returns</Text>
                        <Title level={1} className="dark-card-value">
                            {fintechService.formatCurrency(returns)}
                        </Title>
                        <Text className="dark-card-sub">
                            Total Maturity: {fintechService.formatCurrency(totalMaturity)}
                        </Text>
                    </Card>
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
