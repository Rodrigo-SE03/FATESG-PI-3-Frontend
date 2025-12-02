import React from "react";
import type { WorkItem } from "../../types/works";
import { Star, StarHalf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ItemThumb from "./ItemThumb";

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
        <ItemThumb
          item={item}
          containerClassName="
            w-1/3 px-1 mb-3      /* 3 colunas no mobile */
            sm:w-1/4             /* 4 colunas no tablet */
            lg:w-1/6             /* 6 colunas no desktop */
            xl:w-1/8             /* 8 colunas em telas maiores */
          "
        />
      ))}
    </div>
  );
};

export default ItemsGrid;