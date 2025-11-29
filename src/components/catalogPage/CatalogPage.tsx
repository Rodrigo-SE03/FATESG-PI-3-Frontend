import PageMeta from "../common/PageMeta";
import ItemsGrid from "../itemsGrid/ItemsGrid";
import CatalogHeader from "../catalogHeader/CatalogHeader";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import type { WorkItem } from "../../types/works";
import { useCatalog } from "../../hooks/useCatalog";
import { WorkType } from "../../types/works";
import { useNavigate } from "react-router-dom";

type CatalogPageProps = {
  title: string;
  description: string;  
  workType: WorkType;
  mockItems?: WorkItem[];
  filterFn?: (item: WorkItem, term: string) => boolean;
};

const CatalogPage: React.FC<CatalogPageProps> = ({
  title,
  description,
  workType,
  mockItems,
  filterFn,
}) => {
  const navigate = useNavigate();
  const redirectAdd = () => {
    navigate(`/${workType}s/add`);
  }

  const {
    loading,
    filteredItems,
    searchTerm,
    setSearchTerm,
  } = useCatalog({ workType, mockItems, filterFn });

  return (
    <>
      <PageMeta description={description} />
      <div className="body-tex mb-4 mt-header-height">
        <CatalogHeader
          title={title}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onAdd={redirectAdd}
        />

        {loading ? (
          <div className="flex justify-center mt-8">
            <LoadingSpinner />
          </div>
        ) : (
          <ItemsGrid items={filteredItems} />
        )}
      </div>
    </>
  );
};

export default CatalogPage;