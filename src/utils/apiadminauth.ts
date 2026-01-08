import { apiClient } from "../utils/apiClient";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

const API_ENDPOINT = "/users/login";

export const loginAdmin = async (data: AdminLoginPayload): Promise<AdminLoginResponse> => {
  const res = await apiClient.post<AdminLoginResponse>(API_ENDPOINT, data);

  // Save exactly like this:
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  return res.data;
};

