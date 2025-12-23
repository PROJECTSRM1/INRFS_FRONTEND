import React from 'react';
import { Typography } from 'antd';
import '../styles/theme.css';

const { Title } = Typography;

interface LogoProps {
    size?: number;
    showText?: boolean;
    light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 32, showText = true, light = false }) => {
    return (
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animated-logo-burst"
            >
                <g opacity="0.8">
                    {/* Pink Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#f43f5e" transform="rotate(0 50 50)" />
                    {/* Purple Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#a855f7" transform="rotate(45 50 50)" />
                    {/* Blue Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#3b82f6" transform="rotate(90 50 50)" />
                    {/* Cyan Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#06b6d4" transform="rotate(135 50 50)" />
                    {/* Green Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#10b981" transform="rotate(180 50 50)" />
                    {/* Lime Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#84cc16" transform="rotate(225 50 50)" />
                    {/* Orange Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#f97316" transform="rotate(270 50 50)" />
                    {/* Gold Petal */}
                    <rect x="42" y="10" width="16" height="30" rx="8" fill="#eab308" transform="rotate(315 50 50)" />
                </g>
                <circle cx="50" cy="50" r="8" fill="white" />
            </svg>
            {showText && (
                <Title level={4} style={{ margin: 0, color: light ? 'white' : 'var(--text-main)', fontWeight: 800, letterSpacing: '1px', fontFamily: 'Inter, sans-serif' }}>
                    INRFS
                </Title>
            )}
        </div>
    );
};

export default Logo;
