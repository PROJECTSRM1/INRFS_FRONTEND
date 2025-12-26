export const fintechService = {
    /**
     * Calculate deterministic returns based on amount and plan ROI.
     */
    calculateReturns: (amount: number, roi: number, durationMonths: number) => {
        const interest = (amount * roi * durationMonths) / 1200;
        const maturityAmount = amount + interest;
        return {
            interest: Math.round(interest),
            maturityAmount: Math.round(maturityAmount),
        };
    },

    /**
     * Generates a static Customer ID in format I1234.
     */
    generateCustomerId: () => {
        return `I${Math.floor(1000 + Math.random() * 9000)}`;
    },

    /**
     * Generates a static Investment ID in format INV-2024-001.
     */
    generateInvestmentId: (index: number) => {
        const serial = String(index + 1).padStart(3, '0');
        return `INV-2024-${serial}`;
    },

    /**
     * Formats currency in USD.
     */
    formatCurrency: (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    },
};
