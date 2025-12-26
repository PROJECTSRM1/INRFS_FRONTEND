import React from 'react';
import { Typography, Row, Col } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    BankOutlined,
    WalletOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const { user } = useAppContext();

    // Static Dummy Data
    const userProfile = {
        fullName: user?.name || 'Johnathan Doe',
        email: user?.email || 'john.doe@example.com',
        customerId: user?.customerId || 'I9382',
        phone: '+91 98765 43210',
        bankDetails: {
            bankName: 'HDFC Bank',
            accountNumber: '**** **** **** 1234',
            ifsc: 'HDFC0001234'
        }
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
                        <div className="profile-field-row">
                            <div className="profile-icon-brown"><PhoneOutlined /></div>
                            <div className="profile-field-content">
                                <Text className="profile-label">Phone Number</Text>
                                <Text className="profile-value">{userProfile.phone}</Text>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Bank Details Card */}
                <Col xs={24} md={12} lg={16}>
                    <div className="profile-card">
                        <Title level={4} className="profile-section-title">Bank Information</Title>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={12}>
                                <div className="profile-field-row">
                                    <div className="profile-icon-brown"><BankOutlined /></div>
                                    <div className="profile-field-content">
                                        <Text className="profile-label">Bank Name</Text>
                                        <Text className="profile-value">{userProfile.bankDetails.bankName}</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="profile-field-row">
                                    <div className="profile-icon-brown"><GlobalOutlined /></div>
                                    <div className="profile-field-content">
                                        <Text className="profile-label">IFSC Code</Text>
                                        <Text className="profile-value">{userProfile.bankDetails.ifsc}</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="profile-field-row">
                                    <div className="profile-icon-brown"><WalletOutlined /></div>
                                    <div className="profile-field-content">
                                        <Text className="profile-label">Account Number</Text>
                                        <Text className="profile-value" style={{ letterSpacing: '1px' }}>{userProfile.bankDetails.accountNumber}</Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                To update your bank details or personal information, please contact our support team at <a href="mailto:support@inrfs.com" style={{ color: '#2563eb' }}>support@inrfs.com</a>.
                            </Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
