import type { WorkItem } from "../types/works";
import { searchWorks } from "../utils/requests";
import type { WorkType } from "../types/works";
import { useWorkAddSearchContext } from "../context/WorkAddSearchContext";

type UseWorkSearchOptions = {
  workType: WorkType;
};

const defaultSlice = (): {
  query: string;
  results: WorkItem[];
  loading: boolean;
  hasSearched: boolean;
  error: string | null;
} => ({
  query: "",
  results: [],
  loading: false,
  hasSearched: false,
  error: null,
});

export function useWorkSearch({ workType }: UseWorkSearchOptions) {
  const { state, setState } = useWorkAddSearchContext();

  const slice = state[workType] ?? defaultSlice();
  const { query, results, loading, hasSearched, error } = slice;

  const updateSlice = (partial: Partial<typeof slice>) => {
    setState((prev) => {
      const prevSlice = prev[workType] ?? defaultSlice();
      return {
        ...prev,
        [workType]: {
          ...prevSlice,
          ...partial,
        },
      };
    });
  };

  const setQuery = (value: string) => {
    updateSlice({ query: value });
  };

  const setError = (value: string | null) => {
    updateSlice({ error: value });
  };

  const runSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    updateSlice({
      loading: true,
      hasSearched: true,
      error: null,
    });

    try {
      const result = await searchWorks(workType, trimmed);
      updateSlice({
        results: result,
      });
    } catch (err) {
      console.error("Error searching works:", err);
      updateSlice({
        error: "Não foi possível buscar os itens agora.",
        results: [],
      });
    } finally {
      updateSlice({ loading: false });
    }
  };

  return {
    query,
    setQuery,
    results,
    loading,
    hasSearched,
    error,
    setError,
    runSearch,
  };
}