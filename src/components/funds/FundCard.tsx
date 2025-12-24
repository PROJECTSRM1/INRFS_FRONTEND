import React from 'react';
import { Button, Tag, Divider } from 'antd';
import type { Fund } from '../../types/fund';

interface FundCardProps {
    fund: Fund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #f0f0f0',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }} className="fund-card-hover">
            <div style={{ flexGrow: 1, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Tag color="blue" style={{ fontWeight: 600, borderRadius: '4px' }}>
                        {fund.category}
                    </Tag>
                    <Tag
                        color={fund.risk === 'Low' ? 'success' : fund.risk === 'High' ? 'error' : 'warning'}
                        style={{ fontWeight: 600, borderRadius: '4px' }}
                    >
                        {fund.risk} Risk
                    </Tag>
                </div>

                <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                    minHeight: '60px',
                    color: '#111827',
                    lineHeight: 1.4
                }}>
                    {fund.name}
                </div>

                <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '24px',
                    minHeight: '40px',
                    lineHeight: 1.6
                }}>
                    {fund.description}
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Returns (3Y)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#52c41a' }}>
                        {fund.returns}%
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Min. Invest.</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                        ₹{fund.minInvestment.toLocaleString()}
                    </div>
                </div>
            </div>

            <div style={{ padding: '16px', paddingTop: 0 }}>
                <Button
                    type="primary"
                    block
                    style={{
                        height: '40px',
                        borderRadius: '8px',
                        fontWeight: 600
                    }}
                >
                    Invest Now
                </Button>
            </div>

            <style>{`
                .fund-card-hover:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
                    border-color: #1677ff33;
                }
            `}</style>
        </div>
    );
};

export default FundCard;
