import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface FundFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    category: string;
    onCategoryChange: (val: string) => void;
    risk: string;
    onRiskChange: (val: string) => void;
}

const FundFilters: React.FC<FundFiltersProps> = ({
    search, onSearchChange, category, onCategoryChange, risk, onRiskChange
}) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', alignItems: 'center' }}>
            <Input
                placeholder="Search funds..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                style={{ flexGrow: 1, minWidth: '200px', height: '40px' }}
            />

            <Select
                value={category}
                onChange={onCategoryChange}
                style={{ minWidth: 150, height: '40px' }}
                placeholder="Category"
            >
                <Select.Option value="All">All Categories</Select.Option>
                <Select.Option value="Equity">Equity</Select.Option>
                <Select.Option value="Debt">Debt</Select.Option>
                <Select.Option value="Hybrid">Hybrid</Select.Option>
                <Select.Option value="Index">Index</Select.Option>
            </Select>

            <Select
                value={risk}
                onChange={onRiskChange}
                style={{ minWidth: 150, height: '40px' }}
                placeholder="Risk"
            >
                <Select.Option value="All">All Risk Levels</Select.Option>
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Moderate">Moderate</Select.Option>
                <Select.Option value="High">High</Select.Option>
            </Select>
        </div>
    );
};

export default FundFilters;
