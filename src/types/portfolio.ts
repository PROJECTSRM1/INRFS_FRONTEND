export interface PortfolioHolding {
    fundId: string;
    fundName: string;
    category: string;
    units: number;
    avgPrice: number;
    currentPrice: number;
    investedValue: number;
    currentValue: number;
    returns: number;
    returnsPercentage: number;
}

export interface Allocation {
    category: string;
    percentage: number;
    value: number;
    color: string;
    [key: string]: string | number; // Index signature for Recharts
}

export interface PortfolioSummary {
    totalInvested: number;
    currentValue: number;
    totalReturns: number;
    totalReturnsPercentage: number;
    allocation: Allocation[];
}






