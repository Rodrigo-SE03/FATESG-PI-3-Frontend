import { useEffect, useState } from "react";
import type { WorkItem } from "../types/works";
import { fetchWorks } from "../utils/requests";
import { WorkType } from "../types/works";

type UseCatalogOptions = {
  workType: WorkType;                       
  mockItems?: WorkItem[];
  filterFn?: (item: WorkItem, term: string) => boolean;
};

export function useCatalog({
  workType,
  mockItems = [],
  filterFn,
}: UseCatalogOptions) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WorkItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { items } = await fetchWorks(workType);
        setItems(items);
      } catch (error) {
        console.error(`Error fetching works (${workType}):`, error);
        setItems(mockItems);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workType]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredItems = normalizedSearch
    ? items.filter((item) =>
        filterFn
          ? filterFn(item, normalizedSearch)
          : item.title.toLowerCase().includes(normalizedSearch)
      )
    : items;

  return {
    loading,
    items,
    filteredItems,
    searchTerm,
    setSearchTerm,
  };
}
