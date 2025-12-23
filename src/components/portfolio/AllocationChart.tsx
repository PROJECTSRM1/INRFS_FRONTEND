import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Allocation } from '../../types/portfolio';

interface AllocationChartProps {
    data: Allocation[];
    title?: string;
}

const AllocationChart: React.FC<AllocationChartProps> = ({ data, title = 'Portfolio Allocation' }) => {
    return (
        <Box className="chart-container" sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="category"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default AllocationChart;






