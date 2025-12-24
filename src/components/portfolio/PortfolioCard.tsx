import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface SummaryCardProps {
    label: string;
    value: string;
    trend?: number;
    trendLabel?: string;
    icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, trend, trendLabel, icon }) => {
    const isPositive = trend !== undefined && trend >= 0;

    return (
        <div className="summary-card">
            <div className="summary-card-inner">
                <div className="summary-card-header">
                    <div>
                        <div className="summary-card-label">
                            {label}
                        </div>
                        <div className="summary-card-value">
                            {value}
                        </div>
                    </div>
                    {icon && (
                        <div className="summary-card-icon-wrapper">
                            {icon}
                        </div>
                    )}
                </div>
                {trend !== undefined && (
                    <div className="summary-card-trend">
                        {isPositive ? (
                            <ArrowUpOutlined className="trend-positive" style={{ fontSize: '14px', marginRight: '4px' }} />
                        ) : (
                            <ArrowDownOutlined className="trend-negative" style={{ fontSize: '14px', marginRight: '4px' }} />
                        )}
                        <span className={`trend-value ${isPositive ? 'trend-positive' : 'trend-negative'}`}>
                            {isPositive ? '+' : ''}{trend}%
                        </span>
                        <span className="trend-label">
                            {trendLabel}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryCard;
