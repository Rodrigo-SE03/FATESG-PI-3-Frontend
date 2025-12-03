import React, { createContext, useContext, useState } from "react";
import type { WorkItem, WorkType } from "../types/works";

type RecommendationSlice = {
  recommendations: WorkItem[];
  loading: boolean;
  available: boolean;
  checkingAvailability: boolean;
};

type RecommendationsState = Partial<Record<WorkType, RecommendationSlice>>;

type RecommendationsContextValue = {
  state: RecommendationsState;
  setState: React.Dispatch<React.SetStateAction<RecommendationsState>>;
};

const RecommendationsContext = createContext<RecommendationsContextValue | undefined>(
  undefined
);

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<RecommendationsState>({});
  return (
    <RecommendationsContext.Provider value={{ state, setState }}>
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendationsContext = () => {
  const ctx = useContext(RecommendationsContext);
  if (!ctx) {
    throw new Error(
      "useRecommendationsContext deve ser usado dentro de RecommendationsProvider"
    );
  }
  return ctx;
};