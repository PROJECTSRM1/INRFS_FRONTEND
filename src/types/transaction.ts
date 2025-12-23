export type TransactionType = 'Buy' | 'Sell' | 'SIP';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
    id: string;
    date: string;
    fundName: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
}






