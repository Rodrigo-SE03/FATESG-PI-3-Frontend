import api from "../auth/Api";

export const fetchWorks = async (type: string) => {
  try {
    const response = await api.get(`/catalog?categoria=${type}`);
    console.log(`Fetched ${type}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};