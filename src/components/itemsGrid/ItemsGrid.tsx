import React from "react";
import type { WorkItem } from "../../types/works";
import { Star, StarHalf } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ItemsGridProps {
  items: WorkItem[];
}

const MAX_STARS = 5;

const ItemsGrid: React.FC<ItemsGridProps> = ({ items }) => {
  const navigate = useNavigate();

  if (items.length === 0) {
    return <p className="text-center">Nenhum item encontrado.</p>;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center justify-center gap-0.5">
        {Array.from({ length: MAX_STARS }).map((_, i) => {
          const starValue = i + 1;
          const halfValue = i + 0.5;

          let Icon = Star;
          let className =
            "h-3 w-3 text-gray-400"; // estrela vazia (ajuste cores se quiser)

          if (rating >= starValue) {
            // cheia
            Icon = Star;
            className = "h-3 w-3 text-yellow-400 fill-yellow-400";
          } else if (rating >= halfValue) {
            // meia
            Icon = StarHalf;
            className = "h-3 w-3 text-yellow-400 fill-yellow-400";
          }

          return <Icon key={i} className={className} />;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap -mx-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="
            flex flex-col
            w-1/3 px-1 mb-3      /* 3 colunas no mobile */
            sm:w-1/4             /* 4 colunas no tablet */
            lg:w-1/6             /* 6 colunas no desktop */
            text-center
            cursor-pointer
          "
          onClick={() => {
            navigate(`/work/${item.id}`, { state: { item } });
          }}
        >
          <div className="relative w-full overflow-hidden rounded-md aspect-2/3">
          {item.cover_url ? (
            <img
              src={item.cover_url}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {item.title}
            </div>
          )}
          </div>

          <div className="mt-1 flex flex-col gap-0.5">
            {renderStars(item.rating)}
            <span
              className="text-[0.8rem] font-medium leading-tight truncate"
              title={item.title}
            >
              {item.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsGrid;