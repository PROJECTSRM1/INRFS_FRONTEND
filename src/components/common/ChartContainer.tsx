import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Card } from 'antd';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ChartContainerProps {
    title: string;
    children: React.ReactNode;
    height?: number | string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, height = 300 }) => {
    return (
        <Card title={title} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' }}>
            <div style={{ height: height }}>
                {children}
            </div>
        </Card>
    );
};

export default ChartContainer;
