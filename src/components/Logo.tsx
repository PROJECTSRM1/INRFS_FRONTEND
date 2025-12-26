import React from 'react';

interface LogoProps {
    size?: number;
    showText?: boolean;
    light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 32 }) => {
    return (
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
                src="/infrs-logo.png"
                alt="INRFS Logo"
                style={{
                    height: size,
                    width: 'auto',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
};

export default Logo;
