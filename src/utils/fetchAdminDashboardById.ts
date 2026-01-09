import axios from "axios";

const API_URL = "https://inrfs-be.onrender.com/admin/dashboard";
const REFRESH_URL = "https://inrfs-be.onrender.com/api/v1/auth/refresh-token";

export const getStoredTokens = () => ({
  access_token: localStorage.getItem("access_token"),
  refresh_token: localStorage.getItem("refresh_token"),
});

export const storeTokens = (access: string, refresh: string) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const { refresh_token } = getStoredTokens();
  if (!refresh_token) return null;

  try {
    const res = await axios.post(REFRESH_URL, { refresh_token });
    const newAccess = res.data.access_token;
    const newRefresh = res.data.refresh_token;
    storeTokens(newAccess, newRefresh);
    return newAccess;
  } catch {
    return null;
  }
};

export const fetchAdminDashboardById = async (planTypeId: number | null) => {
  let token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    // ✔ ONLY CHANGE: post → get, body removed
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        plan_type_id: planTypeId, // query param stays exactly same
      },
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // ✔ retry also uses GET now
        const retry = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${newToken}` },
          params: { plan_type_id: planTypeId },
        });
        return retry.data;
      }
    }
    console.error("Dashboard API Error:", err.response || err);
    return null;
  }
};
