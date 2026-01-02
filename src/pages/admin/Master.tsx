import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Tabs,
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Switch,
    Space,
    message,
    Popconfirm,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DatabaseOutlined
} from '@ant-design/icons';
import { planService, type InvestmentPlan, type CreatePlanPayload } from '../../services/planService';
import '../../styles/admin.css';
import '../../styles/master.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Master: React.FC = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [plans, setPlans] = useState<InvestmentPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (activeTab === '1') {
            fetchPlans();
        }
    }, [activeTab]);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await planService.getAllPlans();
            setPlans(data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch investment plans';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = () => {
        setEditingPlan(null);
        form.resetFields();
        form.setFieldsValue({ is_active: true });
        setModalVisible(true);
    };

    const handleEditPlan = (plan: InvestmentPlan) => {
        setEditingPlan(plan);
        form.setFieldsValue(plan);
        setModalVisible(true);
    };

    const handleDeletePlan = async (id: number) => {
        try {
            await planService.deletePlan(id);
            message.success('Plan deleted successfully');
            fetchPlans();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete plan';
            message.error(errorMessage);
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await planService.togglePlanStatus(id, !currentStatus);
            message.success(`Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            fetchPlans();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update plan status';
            message.error(errorMessage);
        }
    };

    const handleSubmit = async (values: CreatePlanPayload) => {
        try {
            if (editingPlan) {
                await planService.updatePlan(editingPlan.id!, values);
                message.success('Plan updated successfully');
            } else {
                await planService.createPlan(values);
                message.success('Plan created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchPlans();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save plan';
            message.error(errorMessage);
        }
    };

    const columns = [
        {
            title: 'Plan Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Returns (%)',
            dataIndex: 'returns_percentage',
            key: 'returns_percentage',
            render: (value: number) => (
                <div className="compact-tag-returns">
                    <DollarOutlined /> {value}%
                </div>
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'duration_months',
            key: 'duration_months',
            render: (value: number) => (
                <div className="compact-tag-duration">
                    <ClockCircleOutlined /> {value} Months
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive: boolean, record: InvestmentPlan) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleStatus(record.id!, isActive)}
                    checkedChildren={<CheckCircleOutlined />}
                    unCheckedChildren={<CloseCircleOutlined />}
                    size="small"
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: InvestmentPlan) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined className="action-icon-edit" />}
                        onClick={() => handleEditPlan(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Delete Plan"
                        description="Are you sure you want to delete this plan?"
                        onConfirm={() => handleDeletePlan(record.id!)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const tabItems = [
        {
            key: '1',
            label: (
                <span>
                    <DatabaseOutlined />
                    Investment Plans
                </span>
            ),
            children: (
                <div className="master-tab-content-plain">
                    <div className="master-action-section">
                        <Text type="secondary" className="master-subtitle">Configure investment plans available for users.</Text>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreatePlan}
                            className="master-add-btn"
                            size="middle"
                        >
                            Add New Plan
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={plans}
                        rowKey="id"
                        loading={loading}
                        size="small"
                        pagination={{ pageSize: 5 }}
                        className="master-table"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="admin-dashboard-wrapper master-page-wrapper">
            <div className="page-header-compact">
                <div className="header-flex-row">
                    <div className="page-title-container">
                        <Title level={2}>Master Screen</Title>
                        <Text type="secondary">Manage system-wide master configurations and settings.</Text>
                    </div>
                </div>
            </div>

            <Card bordered={false} className="table-card-compact master-card">
                <div className="master-container">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        className="master-tabs"
                    />
                </div>
            </Card>

            <Modal
                title={editingPlan ? 'Edit Investment Plan' : 'Create New Investment Plan'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={500}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ is_active: true }}
                >
                    <Form.Item
                        name="name"
                        label="Plan Name"
                        rules={[{ required: true, message: 'Please enter plan name' }]}
                    >
                        <Input placeholder="e.g., Growth Accelerate" className="master-form-input" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="returns_percentage"
                                label="Returns (%)"
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <InputNumber style={{ width: '100%' }} precision={2} className="master-form-input" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="duration_months"
                                label="Duration (Months)"
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={1} className="master-form-input" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <TextArea rows={3} maxLength={300} showCount className="master-form-input" />
                    </Form.Item>

                    <Form.Item name="is_active" label="Active" valuePropName="checked">
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                        <Button type="primary" htmlType="submit" block className="admin-submit-btn">
                            {editingPlan ? 'Update Plan' : 'Create Plan'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Master;
