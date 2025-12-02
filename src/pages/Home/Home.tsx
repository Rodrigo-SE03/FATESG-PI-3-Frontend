import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";

import PageMeta from "../../components/common/PageMeta";
import { useSidebar } from "../../context/SidebarContext";
import type { WorkItem, WorkType } from "../../types/works";
import { fetchWorks } from "../../utils/requests";
import ItemThumb from "../../components/itemsGrid/ItemThumb";

const CATEGORIES: { type: WorkType; label: string }[] = [
  { type: "filme", label: "Filmes" },
  { type: "livro", label: "Livros" },
  { type: "jogo", label: "Jogos" },
  { type: "anime", label: "Animes" }
];

type CategoryData = Record<WorkType, WorkItem[]>;

const MAX_STARS = 5;

const Home = () => {
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();

  const [data, setData] = useState<CategoryData>({
    filme: [],
    livro: [],
    anime: [],
    jogo: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.all(
          CATEGORIES.map(async ({ type }) => {
            const { items } = await fetchWorks(type);
            return { type, items };
          })
        );

        const newData: Partial<CategoryData> = {};
        results.forEach(({ type, items }) => {
          newData[type] = items;
        });

        setData((prev) => ({
          ...prev,
          ...(newData as CategoryData),
        }));
      } catch (error) {
        console.error("Erro ao buscar itens para a Home:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center justify-center gap-0.5">
        {Array.from({ length: MAX_STARS }).map((_, i) => {
          const starValue = i + 1;
          const halfValue = i + 0.5;

          let Icon = Star;
          let className = "h-3 w-3 text-gray-400";

          if (rating >= starValue) {
            Icon = Star;
            className = "h-3 w-3 text-yellow-400 fill-yellow-400";
          } else if (rating >= halfValue) {
            Icon = StarHalf;
            className = "h-3 w-3 text-yellow-400 fill-yellow-400";
          }

          return <Icon key={i} className={className} />;
        })}
      </div>
    );
  };

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
              <section key={type} className="mb-8">
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