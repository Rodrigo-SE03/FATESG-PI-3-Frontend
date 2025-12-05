import PageMeta from "../common/PageMeta";
import ItemsGrid from "../itemsGrid/ItemsGrid";
import CatalogHeader from "../catalogHeader/CatalogHeader";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import type { WorkItem } from "../../types/works";
import { useCatalog } from "../../hooks/useCatalog";
import { WorkType } from "../../types/works";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Modal } from "../ui/modal";
import Select from "../form/Select";
import Button from "../ui/button/Button";

type CatalogPageProps = {
  title: string;
  description: string;
  workType: WorkType;
  filterFn?: (item: WorkItem, term: string) => boolean;
};

type SortOption = "rating" | "date";
type StatusFilter = "all" | "completed" | "in_progress" | "planned" | "on_hold" | "abandoned";

const CatalogPage: React.FC<CatalogPageProps> = ({
  title,
  description,
  workType,
  filterFn,
}) => {
  const navigate = useNavigate();
  const redirectAdd = () => {
    navigate(`/${workType}s/add`);
  };

  const {
    loading,
    filteredItems,
    searchTerm,
    setSearchTerm,
  } = useCatalog({ workType, filterFn });

  // estado do modal de filtros
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const handleOpenFilters = () => setIsFilterModalOpen(true);
  const handleCloseFilters = () => setIsFilterModalOpen(false);

  // aplica filtro + ordenação em cima do resultado do hook
  const displayedItems = useMemo(() => {
    let items = [...filteredItems];

    // filtro por status
    if (statusFilter !== "all") {
      items = items.filter((item) => item.status === statusFilter);
    }

    // ordenação
    items.sort((a, b) => {
      if (sortBy === "rating") {
        const ar = a.rating ?? 0;
        const br = b.rating ?? 0;
        return br - ar; // maior avaliação primeiro
      }

      if (sortBy === "date") {
        // troque "date" pelo campo real de data se for outro
        const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bd - ad; // mais recente primeiro
      }

      return 0;
    });

    return items;
  }, [filteredItems, sortBy, statusFilter]);

  return (
    <>
      <PageMeta description={description} />
      <div className="body-tex mb-4 mt-header-height">
        <CatalogHeader
          title={title}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onAdd={redirectAdd}
          onFilter={handleOpenFilters}
        />

        {loading ? (
          <div className="flex justify-center mt-8">
            <LoadingSpinner />
          </div>
        ) : (
          <ItemsGrid items={displayedItems} />
        )}
      </div>

      {/* Modal de filtros/ordenação */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilters}
        showCloseButton={false}
        className="max-w-md mx-4"
      >
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-semibold">Filtros</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ordenar por</label>
            <Select
              options={[
                { value: "rating", label: "Avaliação" },
                { value: "date", label: "Data" },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as SortOption)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              options={[
                { value: "all", label: "Todos" },
                { value: "completed", label: "Completo" },
                { value: "in_progress", label: "Em progresso" },
                { value: "planned", label: "Planejado" },
                { value: "on_hold", label: "Pausado" },
                { value: "abandoned", label: "Abandonado" },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as StatusFilter)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setSortBy("rating");
                setStatusFilter("all");
              }}
            >
              Limpar
            </Button>
            <Button onClick={handleCloseFilters}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CatalogPage;