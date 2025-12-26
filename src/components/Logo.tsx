import React from 'react';
import { Typography } from 'antd';
import '../styles/theme.css';

const { Title } = Typography;

interface LogoProps {
    size?: number;
    showText?: boolean;
    light?: boolean;
}

import logoImg from '../assets/logo_custom.png';

const Logo: React.FC<LogoProps> = ({ size = 32, showText = true, light = false }) => {
    return (
        <div className="logo-container">
            <img
                src={logoImg}
                alt="Logo"
                className="logo-spin"
                style={{
                    width: size,
                    height: size,
                    objectFit: 'contain'
                }}
            />
            {showText && (
                <Title
                    level={4}
                    className={`logo-text ${light ? 'logo-text-light' : 'logo-text-dark'}`}
                >
                    INRFS
                </Title>
            )}
        </div>
    );
};

export default Logo;
