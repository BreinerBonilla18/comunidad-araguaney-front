import api from "./api";

export const getSpokepersons = async () => {
  try {
    const response = await api.get("/spokespersons");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const assignSpokeperson = async (citizenId, position) => {
  try {
    const response = await api.patch(`/spokespersons/assign/${citizenId}`, { position });
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
