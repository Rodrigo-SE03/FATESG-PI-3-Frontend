import api from "../auth/Api";
import { AddPayload, UpdatePayload } from "../types/works";

export const fetchWorks = async (type: string) => {
  try {
    const response = await api.get(`/catalog?categoria=${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

export const removeWork = async (type: string, id: string) => {
  try {
    const response = await api.delete(`/catalog?category=${type}&id=${id}`);
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

export const editWork = async (data: UpdatePayload) => {
  try {
    const response = await api.patch(`/catalog`, data);
    return response.data;
  } catch (error) {
    console.error(`Error editing item:`, error);
    throw error;
  }
};

export const searchWorks = async (type: string, query: string) => {
  try {
    const response = await api.get(`/search?category=${type}&q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching ${type} with query "${query}":`, error);
    throw error;
  }
};

export const getRecommendationsByUser = async (type: string) => {
  try {
    const response = await api.get(`/recommendations/user?target_category=${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recommendations:`, error);
    throw error;
  }
};