import React from 'react';
import {
    DashboardOutlined,
    WalletOutlined,
    LineChartOutlined,
    FileTextOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice.ts';

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const menuItems = [
        { text: 'Overview', icon: <DashboardOutlined />, path: '/dashboard' },
        { text: 'Portfolio', icon: <WalletOutlined />, path: '/dashboard/portfolio' },
        { text: 'Explore Funds', icon: <LineChartOutlined />, path: '/dashboard/funds' },
        { text: 'Transactions', icon: <FileTextOutlined />, path: '/dashboard/transactions' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`} style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '260px',
            backgroundColor: '#fff',
            borderRight: '1px solid #f0f0f0',
            transition: 'transform 0.3s ease',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: '#1677ff', fontWeight: 800 }}>
                    InvestHub
                </div>
            </div>

            <nav style={{ marginTop: '16px', flexGrow: 1 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                        return (
                            <li key={item.text} style={{ padding: '4px 12px' }}>
                                <button
                                    onClick={() => {
                                        navigate(item.path);
                                        if (window.innerWidth < 900) onClose();
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        backgroundColor: isActive ? '#e6f4ff' : 'transparent',
                                        color: isActive ? '#1677ff' : '#4b5563',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'left'
                                    }}
                                    className="sidebar-item"
                                >
                                    <span style={{
                                        marginRight: '12px',
                                        fontSize: '18px',
                                        display: 'flex',
                                        color: isActive ? '#1677ff' : '#9ca3af'
                                    }}>
                                        {item.icon}
                                    </span>
                                    <span style={{ fontWeight: isActive ? 600 : 500, fontSize: '14px' }}>
                                        {item.text}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div style={{ padding: '20px 12px', borderTop: '1px solid #f0f0f0' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#ff4d4f',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                    }}
                    className="sidebar-logout"
                >
                    <span style={{ marginRight: '12px', fontSize: '18px', display: 'flex' }}>
                        <LogoutOutlined />
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>Logout</span>
                </button>
            </div>

            <style>{`
                .sidebar-item:hover {
                    background-color: #f3f4f6;
                }
                .sidebar-logout:hover {
                    background-color: #fff1f0;
                }
                @media (max-width: 899px) {
                    .sidebar.closed {
                        transform: translateX(-100%) !important;
                    }
                    .sidebar.open {
                        transform: translateX(0) !important;
                    }
                }
                @media (min-width: 900px) {
                    .sidebar {
                        transform: translateX(0) !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Sidebar;
