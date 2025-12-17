import { Tabs } from "../tabs/Tabs";
import ItemsGrid from "../itemsGrid/ItemsGrid";
import { categoryOptions } from "../../utils/commonItems";
import { useState, useEffect } from "react";
import type { WorkType } from "../../types/works";
import { WorkItem } from "../../types/works";
import { getRecommendationsByItem } from "../../utils/requests";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

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
    manga: [],
    serie: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getRecommendationsByItem(workType, workId);
      setRecommendations(data);
    } catch (error) {
      console.error(`Failed to fetch recommendations: `, error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [workType, workId]);

  if (loading) {
    return <LoadingSpinner />;
  }

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