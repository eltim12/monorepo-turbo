import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchUserData = async (token: string) => {
  return axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserData = async (token: string, data: any) => {
  return axios.put(`${API_URL}/user/update`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
