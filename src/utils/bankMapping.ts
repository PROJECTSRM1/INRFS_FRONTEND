// Bank ID to Bank Name mapping based on master_bank table
export const BANK_MAPPING: Record<number, string> = {
    1: 'State Bank of India',
    2: 'HDFC Bank',
    3: 'ICICI Bank',
    4: 'Axis Bank',
    5: 'Punjab National Bank',
    6: 'Bank of Baroda',
    7: 'Canara Bank',
    8: 'Union Bank of India',
    9: 'IDFC First Bank',
    10: 'Kotak Mahindra Bank'
};

/**
 * Get bank name from bank ID
 * @param bankId - The bank ID from the API
 * @returns Bank name or 'Unknown Bank' if not found
 */
export const getBankName = (bankId?: number): string => {
    if (!bankId) return 'N/A';
    return BANK_MAPPING[bankId] || `Bank ID: ${bankId}`;
};

/**
 * Get all available banks
 * @returns Array of bank objects with id and name
 */
export const getAllBanks = () => {
    return Object.entries(BANK_MAPPING).map(([id, name]) => ({
        id: parseInt(id),
        name
    }));
};
