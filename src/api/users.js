import api from "./api";

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/login-user", { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
