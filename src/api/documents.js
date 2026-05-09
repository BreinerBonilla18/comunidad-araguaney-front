import api from "./api";

export const getDocuments = async () => {
  try {
    const response = await api.get("/documents");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createDocument = async (formData) => {
  try {
    const response = await api.post("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDocument = async (formData, id) => {
  try {
    const response = await api.put(`/documents/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
