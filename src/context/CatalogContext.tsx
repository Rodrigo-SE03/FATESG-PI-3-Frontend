import React, { createContext, useContext, useState } from "react";
import type { WorkItem, WorkType } from "../types/works";

type CatalogSlice = {
  items: WorkItem[];
  searchTerm: string;
};

type CatalogsState = Partial<Record<WorkType, CatalogSlice>>;

type CatalogContextValue = {
  catalogs: CatalogsState;
  setCatalogs: React.Dispatch<React.SetStateAction<CatalogsState>>;
};

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [catalogs, setCatalogs] = useState<CatalogsState>({});

  return (
    <CatalogContext.Provider value={{ catalogs, setCatalogs }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalogContext deve ser usado dentro de CatalogProvider");
  }
  return ctx;
};