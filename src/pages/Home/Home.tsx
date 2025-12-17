import { useEffect, useState } from "react";

import PageMeta from "../../components/common/PageMeta";
import { useSidebar } from "../../context/SidebarContext";
import type { WorkItem, WorkType } from "../../types/works";
import { fetchWorks } from "../../utils/requests";
import ItemThumb from "../../components/itemsGrid/ItemThumb";

const CATEGORIES: { type: WorkType; label: string }[] = [
  { type: "filme", label: "Filmes" },
  { type: "livro", label: "Livros" },
  { type: "jogo", label: "Jogos" },
  { type: "anime", label: "Animes" },
  { type: "serie", label: "Séries" },
  { type: "manga", label: "Mangás" },
];

const EMPTY_DATA: CategoryData = {
  filme: [],
  livro: [],
  jogo: [],
  anime: [],
  serie: [],
  manga: [],
};

type CategoryData = Record<WorkType, WorkItem[]>;

const Home = () => {
  const { isExpanded } = useSidebar();

  const [data, setData] = useState<CategoryData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { items } = await fetchWorks();
        setData({
          ...EMPTY_DATA,
          ...(items ?? {}),
        });
      } catch (error) {
        console.error("Erro ao buscar itens para a Home:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getRecentItems = (items: WorkItem[]) => {
    return [...items]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  };

  return (
    <div>
      <PageMeta description="Página inicial" />

      {/* Header fixo */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-20 h-header-height gap-2
          ${isExpanded ? "lg:left-sidebar-expanded-width" : "lg:left-sidebar-collapsed-width"}
          flex items-center justify-between
          px-4 transition-all duration-300 ease-in-out
          bg-light-bg-alt/80 dark:bg-dark-bg-alt/80 backdrop-blur-sm
        `}
      >
        <h1 className="header-text">Início</h1>
      </header>

      {/* Conteúdo principal abaixo do header */}
      <main
        className={`
          mt-header-height px-4 pb-8
        `}
      >
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Carregando…
          </p>
        ) : (
          CATEGORIES.map(({ type, label }) => {
            const items = data[type] || [];
            const recentItems = getRecentItems(items);

            return (
              <section key={type} className="mb-6">
                {/* Título da categoria + contagem */}
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-lg font-semibold">{label}</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {items.length} {items.length === 1 ? "item" : "itens"}
                  </span>
                </div>

                {/* Linha com os 10 itens mais recentes, em carrossel */}
                {recentItems.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum item nesta categoria.
                  </p>
                ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                    <div className="flex -mx-1">
                      {recentItems.map((item) => (
                        <ItemThumb
                          key={item.id}
                          item={item}
                          containerClassName="
                          flex-shrink-0
                            flex flex-col
                            w-1/3 px-1 mb-3      
                            sm:w-1/4             
                            lg:w-1/6             
                            xl:w-1/8            
                            text-center
                            cursor-pointer"
                          />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })
        )}
      </main>
    </div>
  );
};

export default Home;