import PageMeta from "../../components/common/PageMeta";
import Select from "../../components/form/Select";
import { useState, useEffect } from "react";
import { categoryOptions } from "../../utils/commonItems";
import { WorkType } from "../../types/works";
import Button from "../../components/ui/button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ItemsGrid from "../../components/itemsGrid/ItemsGrid";
import { useRecommendations } from "../../hooks/useRecommendations";

const Recommendation = () => {
  const [category, setCategory] = useState<WorkType>("filme");

  const {
    recommendations,
    loading,
    available,
    checkingAvailability,
    checkAvailability,
    fetchRecommendations,
  } = useRecommendations(category);

  // checa disponibilidade quando entra na tela e quando muda a categoria
  useEffect(() => {
    void checkAvailability();
  }, [category, checkAvailability]);

  return (
    <div>
      <PageMeta description="Recomendações personalizadas para você" />
      <div className="body-tex mb-4">
        <h1 className="header-text">Recomendações</h1>

        <div className="mt-6 flex flex-row justify-between items-center gap-4">
          {checkingAvailability ? (
            <LoadingSpinner />
          ) : !available ? (
            <p className="body-text">
              Para obter recomendações é necessário catalogar pelo menos um item
            </p>
          ) : (
            <>
              <Select
                options={categoryOptions}
                value={category}
                onChange={(value) => setCategory(value as WorkType)}
                className="flex-1"
              />
              <Button variant="primary" onClick={fetchRecommendations}>
                Gerar Recomendações
              </Button>
            </>
          )}
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