import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { Fund } from '../../types/fund';

interface FundCardProps {
    fund: Fund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                        label={fund.category}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                    />
                    <Chip
                        label={`${fund.risk} Risk`}
                        size="small"
                        color={fund.risk === 'Low' ? 'success' : fund.risk === 'High' ? 'error' : 'warning'}
                        variant="outlined"
                        sx={{ fontWeight: 600, bgcolor: 'rgba(0,0,0,0.04)' }}
                    />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, minHeight: 64 }}>
                    {fund.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                    {fund.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Returns (3Y)</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {fund.returns}%
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Min. Invest.</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ₹{fund.minInvestment.toLocaleString()}
                    </Typography>
                </Box>
            </CardContent>

            <Box sx={{ p: 2, pt: 0 }}>
                <Button fullWidth variant="contained" sx={{ borderRadius: '8px' }}>
                    Invest Now
                </Button>
            </Box>
        </Card>
    );
};

export default FundCard;






