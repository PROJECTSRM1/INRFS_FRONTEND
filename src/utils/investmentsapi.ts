import apiClient from "../utils/apiClient";

export interface InvestmentAPIData {
  id: string;
  investor_id: string;
  plan_id: string;
  planName: string;
  amount: number;
  interest: number;
  maturityDate: string;
  status: string;
  settlementStatus: string;
  investorName: string;
  
  // Include any other fields returned by backend
}

export const getAllInvestments = async (): Promise<InvestmentAPIData[]> => {
  const res = await apiClient.get("/investments/get_all_investments", {
    params: { skip: 0, limit: 100 }
  });
  return res.data;
};

export const deleteInvestment = async (ukInvId: string | number) => {
  const res = await apiClient.delete(`/investments/${ukInvId}`);
  return res.data;
};

