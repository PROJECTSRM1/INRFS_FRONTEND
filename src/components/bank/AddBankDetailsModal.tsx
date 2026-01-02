import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Typography } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { bankService } from '../../services/bankService';
import { getAllBanks } from '../../utils/bankMapping';

const { Title, Text } = Typography;

interface AddBankDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

const AddBankDetailsModal: React.FC<AddBankDetailsModalProps> = ({ open, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Prepare payload according to API requirements
            const payload = {
                bank_id: values.bank_id,
                bank_account_no: values.bank_account_no,
                ifsc_code: values.ifsc_code
            };

            await bankService.addBankDetails(payload);

            message.success('Bank details added successfully!');
            form.resetFields();
            onSuccess();
            onCancel();
        } catch (error: any) {
            console.error('Error adding bank details:', error);
            const errorMsg = error.response?.data?.detail
                || error.response?.data?.message
                || 'Failed to add bank details';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={500}
            centered
            destroyOnClose
            title={null}
        >
            <div style={{ padding: '20px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <BankOutlined style={{ fontSize: '48px', color: '#3b82f6', marginBottom: '16px' }} />
                    <Title level={3} style={{ margin: 0 }}>Add Bank Details</Title>
                    <Text type="secondary">Please provide your bank account information</Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                >
                    <Form.Item
                        label={<Text strong>Select Bank</Text>}
                        name="bank_id"
                        rules={[{ required: true, message: 'Please select your bank' }]}
                    >
                        <Select
                            size="large"
                            placeholder="Choose your bank"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={getAllBanks().map(bank => ({
                                value: bank.id,
                                label: bank.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>Account Number</Text>}
                        name="bank_account_no"
                        rules={[
                            { required: true, message: 'Please enter your account number' },
                            { pattern: /^[0-9]+$/, message: 'Account number must contain only digits' },
                            { min: 9, message: 'Account number must be at least 9 digits' },
                            { max: 18, message: 'Account number must not exceed 18 digits' }
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your account number"
                            maxLength={18}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>IFSC Code</Text>}
                        name="ifsc_code"
                        rules={[
                            { required: true, message: 'Please enter IFSC code' },
                            { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC code format' },
                            { len: 11, message: 'IFSC code must be 11 characters' }
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="e.g., SBIN0001234"
                            maxLength={11}
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => {
                                form.setFieldsValue({ ifsc_code: e.target.value.toUpperCase() });
                            }}
                        />
                    </Form.Item>

                    <div style={{ marginTop: '24px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            ℹ️ Please ensure all details are correct. Your bank details will be verified before processing any transactions.
                        </Text>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <Button
                            block
                            size="large"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                        >
                            Add Bank Details
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default AddBankDetailsModal;
