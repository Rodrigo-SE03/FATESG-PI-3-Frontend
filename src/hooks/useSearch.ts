import { useState } from "react";
import type { WorkItem } from "../types/works";
import { searchWorks } from "../utils/requests";
import type { WorkType } from "../types/works";

type UseWorkSearchOptions = {
  workType: WorkType;
};

export function useWorkSearch({ workType }: UseWorkSearchOptions) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const result = await searchWorks(workType, trimmed);
      setResults(result);
    } catch (err) {
      console.error("Error searching works:", err);
      setError("Não foi possível buscar os itens agora.");
      setResults([]);
    } finally {
      setLoading(false);
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
