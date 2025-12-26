import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Badge, Typography, Space, Drawer, Switch } from 'antd';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    TeamOutlined,
    LineChartOutlined,
    FileTextOutlined,
    DollarOutlined,
    BellOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    BulbOutlined,
    BulbFilled
} from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import Logo from '../../components/Logo';
import '../../styles/admin.css';
import '../../styles/theme.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { darkMode, toggleDarkMode } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Enforce strict responsive checks
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 768);
            if (width <= 1200 && width > 768) {
                setCollapsed(true);
            } else if (width > 1200) {
                setCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        navigate('/admin/login');
    };

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <NavLink to="/admin/dashboard" onClick={() => setDrawerVisible(false)}>Overview</NavLink>,
        },
        {
            key: '/admin/investors',
            icon: <TeamOutlined />,
            label: <NavLink to="/admin/investors" onClick={() => setDrawerVisible(false)}>Investors</NavLink>,
        },
        {
            key: '/admin/investments',
            icon: <LineChartOutlined />,
            label: <NavLink to="/admin/investments" onClick={() => setDrawerVisible(false)}>Investments</NavLink>,
        },
        {
            key: '/admin/bonds',
            icon: <FileTextOutlined />,
            label: <NavLink to="/admin/bonds" onClick={() => setDrawerVisible(false)}>Bonds</NavLink>,
        },
        {
            key: '/admin/payments',
            icon: <DollarOutlined />,
            label: <NavLink to="/admin/payments" onClick={() => setDrawerVisible(false)}>Payments</NavLink>,
        },
        {
            key: '/admin/reports',
            icon: <FileTextOutlined />,
            label: <NavLink to="/admin/reports" onClick={() => setDrawerVisible(false)}>Reports</NavLink>,
        },
        {
            key: '/admin/notifications',
            icon: <BellOutlined />,
            label: <NavLink to="/admin/notifications" onClick={() => setDrawerVisible(false)}>Notifications</NavLink>,
        },
    ];

    const SideMenuContent = (
        <div className="admin-side-menu-container">
            <div className="admin-sider-logo" style={{ height: 'auto', padding: '24px', flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <Logo size={32} showText={false} />
                    {(!collapsed || isMobile) && <span className="logo-text" style={{ fontSize: '18px', fontWeight: 800 }}>Admin Panel</span>}
                </div>

            </div>
            <div className="admin-menu-scrollable">
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    className="admin-sidebar-menu-antd"
                />
            </div>
            <div className="admin-sider-footer">
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    className="logout-btn-sider"
                >
                    {(!collapsed || isMobile) && "Logout"}
                </Button>
            </div>
        </div>
    );

    return (
        <Layout className="admin-layout-container">
            {/* Desktop Sider: Only visible on desktop/tablet */}
            {!isMobile && (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={260}
                    className="admin-sider"
                >
                    {SideMenuContent}
                </Sider>
            )}

            {/* Mobile Drawer: Only visible on mobile (<=768px) */}
            <Drawer
                placement="left"
                closable={false}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                maskClosable={true}
                className="admin-mobile-drawer"
                width="85%"
                style={{ maxWidth: '320px' }}
                bodyStyle={{ padding: 0 }}
                drawerStyle={{ background: 'var(--admin-sidebar-gradient)' }}
            >
                {SideMenuContent}
            </Drawer>

            <Layout className="admin-main-layout">
                <Header className="admin-header-antd">
                    <div className="header-left">
                        <Button
                            type="text"
                            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
                            onClick={() => isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)}
                            className="collapse-btn"
                        />
                        <Text strong className="page-title">
                            {menuItems.find(item => item.key === location.pathname)?.label?.props?.children || 'Admin Portal'}
                        </Text>
                    </div>
                    <div className="header-right">
                        <Space size="middle">
                            <Switch
                                checkedChildren={<BulbFilled />}
                                unCheckedChildren={<BulbOutlined />}
                                checked={darkMode}
                                onChange={toggleDarkMode}
                            />
                            <Badge count={5} size="small" offset={[2, 2]}>
                                <Button type="text" icon={<BellOutlined />} className="icon-btn" />
                            </Badge>
                            <div className="user-profile-compact">
                                <Avatar
                                    icon={<UserOutlined />}
                                    size="small"
                                    style={{ backgroundColor: 'var(--admin-primary)', cursor: 'pointer' }}
                                />
                                {!isMobile && (
                                    <div className="user-info-text">
                                        <Text strong className="user-name">Admin User</Text>
                                        <Text type="secondary" className="user-role">Super Admin</Text>
                                    </div>
                                )}
                            </div>
                        </Space>
                    </div>
                </Header>
                <Content className="admin-content-antd">
                    <div className="admin-scroll-container">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
