import api from "./api";

export const getAllFamilyHeads = async () => {
  try {
    const response = await api.get("/family-heads");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStadistics = async () => {
  try {
    const response = await api.get("/citizens/stadistics")
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const getFamilyMembersByHeadId = async (headId) => {
  try {
    const response = await api.get(`/members-by-head/${headId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllCitizens = async () => {
  try {
    const response = await api.get("/citizens");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCitizen = async (citizensData) => {
  try {
    const response = await api.post("/citizens", citizensData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCitizen = async (citizensData, citizenId) => {
  try {
    const response = await api.put(`/citizens/${citizenId}`, citizensData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCitizen = async (citizenId) => {
  try {
    const response = await api.delete(`/citizens/${citizenId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


