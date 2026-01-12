import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Reports: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Empty
                    image={<FileTextOutlined style={{ fontSize: '64px', color: '#926132' }} />}
                    description={
                        <div>
                            <Title level={4}>Reports Module</Title>
                            <p style={{ color: '#6b7280' }}>
                                The reports functionality is currently under development.
                            </p>
                        </div>
                    }
                />
            </Card>
        </div>
    );
};

export default Reports;

