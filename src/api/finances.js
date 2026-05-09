import api from "./api";

export const getFinances = async () => {
  try {
    const response = await api.get("/finances");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFinanceStats = async () => {
  try {
    const response = await api.get("/finances/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createFinance = async (financeData) => {
  try {
    const response = await api.post("/finances", financeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
