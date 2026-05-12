import api from "./api";

export const getSpokepersons = async () => {
  try {
    const response = await api.get("/spokespersons");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const assignSpokeperson = async (citizenId) => {
  try {
    const response = await api.patch(`/spokespersons/assign/${citizenId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeSpokeperson = async (spokepersonId) => {
  try {
    const response = await api.patch(`/spokespersons/remove/${spokepersonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
