import React, { useState } from 'react';
import { Table, Card, Input, Button, Tag, Space, Typography, Tooltip, Modal, Form, Select, Row, Col, message } from 'antd';
import { SearchOutlined, DownloadOutlined, UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MOCK_SYSTEM_USERS } from '../../data/mockData';
import '../../styles/admin.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Users: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // Initialize users with mock data
    const [users, setUsers] = useState(MOCK_SYSTEM_USERS);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onFinish = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            const newUser = {
                id: (users.length + 1).toString(),
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                role: values.role === 'super_admin' ? 'Super Admin' : 'Admin',
                status: 'Active',
                mobile: `+91 ${values.mobile}`,
                joinedDate: new Date().toISOString().split('T')[0]
            };

            setUsers([...users, newUser]);
            console.log('Success:', newUser);
            message.success('New admin created successfully');
            setLoading(false);
            setIsModalOpen(false);
            form.resetFields();
        }, 800);
    };

    const deleteUser = (id: string, name: string) => {
        Modal.confirm({
            title: 'Delete Admin',
            content: `Are you sure you want to delete ${name}?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                setUsers(users.filter((user: any) => user.id !== id));
                message.success('Admin deleted successfully');
            }
        });
    };

    const exportToCSV = () => {
        // Define headers
        const headers = ['ID,Name,Email,Role,Mobile,Status,Joined Date'];

        // Format rows
        const rows = users.map(user => {
            // Escape quotes in name if present
            const safeName = user.name.includes(',') ? `"${user.name}"` : user.name;
            return `${user.id},${safeName},${user.email},${user.role},${user.mobile},${user.status},${user.joinedDate}`;
        });

        // Combine and create blob
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create download link
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `inrfs_users_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            message.success('User list exported successfully');
        }
    };

    const columns: any = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md'],
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <Tag color={role === 'Super Admin' ? 'purple' : 'blue'}>{role}</Tag>,
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
            responsive: ['lg'],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'Active') color = 'success';
                if (status === 'Inactive') color = 'error';
                return <Tag color={color} className="users-status-tag">{status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: any) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button type="text" icon={<EditOutlined style={{ color: '#3b82f6' }} />} size="small" />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
                            size="small"
                            onClick={() => deleteUser(record.id, record.name)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const dataSource = users.filter((item: any) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="admin-dashboard-wrapper">
            <div className="page-header-compact">
                <div className="breadcrumb-mini">Pages / Users</div>
                <div className="header-flex-row users-header-row">
                    <div className="users-page-title-container">
                        <Title level={2}>User Management</Title>
                        <Text type="secondary">Manage system users and their permissions.</Text>
                    </div>
                    <div>
                        <Button
                            type="primary"
                            icon={<UserAddOutlined />}
                            size="large"
                            onClick={() => setIsModalOpen(true)}
                            className="admin-submit-btn users-add-btn"
                        >
                            Add New Admin
                        </Button>
                    </div>
                </div>
            </div>

            <Card bordered={false} className="table-card-compact users-table-card">
                <div className="users-filter-container">
                    <Input
                        placeholder="Search users..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="compact-input users-search-input"
                    />
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        className="compact-btn"
                        block={isMobile}
                        onClick={exportToCSV}
                    >
                        Export
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 800 }}
                    pagination={{ pageSize: 8, className: "compact-pagination" }}
                />
            </Card>

            <Modal
                title="Add New Admin"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ role: 'admin' }}
                    requiredMark="optional"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input placeholder="John" className="users-form-input" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input placeholder="Doe" className="users-form-input" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="user@example.com" className="users-form-input" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="mobile"
                                label="Phone Number"
                                rules={[
                                    { required: true, message: 'Please enter phone number' },
                                    { pattern: /^[0-9]{10}$/, message: 'Must be exactly 10 digits' }
                                ]}
                            >
                                <Input
                                    addonBefore="+91"
                                    placeholder="9876543210"
                                    className="users-form-input"
                                    maxLength={10}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{ required: true, message: 'Please select a role' }]}
                            >
                                <Select className="users-form-input">
                                    <Option value="super_admin">Super Admin</Option>
                                    <Option value="admin">Admin</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter password' }]}
                    >
                        <Input.Password placeholder="••••••••" className="users-form-input" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                            icon={<UserAddOutlined />}
                            className="users-submit-btn"
                        >
                            Create Admin
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;
