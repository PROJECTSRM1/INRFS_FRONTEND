import React from 'react';
import { Card, Typography } from 'antd';
import '../styles/dashboard.css';

const { Text, Title } = Typography;

interface StatMiniCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
    trend?: string;
}

const StatMiniCard: React.FC<StatMiniCardProps> = ({ title, value, icon, colorClass, trend }) => {
    return (
        <Card className={`stat-card-refined ${colorClass}`} bordered={false}>
            <div className="stat-card-content">
                <div className="stat-header-row">
                    <div className="stat-icon-box">
                        {icon}
                    </div>
                    {trend && (
                        <span className="stat-trend-v2">
                            {trend}
                        </span>
                    )}
                </div>
                <div className="stat-body">
                    <Text className="stat-label">{title}</Text>
                    <Title level={3} className="stat-value">{value}</Title>
                </div>
            </div>
        </Card>
    );
};

export default StatMiniCard;

