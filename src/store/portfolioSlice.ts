import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PortfolioHolding, PortfolioSummary } from '../types/portfolio';
import type { Fund } from '../types/fund';

interface PortfolioState {
    holdings: PortfolioHolding[];
    summary: PortfolioSummary | null;
    funds: Fund[];
    loading: boolean;
    error: string | null;
}

const initialState: PortfolioState = {
    holdings: [],
    summary: null,
    funds: [],
    loading: false,
    error: null,
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        setHoldings: (state, action: PayloadAction<PortfolioHolding[]>) => {
            state.holdings = action.payload;
        },
        setSummary: (state, action: PayloadAction<PortfolioSummary>) => {
            state.summary = action.payload;
        },
        setFunds: (state, action: PayloadAction<Fund[]>) => {
            state.funds = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setHoldings, setSummary, setFunds, setLoading, setError } = portfolioSlice.actions;
export default portfolioSlice.reducer;






