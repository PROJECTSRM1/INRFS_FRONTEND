import React from 'react';
import { Card, Typography } from 'antd';
import '../styles/theme.css';
import '../styles/dashboard-critical-fix-v2.css';

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
                <div className="stat-icon-box">
                    {icon}
                </div>
                <div className="stat-details">
                    <Text className="stat-label">{title}</Text>
                    <Title level={3} className="stat-value">{value}</Title>
                </div>
                {trend && (
                    <div className="stat-trend-v2">
                        {trend}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatMiniCard;

