import api from "./api";

export const startBenefitSession = async (eventType) => {
  try {
    const response = await api.patch("/citizens/start-session", {
      event_type: eventType,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markBenefitDelivered = async (
  citizenId,
  status,
  benefitType,
  cylinderData,
  quantity
) => {
  try {
    const response = await api.patch(`/citizens/mark-delivered/${citizenId}`, {
      status,
      event_type: benefitType,
      cylinders: cylinderData,
      quantity
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const endBenefitSession = async () => {
  try {
    const response = await api.patch("/citizens/end-session");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
