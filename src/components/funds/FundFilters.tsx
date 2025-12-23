import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center' }}>
            <TextField
                placeholder="Search funds..."
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{ flexGrow: 1, minWidth: '200px', bgcolor: '#fff' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <FormControl size="small" sx={{ minWidth: 150, bgcolor: '#fff' }}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    label="Category"
                    onChange={(e) => onCategoryChange(e.target.value)}
                >
                    <MenuItem value="All">All Categories</MenuItem>
                    <MenuItem value="Equity">Equity</MenuItem>
                    <MenuItem value="Debt">Debt</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="Index">Index</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150, bgcolor: '#fff' }}>
                <InputLabel>Risk</InputLabel>
                <Select
                    value={risk}
                    label="Risk"
                    onChange={(e) => onRiskChange(e.target.value)}
                >
                    <MenuItem value="All">All Risk Levels</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default FundFilters;






