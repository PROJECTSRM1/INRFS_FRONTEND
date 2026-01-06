import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Spin, Alert, Button, message } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    BankOutlined,
    WalletOutlined,
    GlobalOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import { bankService } from '../../services/bankService';
import type { BankDetails } from '../../services/bankService';
import { getBankName } from '../../utils/bankMapping';
import AddBankDetailsModal from '../../components/bank/AddBankDetailsModal';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const { user } = useAppContext();
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchBankDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await bankService.getBankDetails();
            console.log('Bank Details API Response:', response);

            // Handle different response structures
            // The response might be: { data: {...} } or { bank_details: {...} } or directly the object
            let details = null;

            if (response.data) {
                details = response.data;
            } else if (response.bank_details) {
                details = response.bank_details;
            } else if (response.bank_id || response.bank_account_no) {
                // Response is directly the bank details object
                details = response;
            }

            console.log('Parsed Bank Details:', details);
            setBankDetails(details || null);

            if (!details) {
                setError('No bank details found. Please add your bank information.');
            }
        } catch (err: any) {
            console.error('Error fetching bank details:', err);
            const errorMsg = err.response?.data?.detail
                || err.response?.data?.message
                || 'Failed to fetch bank details';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankDetails();
    }, []);

    // User profile data from context
    const userProfile = {
        fullName: user?.name || 'User',
        email: user?.email || 'N/A',
        customerId: user?.customerId || 'N/A',
        phone: 'N/A' // This would come from user profile API
    };

    return (
        <div className="profile-page-container">
            <Title level={2} className="page-main-title">My Profile</Title>

            <Row gutter={[24, 24]}>
                {/* Personal Information Card */}
                <Col xs={24} md={12} lg={8}>
                    <div className="profile-card">
                        <div className="profile-avatar-placeholder">
                            <UserOutlined />
                        </div>
                        <Title level={4} className="profile-section-title">Personal Details</Title>

                        <div className="profile-field-row">
                            <div className="profile-icon-brown"><UserOutlined /></div>
                            <div className="profile-field-content">
                                <Text className="profile-label">Full Name</Text>
                                <Text className="profile-value">{userProfile.fullName}</Text>
                            </div>
                        </div>
                        <div className="profile-field-row">
                            <div className="profile-icon-brown"><SafetyCertificateOutlined /></div>
                            <div className="profile-field-content">
                                <Text className="profile-label">Customer Login ID</Text>
                                <Text className="profile-value" style={{ color: '#2563eb' }}>{userProfile.customerId}</Text>
                            </div>
                        </div>
                        <div className="profile-field-row">
                            <div className="profile-icon-brown"><MailOutlined /></div>
                            <div className="profile-field-content">
                                <Text className="profile-label">Email Address</Text>
                                <Text className="profile-value">{userProfile.email}</Text>
                            </div>
                        </div>
                        {/* <div className="profile-field-row">
                            <div className="profile-icon-brown"><PhoneOutlined /></div>
                            <div className="profile-field-content">
                                <Text className="profile-label">Phone Number</Text>
                                <Text className="profile-value">{userProfile.phone}</Text>
                            </div>
                        </div> */}
                    </div>
                </Col>

                {/* Bank Details Card - Now with Real API Integration */}
                <Col xs={24} md={12} lg={16}>
                    <div className="profile-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Title level={4} className="profile-section-title" style={{ margin: 0 }}>Bank Information</Title>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {!bankDetails && (
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => setIsAddModalOpen(true)}
                                        size="small"
                                    >
                                        Add Bank Details
                                    </Button>
                                )}
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={fetchBankDetails}
                                    loading={loading}
                                    size="small"
                                >
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {loading && !bankDetails ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Spin size="large" tip="Loading bank details..." />
                            </div>
                        ) : error && !bankDetails ? (
                            <Alert
                                message="Bank Details Not Available"
                                description={error}
                                type="warning"
                                showIcon
                                icon={<ExclamationCircleOutlined />}
                            />
                        ) : bankDetails ? (
                            <>
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} sm={12}>
                                        <div className="profile-field-row">
                                            <div className="profile-icon-brown"><BankOutlined /></div>
                                            <div className="profile-field-content">
                                                <Text className="profile-label">Bank Name</Text>
                                                <Text className="profile-value">{getBankName(bankDetails.bank_id)}</Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div className="profile-field-row">
                                            <div className="profile-icon-brown"><WalletOutlined /></div>
                                            <div className="profile-field-content">
                                                <Text className="profile-label">Account Number</Text>
                                                <Text className="profile-value" style={{ letterSpacing: '1px' }}>
                                                    {bankDetails.bank_account_no || bankDetails.account_number || 'N/A'}
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div className="profile-field-row">
                                            <div className="profile-icon-brown"><GlobalOutlined /></div>
                                            <div className="profile-field-content">
                                                <Text className="profile-label">IFSC Code</Text>
                                                <Text className="profile-value">{bankDetails.ifsc_code || 'N/A'}</Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div className="profile-field-row">
                                            <div className="profile-icon-brown">
                                                {bankDetails.is_verified ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                                            </div>
                                            <div className="profile-field-content">
                                                <Text className="profile-label">Verification Status</Text>
                                                <Text className="profile-value" style={{
                                                    color: bankDetails.is_verified ? '#52c41a' : '#faad14',
                                                    fontWeight: 500
                                                }}>
                                                    {bankDetails.is_verified ? '✓ Verified' : '⚠ Not Verified'}
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Optional fields - only show if available */}
                                    {bankDetails.account_holder_name && (
                                        <Col xs={24} sm={12}>
                                            <div className="profile-field-row">
                                                <div className="profile-icon-brown"><UserOutlined /></div>
                                                <div className="profile-field-content">
                                                    <Text className="profile-label">Account Holder Name</Text>
                                                    <Text className="profile-value">{bankDetails.account_holder_name}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                    {bankDetails.bank_name && (
                                        <Col xs={24} sm={12}>
                                            <div className="profile-field-row">
                                                <div className="profile-icon-brown"><BankOutlined /></div>
                                                <div className="profile-field-content">
                                                    <Text className="profile-label">Bank Name</Text>
                                                    <Text className="profile-value">{bankDetails.bank_name}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                    {bankDetails.branch_name && (
                                        <Col xs={24} sm={12}>
                                            <div className="profile-field-row">
                                                <div className="profile-icon-brown"><BankOutlined /></div>
                                                <div className="profile-field-content">
                                                    <Text className="profile-label">Branch Name</Text>
                                                    <Text className="profile-value">{bankDetails.branch_name}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                    {bankDetails.account_type && (
                                        <Col xs={24} sm={12}>
                                            <div className="profile-field-row">
                                                <div className="profile-icon-brown"><WalletOutlined /></div>
                                                <div className="profile-field-content">
                                                    <Text className="profile-label">Account Type</Text>
                                                    <Text className="profile-value">{bankDetails.account_type}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                </Row>

                                <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                        To update your bank details or personal information, please contact our support team at <a href="mailto:support@inrfs.com" style={{ color: '#2563eb' }}>support@inrfs.com</a>.
                                    </Text>
                                </div>
                            </>
                        ) : (
                            <Alert
                                message="No Bank Details"
                                description="Please add your bank details to continue with investments."
                                type="info"
                                showIcon
                            />
                        )}
                    </div>
                </Col>
            </Row>

            {/* Add Bank Details Modal */}
            <AddBankDetailsModal
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchBankDetails();
                }}
            />
        </div>
    );
};

export default Profile;
