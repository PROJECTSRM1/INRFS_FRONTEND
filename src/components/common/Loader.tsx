import React from 'react';
import { Spin } from 'antd';

const Loader: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
            <Spin size="large" />
        </div>
    );
};

export default Loader;
