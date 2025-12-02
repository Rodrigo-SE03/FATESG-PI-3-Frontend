import PageMeta from "../../components/common/PageMeta";
import Select from "../../components/form/Select";
import { useState } from "react";
import { categoryOptions } from "../../utils/commonItems";
import { WorkType } from "../../types/works";
import Button from "../../components/ui/button/Button";
import { getRecommendationsByUser } from "../../utils/requests";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ItemsGrid from "../../components/itemsGrid/ItemsGrid";

const Recommendation = () => {
  const [category, setCategory] = useState("filme");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getRecommendationsByUser(category);
      console.log("Recomendações recebidas:", data);
      setRecommendations(data.recommendations[category]);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
    }
    setLoading(false);
  };

  return (
    <div>
        <PageMeta description="Recomendações personalizadas para você" />
        <div className="body-tex mb-4">
            <h1 className="header-text">Recomendações</h1>

            <div className="mt-6 flex flex-row justify-between items-center gap-4">
              <Select
                options={categoryOptions}
                value={category}
                onChange={(value) => setCategory(value as WorkType)}
                className="flex-1"
              />
              <Button variant="primary" onClick={fetchRecommendations}>Gerar Recomendações</Button>
            </div>
            {loading ? (
              <div className="flex justify-center mt-8">
                <LoadingSpinner />
              </div>
            ) : (
            <div className="mt-8">
              <ItemsGrid items={recommendations} />
            </div>
            )}
        </div>
    </div>
    );
};

export default Recommendation;