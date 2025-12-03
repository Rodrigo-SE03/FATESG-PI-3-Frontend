import React, { createContext, useContext, useState } from "react";
import type { WorkItem, WorkType } from "../types/works";

type WorkAddSearchSlice = {
  query: string;
  results: WorkItem[];
  loading: boolean;
  hasSearched: boolean;
  error: string | null;
};

type WorkAddSearchState = Partial<Record<WorkType, WorkAddSearchSlice>>;

type WorkAddSearchContextValue = {
  state: WorkAddSearchState;
  setState: React.Dispatch<React.SetStateAction<WorkAddSearchState>>;
};

const WorkAddSearchContext = createContext<WorkAddSearchContextValue | undefined>(
  undefined
);

export const WorkAddSearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<WorkAddSearchState>({});

  return (
    <WorkAddSearchContext.Provider value={{ state, setState }}>
      {children}
    </WorkAddSearchContext.Provider>
  );
};

export const useWorkAddSearchContext = () => {
  const ctx = useContext(WorkAddSearchContext);
  if (!ctx) {
    throw new Error(
      "useWorkAddSearchContext deve ser usado dentro de WorkAddSearchProvider"
    );
  }
  return ctx;
};