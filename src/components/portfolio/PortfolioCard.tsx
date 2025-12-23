import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface SummaryCardProps {
    label: string;
    value: string;
    trend?: number;
    trendLabel?: string;
    icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, trend, trendLabel, icon }) => {
    const isPositive = trend && trend >= 0;

    return (
        <Card className="stat-card">
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                            {label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {value}
                        </Typography>
                    </Box>
                    {icon && (
                        <Box sx={{ color: 'primary.main', bgcolor: 'primary.light', p: 1, borderRadius: '8px', display: 'flex' }}>
                            {icon}
                        </Box>
                    )}
                </Box>
                {trend !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {isPositive ? (
                            <TrendingUpIcon sx={{ color: 'success.main', fontSize: '18px', mr: 0.5 }} />
                        ) : (
                            <TrendingDownIcon sx={{ color: 'error.main', fontSize: '18px', mr: 0.5 }} />
                        )}
                        <Typography
                            variant="body2"
                            sx={{ color: isPositive ? 'success.main' : 'error.main', fontWeight: 700, mr: 0.5 }}
                        >
                            {isPositive ? '+' : ''}{trend}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {trendLabel}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default SummaryCard;






