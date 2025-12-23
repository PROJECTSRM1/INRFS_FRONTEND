import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice.ts';

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const menuItems = [
        { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Portfolio', icon: <AccountBalanceWalletIcon />, path: '/dashboard/portfolio' },
        { text: 'Explore Funds', icon: <ShowChartIcon />, path: '/dashboard/funds' },
        { text: 'Transactions', icon: <ReceiptLongIcon />, path: '/dashboard/transactions' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth/login');
    };

    return (
        <Box className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                    InvestHub
                </Typography>
            </Box>

            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/')}
                            onClick={() => {
                                navigate(item.path);
                                if (window.innerWidth < 900) onClose();
                            }}
                            sx={{
                                m: '4px 12px',
                                borderRadius: '8px',
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ position: 'absolute', bottom: 20, width: '100%', px: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{ borderRadius: '8px', color: 'error.main' }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );
};

export default Sidebar;





