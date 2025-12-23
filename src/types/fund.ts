export interface Fund {
  id: string;
  name: string;
  category: 'Equity' | 'Debt' | 'Hybrid' | 'Index';
  risk: 'Low' | 'Moderate' | 'High';
  returns: number; // annualized %
  minInvestment: number;
  nav: number;
  description: string;
}

export interface FundFilters {
  category: string[];
  risk: string[];
  search: string;
}






