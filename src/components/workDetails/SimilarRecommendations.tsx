import { Tabs } from "../tabs/Tabs";
import ItemsGrid from "../itemsGrid/ItemsGrid";
import { categoryOptions } from "../../utils/commonItems";
import { useState, useEffect } from "react";
import { mockMovies } from "../../utils/movies/movieItems";
import type { WorkType } from "../../types/works";
import { WorkItem } from "../../types/works";
import { getRecommendationsByItem } from "../../utils/requests";

const tabOptions = categoryOptions.map(({ value, label }) => ({ id: value, label: `${label}s` }));

type RecommendationCollection = {
  [key in WorkType]: WorkItem[];
};

interface SimilarRecommendationsProps {
  workType: WorkType;
  workId: string;
}

const SimilarRecommendations = ({ workType, workId }: SimilarRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationCollection>({
    filme: [],
    anime: [],
    jogo: [],
    livro: [],
  });

  const fetchRecommendations = async (target_type: WorkType) => {
    try {
      const data = await getRecommendationsByItem(workType, workId, target_type);
      setRecommendations((prev) => ({ ...prev, [target_type]: data }));
    } catch (error) {
      console.error(`Failed to fetch recommendations for ${target_type}:`, error);
    }
  };

  useEffect(() => {
    tabOptions.forEach((tab) => {
      fetchRecommendations(tab.id as WorkType);
    });
  }, [workType, workId]);

  return (
    <Tabs
      tabs={tabOptions}
      defaultTabId="filme"
    >
      {tabOptions.map((tab) => (
        <Tabs.Panel key={tab.id} tabId={tab.id}>
          <ItemsGrid items={recommendations[tab.id]} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default SimilarRecommendations;