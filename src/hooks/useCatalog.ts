import { useEffect, useMemo, useState } from "react";
import type { WorkItem } from "../types/works";
import { fetchWorks } from "../utils/requests";
import { WorkType } from "../types/works";
import { useCatalogContext } from "../context/CatalogContext";

type UseCatalogOptions = {
  workType: WorkType;
  filterFn?: (item: WorkItem, term: string) => boolean;
};

export function useCatalog({
  workType,
  filterFn,
}: UseCatalogOptions) {
  const { catalogs, setCatalogs } = useCatalogContext();

  // “slot” atual desse tipo de mídia
  const slice = catalogs[workType] ?? { items: [], searchTerm: "" };
  const { items, searchTerm } = slice;

  const [loading, setLoading] = useState(true);

  // atualiza searchTerm só desse workType
  const setSearchTerm = (value: string) => {
    setCatalogs((prev) => {
      const prevSlice = prev[workType] ?? { items: [], searchTerm: "" };
      return {
        ...prev,
        [workType]: {
          ...prevSlice,
          searchTerm: value,
        },
      };
    });
  };

  useEffect(() => {
    const load = async () => {
      // já tenho itens para esse tipo? então só marco como carregado
      if (items.length > 0) {
        setLoading(false);
        return;
      }

      try {
        const { items: fetchedItems } = await fetchWorks(workType);

        setCatalogs((prev) => {
          const prevSlice = prev[workType] ?? { items: [], searchTerm: "" };
          return {
            ...prev,
            [workType]: {
              ...prevSlice,
              items: fetchedItems,
            },
          };
        });
      } catch (error) {
        console.error(`Error fetching works (${workType}):`, error);

        setCatalogs((prev) => {
          const prevSlice = prev[workType] ?? { items: [], searchTerm: "" };
          return {
            ...prev,
            [workType]: {
              ...prevSlice,
              items: [],
            },
          };
        });
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    void load();
  }, [workType, items.length, setCatalogs]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredItems = useMemo(
    () =>
      normalizedSearch
        ? items.filter((item) =>
            filterFn
              ? filterFn(item, normalizedSearch)
              : item.title.toLowerCase().includes(normalizedSearch)
          )
        : items,
    [items, normalizedSearch, filterFn]
  );

  return {
    loading,
    items,
    filteredItems,
    searchTerm,
    setSearchTerm,
  };
}