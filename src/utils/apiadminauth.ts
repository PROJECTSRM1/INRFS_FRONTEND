import { apiClient } from "../utils/apiClient";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
}

const API_ENDPOINT = "/users/login";

export const loginAdmin = async (
  data: AdminLoginPayload
): Promise<AdminLoginResponse> => {
  const res = await apiClient.post<AdminLoginResponse>(API_ENDPOINT, data);
  return res.data;
};
