import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Button } from 'antd';
import { MenuOutlined, BellOutlined } from '@ant-design/icons';
import type { RootState } from '../../store';

const AppHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="top-header" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            height: '64px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={onMenuClick}
                className="mobile-menu-btn"
                style={{
                    marginRight: '16px',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            />

            <div style={{ flexGrow: 1 }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button
                    type="text"
                    icon={<BellOutlined style={{ fontSize: '20px' }} />}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />

                <div className="user-info-text" style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                        {user?.name || 'Guest User'}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>
                        Investor
                    </div>
                </div>

                <Avatar
                    style={{ backgroundColor: '#1677ff', verticalAlign: 'middle' }}
                    size="large"
                >
                    {(user?.name || 'G')[0]}
                </Avatar>
            </div>
            <style>{`
                .mobile-menu-btn {
                    display: none !important;
                }
                @media (max-width: 899px) {
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                }
                @media (max-width: 639px) {
                    .user-info-text {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AppHeader;
