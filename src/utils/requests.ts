import api from "../auth/Api";
import { AddPayload, UpdatePayload } from "../types/works";
import { WorkType } from "../types/works";

export const fetchWorks = async (type?: WorkType, limit?:number) => {
  try {
    const response = await api.get(`/catalog?${type ? `categoria=${type}` : ""}${limit ? `&limit=${limit}` : ""}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

export const removeWork = async (type: WorkType, id: string) => {
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

export const searchWorks = async (type: WorkType, query: string) => {
  try {
    const response = await api.get(`/search?category=${type}&q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching ${type} with query "${query}":`, error);
    throw error;
  }
};

export const getRecommendationsByUser = async (type: WorkType) => {
  try {
    const response = await api.get(`/recommendations/user?target_category=${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recommendations:`, error);
    throw error;
  }
};

export const getRecommendationsByItem = async (type: WorkType, id: string, target_category?: WorkType) => {
  try {
    const response = await api.get(`/recommendations/item?category=${type}&id=${id}${target_category ? `&target_category=${target_category}` : ""}`);
    return response.data.recommendations;
  } catch (error) {
    console.error(`Error fetching item-based recommendations:`, error);
    throw error;
  }
};