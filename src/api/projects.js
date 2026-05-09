import api from "./api";

export const getProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post("/projects", projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProject = async (projectData, projectId) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
