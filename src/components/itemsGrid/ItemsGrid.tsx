import React from "react";
import type { WorkItem } from "../../types/works";
import ItemThumb from "./ItemThumb";

interface ItemsGridProps {
  items: WorkItem[];
}

const ItemsGrid: React.FC<ItemsGridProps> = ({ items }) => {

  if (items.length === 0) {
    return <p className="text-center">Nenhum item encontrado.</p>;
  }

  return (
    <div className="flex flex-wrap -mx-1">
      {items.map((item) => (
        <ItemThumb
          key={item.id}
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