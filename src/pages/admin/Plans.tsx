import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Switch,
    Space,
    message,
    Tag,
    Popconfirm,
    Typography,
    Row,
    Col,
    Statistic
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { planService, type InvestmentPlan, type CreatePlanPayload } from '../../services/planService';
import '../../styles/admin-dashboard.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Plans: React.FC = () => {
    const [plans, setPlans] = useState<InvestmentPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
    const [form] = Form.useForm();

    // Fetch plans on component mount
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await planService.getAllPlans();
            setPlans(data);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to fetch investment plans');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = () => {
        setEditingPlan(null);
        form.resetFields();
        form.setFieldsValue({ is_active: true }); // Default to active
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
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to delete plan');
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await planService.togglePlanStatus(id, !currentStatus);
            message.success(`Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            fetchPlans();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to update plan status');
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
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to save plan');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            sorter: (a: InvestmentPlan, b: InvestmentPlan) => a.id! - b.id!,
        },
        {
            title: 'Plan Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: InvestmentPlan, b: InvestmentPlan) => a.name.localeCompare(b.name),
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Returns (%)',
            dataIndex: 'returns_percentage',
            key: 'returns_percentage',
            width: 130,
            sorter: (a: InvestmentPlan, b: InvestmentPlan) => a.returns_percentage - b.returns_percentage,
            render: (value: number) => (
                <Tag color="green" icon={<DollarOutlined />}>
                    {value}%
                </Tag>
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'duration_months',
            key: 'duration_months',
            width: 130,
            sorter: (a: InvestmentPlan, b: InvestmentPlan) => a.duration_months - b.duration_months,
            render: (value: number) => (
                <Tag color="blue" icon={<ClockCircleOutlined />}>
                    {value} {value === 1 ? 'month' : 'months'}
                </Tag>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value: any, record: InvestmentPlan) => record.is_active === value,
            render: (isActive: boolean, record: InvestmentPlan) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleStatus(record.id!, isActive)}
                    checkedChildren={<CheckCircleOutlined />}
                    unCheckedChildren={<CloseCircleOutlined />}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: any, record: InvestmentPlan) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditPlan(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Plan"
                        description="Are you sure you want to delete this plan?"
                        onConfirm={() => handleDeletePlan(record.id!)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Calculate statistics
    const activePlans = plans.filter(p => p.is_active).length;
    const avgReturns = plans.length > 0
        ? (plans.reduce((sum, p) => sum + p.returns_percentage, 0) / plans.length).toFixed(2)
        : 0;

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <div>
                    <Title level={2}>Investment Plans</Title>
                    <Text type="secondary">Manage investment plans and offerings</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreatePlan}
                    size="large"
                >
                    New Investment Plan
                </Button>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Total Plans"
                            value={plans.length}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Active Plans"
                            value={activePlans}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Average Returns"
                            value={avgReturns}
                            suffix="%"
                            precision={2}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Plans Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={plans}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} plans`,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingPlan ? 'Edit Investment Plan' : 'Create New Investment Plan'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
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
                        rules={[
                            { required: true, message: 'Please enter plan name' },
                            { min: 3, message: 'Plan name must be at least 3 characters' },
                        ]}
                    >
                        <Input placeholder="e.g., Short Term Starter" size="large" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="returns_percentage"
                                label="Returns Percentage"
                                rules={[
                                    { required: true, message: 'Please enter returns percentage' },
                                    { type: 'number', min: 0, max: 100, message: 'Must be between 0 and 100' },
                                ]}
                            >
                                <InputNumber
                                    placeholder="e.g., 6.5"
                                    style={{ width: '100%' }}
                                    size="large"
                                    step={0.1}
                                    precision={2}
                                    addonAfter="%"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="duration_months"
                                label="Duration (Months)"
                                rules={[
                                    { required: true, message: 'Please enter duration' },
                                    { type: 'number', min: 1, message: 'Must be at least 1 month' },
                                ]}
                            >
                                <InputNumber
                                    placeholder="e.g., 12"
                                    style={{ width: '100%' }}
                                    size="large"
                                    min={1}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { required: true, message: 'Please enter description' },
                            { min: 10, message: 'Description must be at least 10 characters' },
                        ]}
                    >
                        <TextArea
                            placeholder="Describe the plan features and benefits..."
                            rows={4}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item
                        name="is_active"
                        label="Active Status"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setModalVisible(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingPlan ? 'Update Plan' : 'Create Plan'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Plans;
