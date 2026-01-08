import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Input, Checkbox, Button, message, Row, Col, Spin, Modal } from 'antd';
import { InfoCircleFilled, DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import { INVESTMENT_PLANS } from '../../data/mockData';
import { fintechService } from '../../services/fintechService';
import { plansService, type Plan } from '../../services/plansService';
import { investmentService } from '../../services/investmentService';
import PaymentModal from '../../components/PaymentModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../../styles/dashboard.css';

const { Title, Text } = Typography;

const CompleteInvestment: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { addInvestment, investments } = useAppContext();
    const certRef = useRef<HTMLDivElement>(null);

    // State for API plan data
    const [apiPlan, setApiPlan] = useState<Plan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);

    // Fallback to mock data
    const mockPlan = INVESTMENT_PLANS.find(p => p.id === planId) || INVESTMENT_PLANS[0];

    const [amount, setAmount] = useState<number | ''>('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [showBondCertificate, setShowBondCertificate] = useState(false);
    const [generatedBond, setGeneratedBond] = useState<any>(null);
    const [savingBond, setSavingBond] = useState(false);
    const [downloading, setDownloading] = useState(false);

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
        const value = e.target.value;

        // Allow empty input
        if (value === '') {
            setAmount('');
            return;
        }

        // Only allow digits (whole numbers only for investment amounts)
        if (/^\d+$/.test(value)) {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 0) {
                setAmount(numValue);
            }
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

            // Generate bond data
            const bondData = {
                id: response.wk_inv_id || fintechService.generateInvestmentId(investments.length),
                planId: displayPlan.id,
                planName: displayPlan.name,
                amount: Number(amount),
                returns: returns,
                maturityAmount: totalMaturity,
                tenure: displayPlan.duration,
                roi: displayPlan.roi,
                status: 'Active' as const,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                startDate: new Date().toISOString(),
                infrcNumber: `${displayPlan.infrcPrefix}-${Math.floor(100000 + Math.random() * 900000)}`,
                apiResponse: response
            };

            setGeneratedBond(bondData);
            setIsPaymentModalVisible(false);
            setShowBondCertificate(true);
            message.success('Payment successful! Your bond certificate is ready.');
        } catch (error: any) {
            console.error('Error creating investment:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create investment';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!certRef.current) return;
        setDownloading(true);
        const hideLoading = message.loading('Generating Certificate...', 0);

        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
            pdf.save(`${generatedBond.planName.replace(/\s+/g, '_')}_Certificate.pdf`);
            message.success('Certificate downloaded successfully');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            message.error('Failed to generate certificate');
        } finally {
            hideLoading();
            setDownloading(false);
        }
    };

    const handleSaveAndProceed = async () => {
        setSavingBond(true);

        try {
            // Call API to save bond certificate to database
            await investmentService.saveBondCertificate(
                generatedBond.id,
                {
                    bond_certificate: generatedBond.infrcNumber,
                    investment_data: generatedBond
                }
            );

            // Add to local context for immediate UI update
            addInvestment(generatedBond);

            message.success('Bond saved successfully!');

            // Navigate to my-investments page
            setTimeout(() => {
                navigate('/dashboard/my-investments');
            }, 500);
        } catch (error: any) {
            console.error('Error saving bond:', error);
            message.error('Failed to save bond. Please try again.');
        } finally {
            setSavingBond(false);
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
                </div>
            </div>

            <Row gutter={[24, 24]} className="investment-content-grid">
                {/* Row 1: Input and Returns (Side-by-Side on Desktop) */}
                <Col xs={24} md={12}>
                    <div className="content-card-refined h-full">
                        <Title level={4} className="card-section-title">Investment Amount</Title>
                        <Input
                            prefix="₹"
                            type="text"
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

            {/* Bond Certificate Modal */}
            <Modal
                open={showBondCertificate}
                onCancel={() => { }}
                footer={null}
                width={900}
                className="cert-modal"
                centered
                closable={false}
            >
                <div className="cert-preview-container">
                    <div className="cert-modal-header">
                        <h3 className="cert-modal-title">🎉 Investment Successful! Your Bond Certificate</h3>
                        <Button
                            type="default"
                            icon={<DownloadOutlined />}
                            loading={downloading}
                            onClick={handleDownloadPDF}
                            className="cert-download-btn"
                            style={{ marginRight: '8px' }}
                        >
                            Download PDF
                        </Button>
                    </div>

                    <div className="cert-preview-wrapper">
                        <div ref={certRef} className="certificate-layout">
                            {/* Logo Watermark */}
                            <div className="cert-logo-watermark">
                                {/* Background image set in CSS */}
                            </div>

                            <div className="cert-content-layer">
                                {/* Header */}
                                <div className="cert-header">
                                    <h1 className="cert-title">Infrastructure Bond Certificate</h1>
                                    <p className="cert-subtitle">InfraGrowth Secure Bond</p>
                                </div>

                                <p className="cert-body-text">
                                    This certificate confirms the issuance of an <strong>Infrastructure Bond</strong> under the <strong>InfraGrowth Secure Bond Program</strong> by <strong>INFRS Capital Pvt. Ltd.</strong> The bond supports national infrastructure development while offering stable and predictable fixed returns.
                                </p>

                                {generatedBond && (
                                    <table className="cert-details-table">
                                        <tbody>
                                            <tr>
                                                <td className="cert-label">Bond Name</td>
                                                <td className="cert-val">InfraGrowth Secure Bond</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Bond Category</td>
                                                <td className="cert-val">Infrastructure</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Issuer</td>
                                                <td className="cert-val">INFRS Capital Pvt. Ltd.</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Bond ID</td>
                                                <td className="cert-val">{generatedBond.id}</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">INFRC Number</td>
                                                <td className="cert-val">{generatedBond.infrcNumber}</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Tenure</td>
                                                <td className="cert-val">{generatedBond.tenure} Months</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Interest Type</td>
                                                <td className="cert-val">Fixed Return</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Expected Annual Return</td>
                                                <td className="cert-val">{generatedBond.roi}%</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Risk Level</td>
                                                <td className="cert-val">Low to Moderate</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Investment Amount</td>
                                                <td className="cert-val">{fintechService.formatCurrency(generatedBond.amount)}</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Maturity Amount</td>
                                                <td className="cert-val">{fintechService.formatCurrency(generatedBond.maturityAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Issue Date</td>
                                                <td className="cert-val">{generatedBond.date}</td>
                                            </tr>
                                            <tr>
                                                <td className="cert-label">Maturity Date</td>
                                                <td className="cert-val">
                                                    {new Date(new Date().setMonth(new Date().getMonth() + generatedBond.tenure)).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                                <p className="cert-system-note">
                                    This document is system-generated and valid without a physical signature.
                                </p>

                                <div className="cert-footer">
                                    <div className="cert-sig-block">
                                        <div className="cert-sig-name">Authorized Issuer</div>
                                        <div className="cert-sig-title">INFRS Capital Pvt. Ltd.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SaveOutlined />}
                            onClick={handleSaveAndProceed}
                            loading={savingBond}
                            style={{
                                minWidth: '200px',
                                backgroundColor: '#926132',
                                borderColor: '#926132',
                                color: '#fff'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#784f28';
                                e.currentTarget.style.borderColor = '#784f28';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#926132';
                                e.currentTarget.style.borderColor = '#926132';
                            }}
                        >
                            Save and Proceed
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CompleteInvestment;
