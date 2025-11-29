import api from "../auth/Api";
import { AddPayload } from "../types/works";

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

export const removeWork = async (type: string, id: string) => {
  try {
    const response = await api.delete(`/catalog?category=${type}&id=${id}`);
    console.log(`Removed ${type} with id ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error removing ${type} with id ${id}:`, error);
    throw error;
  }
};

export const addWork = async (data: AddPayload) => {
  try {
    const response = await api.post(`/catalog`, data);
    return response.data;
  } catch (error) {
    console.error(`Error adding item:`, error);
    throw error;
  }
};

export const searchWorks = async (type: string, query: string) => {
  try {
    const response = await api.get(`/search?category=${type}&q=${encodeURIComponent(query)}`);
    console.log(`Search results for ${type} with query "${query}":`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error searching ${type} with query "${query}":`, error);
    throw error;
  }
};