import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Typography, Descriptions, Button, message } from 'antd';
import { BankOutlined, ReloadOutlined } from '@ant-design/icons';
import { bankService } from '../../services/bankService';
import type { BankDetails } from '../../services/bankService';
import { getBankName } from '../../utils/bankMapping';

const { Title } = Typography;

const BankDetailsCard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchBankDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await bankService.getBankDetails();
            // Handle different response structures
            let details = null;

            if (response.data) {
                details = response.data;
            } else if (response.bank_details) {
                details = response.bank_details;
            } else if (response.bank_id || response.bank_account_no) {
                details = response;
            }

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

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BankOutlined />
                    <Title level={4} style={{ margin: 0 }}>Bank Details</Title>
                </div>
            }
            extra={
                <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchBankDetails}
                    loading={loading}
                >
                    Refresh
                </Button>
            }
        >
            {loading && !bankDetails ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                </div>
            ) : error && !bankDetails ? (
                <Alert
                    message="Error"
                    description={error}
                    type="warning"
                    showIcon
                />
            ) : bankDetails ? (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Bank Name">
                        {getBankName(bankDetails.bank_id)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Number">
                        {bankDetails.bank_account_no || bankDetails.account_number || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="IFSC Code">
                        {bankDetails.ifsc_code || 'N/A'}
                    </Descriptions.Item>
                    {bankDetails.account_holder_name && (
                        <Descriptions.Item label="Account Holder Name">
                            {bankDetails.account_holder_name}
                        </Descriptions.Item>
                    )}
                    {bankDetails.branch_name && (
                        <Descriptions.Item label="Branch Name">
                            {bankDetails.branch_name}
                        </Descriptions.Item>
                    )}
                    {bankDetails.account_type && (
                        <Descriptions.Item label="Account Type">
                            {bankDetails.account_type}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Verification Status">
                        {bankDetails.is_verified ? (
                            <span style={{ color: '#52c41a' }}>✓ Verified</span>
                        ) : (
                            <span style={{ color: '#faad14' }}>⚠ Not Verified</span>
                        )}
                    </Descriptions.Item>
                </Descriptions>
            ) : (
                <Alert
                    message="No Bank Details"
                    description="Please add your bank details to continue."
                    type="info"
                    showIcon
                />
            )}
        </Card>
    );
};

export default BankDetailsCard;
