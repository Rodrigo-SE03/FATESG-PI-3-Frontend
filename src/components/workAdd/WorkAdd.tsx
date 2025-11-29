import { Search } from "lucide-react";
import PageMeta from "../common/PageMeta";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ItemsGrid from "../itemsGrid/ItemsGrid";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useWorkSearch } from "../../hooks/useSearch";
import type { WorkType } from "../../types/works";

type WorkAddProps = {
  title: string;
  description: string;
  workType: WorkType;
};

const WorkAdd: React.FC<WorkAddProps> = ({ title, description, workType }) => {
  const {
    query,
    setQuery,
    results,
    loading,
    hasSearched,
    error,
    setError,
    runSearch,
  } = useWorkSearch({ workType });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch();
  };

  return (
    <>
      <PageMeta description={description} />

      <div className="px-2 py-4 max-w-3xl mx-auto">
        <h1 className="mb-4 text-2xl font-semibold">{title}</h1>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError(null);
              }}
              className="h-12"
            />
          </div>

          <Button type="submit" startIcon={<Search size={20} />} variant="outline" className="h-12"/>
        </form>

        {loading && (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!loading && error && (
          <p className="mt-4 text-sm text-error-500">{error}</p>
        )}

        {!loading && hasSearched && !error && results.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhum resultado encontrado para sua busca.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="mt-6">
            <ItemsGrid items={results} />
          </div>
        )}
      </div>
    </>
  );
};

export default WorkAdd;