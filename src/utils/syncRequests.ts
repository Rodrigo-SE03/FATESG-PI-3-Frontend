import api from "../auth/Api";

export const syncMalData = (malUsername: string) => {
  try {
    // api.post(`/catalog/sync-mal`, { username: malUsername, category: "anime" });
    api.post(`/catalog/sync-mal`, { username: malUsername, category: "manga" });
    return "ok";
  } catch (error) {
    console.error(`Error syncing MyAnimeList data for username ${malUsername}:`, error);
    throw error;
  }
};