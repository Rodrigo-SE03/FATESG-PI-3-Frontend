import { useCallback } from "react";
import type { WorkItem, WorkType } from "../types/works";
import { fetchWorks, getRecommendationsByUser } from "../utils/requests";
import { useRecommendationsContext } from "../context/RecommendationsContext";

type RecommendationSlice = {
  recommendations: WorkItem[];
  loading: boolean;
  available: boolean;
  checkingAvailability: boolean;
};

const defaultSlice = (): RecommendationSlice => ({
  recommendations: [],
  loading: false,
  available: false,
  checkingAvailability: false,
});

export function useRecommendations(category: WorkType) {
  const { state, setState } = useRecommendationsContext();

  const slice = state[category] ?? defaultSlice();
  const { recommendations, loading, available, checkingAvailability } = slice;

  const updateSlice = (partial: Partial<RecommendationSlice>) => {
    setState((prev) => {
      const prevSlice = prev[category] ?? defaultSlice();
      return {
        ...prev,
        [category]: {
          ...prevSlice,
          ...partial,
        },
      };
    });
  };

  const checkAvailability = useCallback(async () => {
    updateSlice({ checkingAvailability: true });
    try {
      const items = await fetchWorks(undefined,1);
      updateSlice({
        available: items.items.length > 0,
      });
    } catch (error) {
      console.error("Erro ao verificar disponibilidade de itens:", error);
      updateSlice({ available: false });
    } finally {
      updateSlice({ checkingAvailability: false });
    }
  }, [category, setState]);

  const fetchRecommendations = useCallback(async () => {
    updateSlice({ loading: true });
    try {
      const data = await getRecommendationsByUser(category);
      updateSlice({
        recommendations: data.recommendations[category] ?? [],
      });
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      // aqui você pode decidir limpar ou manter as anteriores; vou manter
    } finally {
      updateSlice({ loading: false });
    }
  }, [category, setState]);

  return {
    recommendations,
    loading,
    available,
    checkingAvailability,
    checkAvailability,
    fetchRecommendations,
  };
}