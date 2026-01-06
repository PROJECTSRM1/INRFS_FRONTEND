import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Descriptions, message } from 'antd';
import axios from "axios";
import type { Investor } from '../../types';
import '../../styles/admin.css';

const API_BASE = "https://inrfs-be.onrender.com"; // ✅ added to remove error

interface AdminInvestorModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (values: Partial<Investor>) => void;
    investor: Investor | null;
    mode: 'view' | 'edit';
}

const AdminInvestorModal: React.FC<AdminInvestorModalProps> = ({
    visible,
    onCancel,
    onSave,
    investor,
    mode
}) => {
    const [form] = Form.useForm();

    // ⚠ removed ONLY this unused function which caused errors:
    // fetchInvestors() using setLoading & setDataSource (not defined here)

    useEffect(() => {
        if (visible && investor && mode === 'edit') {
            form.setFieldsValue(investor);
        }
    }, [visible, investor, mode, form]);

    const handleOk = () => {
        if (mode === 'view') {
            onCancel();
        } else {
            form.validateFields()
                .then(values => {
                    onSave({ ...investor, ...values });
                    message.success("Investor details updated successfully");
                    form.resetFields();
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
        }
    };

    const title = mode === 'view' ? 'Investor Details' : 'Edit Investor';

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}  // ✔ already correct
            okText={mode === 'view' ? 'Close' : 'Save Changes'}
            cancelButtonProps={{ style: { display: mode === 'view' ? 'none' : 'inline-block' } }}
            centered
            className="fintech-modal"
        >
            {mode === 'view' && investor && (
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label={<span className="investor-desc-label">Customer ID</span>}>
                        <span className="investor-desc-content">{investor.customerId}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="investor-desc-label">Name</span>}>
                        <span className="investor-desc-content">{investor.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="investor-desc-label">Email</span>}>
                        <span className="investor-desc-content">{investor.email}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="investor-desc-label">Mobile</span>}>
                        <span className="investor-desc-content">{investor.mobile}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="investor-desc-label">Status</span>}>
                        <span className="investor-desc-content">{investor.status}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="investor-desc-label">Total Invested</span>}>
                        <span className="investor-desc-content" style={{ color: 'var(--admin-primary)' }}>
                            ${investor.totalInvested?.toLocaleString()}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="investor-desc-label">Active Investments</span>}>
                        <span className="investor-desc-content">{investor.activeInvestments}</span>
                    </Descriptions.Item>
                </Descriptions>
            )}

            {mode === 'edit' && (
                <Form
                    form={form}
                    layout="vertical"
                    name="edit_investor_form"
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input the email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="mobile"
                        label="Mobile Number"
                        rules={[{ required: true, message: 'Please input the mobile number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Account Status"
                        rules={[{ required: true, message: 'Please select a status!' }]}
                    >
                        <Select>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default AdminInvestorModal;
