import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Input, Checkbox, Button, message, Row, Col, Spin } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import { INVESTMENT_PLANS } from '../../data/mockData';
import { fintechService } from '../../services/fintechService';
import { plansService, type Plan } from '../../services/plansService';
import { investmentService } from '../../services/investmentService';
import PaymentModal from '../../components/PaymentModal';
import '../../styles/dashboard.css';

const { Title, Text } = Typography;

const CompleteInvestment: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { addInvestment, investments } = useAppContext();

    // State for API plan data
    const [apiPlan, setApiPlan] = useState<Plan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);

    // Fallback to mock data
    const mockPlan = INVESTMENT_PLANS.find(p => p.id === planId) || INVESTMENT_PLANS[0];

    const [amount, setAmount] = useState<number | ''>('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    // Fetch plan data from API on component mount
    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setLoadingPlan(true);
                const plans = await plansService.getPlans();

                // Try to match by plan ID (convert planId to number if needed)
                const matchedPlan = plans.find(p => p.id?.toString() === planId);

                if (matchedPlan) {
                    setApiPlan(matchedPlan);
                    console.log('Fetched plan from API:', matchedPlan);
                } else {
                    console.warn('Plan not found in API, using mock data');
                }
            } catch (error) {
                console.error('Error fetching plan:', error);
                message.warning('Using offline plan data');
            } finally {
                setLoadingPlan(false);
            }
        };

        fetchPlan();
    }, [planId]);

    // Use API plan if available, otherwise fallback to mock
    const planTypeId = apiPlan?.id || parseInt(planId || '1');

    // Map API plan fields to mock plan structure for compatibility
    const displayPlan = apiPlan ? {
        id: planId || '',
        name: apiPlan.name,
        roi: apiPlan.returns_percentage,
        duration: apiPlan.duration_months,
        minAmount: 1000, // Default minimum, adjust as needed
        maxAmount: 1000000,
        infrcPrefix: 'INRFS'
    } : mockPlan;

    // Derived values
    const amountNum = typeof amount === 'number' ? amount : 0;
    const calculation = fintechService.calculateReturns(amountNum, displayPlan.roi);
    const returns = calculation.interest;
    const totalMaturity = calculation.maturityAmount;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0) {
            setAmount(val);
        } else if (e.target.value === '') {
            setAmount('');
        }
    };

    const handleProceed = () => {
        if (!amount || amount < displayPlan.minAmount) {
            message.error(`Minimum investment amount is ${fintechService.formatCurrency(displayPlan.minAmount)}`);
            return;
        }
        if (!agreed) {
            message.error('Please accept the Terms & Conditions');
            return;
        }
        setIsPaymentModalVisible(true);
    };

    const handlePaymentConfirm = async () => {
        setLoading(true);

        try {
            // Prepare payload for POST API
            const payload = {
                principal_amount: Number(amount),
                plan_type_id: planTypeId,
                maturity_date: investmentService.calculateMaturityDate(displayPlan.duration),
                created_date: investmentService.getCurrentDate()
            };

            console.log('Submitting investment:', payload);

            // Call the POST API
            const response = await investmentService.createInvestment(payload);

            console.log('Investment created:', response);

            // Also add to local context for immediate UI update
            const newInvestment = {
                id: fintechService.generateInvestmentId(investments.length),
                planId: displayPlan.id,
                planName: displayPlan.name,
                amount: Number(amount),
                returns: returns,
                maturityAmount: totalMaturity,
                tenure: displayPlan.duration,
                status: 'Active' as const,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                startDate: new Date().toISOString(),
                infrcNumber: `${displayPlan.infrcPrefix}-${Math.floor(100000 + Math.random() * 900000)}`
            };

            addInvestment(newInvestment);
            setIsPaymentModalVisible(false);
            message.success('Investment created successfully!');
            navigate('/dashboard/my-investments');
        } catch (error: any) {
            console.error('Error creating investment:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create investment';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loadingPlan) {
        return (
            <div className="investor-dashboard-refined" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" tip="Loading plan details..." />
            </div>
        );
    }

    return (
        <div className="investor-dashboard-refined">
            <Typography.Title level={2} className="page-main-title">Complete Your Investment</Typography.Title>

            {/* Selected Plan Alert Banner */}
            <div className="selected-plan-banner">
                <InfoCircleFilled className="banner-icon" />
                <div className="banner-content">
                    <Text strong className="banner-title">Selected Plan: <span className="selected-plan-name">{displayPlan.name}</span></Text>
                    {/* <Text className="banner-desc">Enter your investment amount to see calculated returns</Text> */}
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
                            Minimum: {fintechService.formatCurrency(displayPlan.minAmount)} | Maximum: ₹1,000,000
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
                                <Text strong className="s-value">{displayPlan.name}</Text>
                            </div>
                            <div className="summary-item">
                                <Text className="s-label">Investment Amount</Text>
                                <Text strong className="s-value">{amount ? fintechService.formatCurrency(Number(amount)) : '₹0'}</Text>
                            </div>
                            <div className="summary-item">
                                <Text className="s-label">Interest Rate</Text>
                                <Text strong className="s-value">{displayPlan.roi}%</Text>
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
                planName={displayPlan.name}
                loading={loading}
            />
        </div>
    );
};

export default CompleteInvestment;
