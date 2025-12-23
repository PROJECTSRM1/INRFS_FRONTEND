import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const AppHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Box className="top-header">
            <IconButton
                onClick={onMenuClick}
                sx={{ mr: 2, display: { md: 'none' } }}
            >
                <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton color="inherit">
                    <NotificationsNoneIcon />
                </IconButton>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                    <Box sx={{ fontWeight: 600, fontSize: '14px' }}>{user?.name || 'Guest User'}</Box>
                    <Box sx={{ color: 'text.secondary', fontSize: '12px' }}>Investor</Box>
                </Box>
                <Avatar
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '14px' }}
                >
                    {(user?.name || 'G')[0]}
                </Avatar>
            </Box>
        </Box>
    );
};

export default AppHeader;






