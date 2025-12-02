// src/components/itemsGrid/ItemThumb.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import type { WorkItem } from "../../types/works";

const MAX_STARS = 5;

type StatusType = "completed" | "in_progress" | "planned" | "abandoned";

const STATUS_CONFIG: Record<StatusType, { bgClass: string }> = {
  completed: {
    bgClass: "bg-green-600/80",
  },
  in_progress: {
    bgClass: "bg-blue-600/80",
  },
  planned: {
    bgClass: "bg-gray-600/80",
  },
  abandoned: {
    bgClass: "bg-red-600/80",
  },
};

interface ItemThumbProps {
  item: WorkItem;
  containerClassName?: string;
  onClick?: () => void;
}

const ItemThumb: React.FC<ItemThumbProps> = ({
  item,
  containerClassName = "",
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    navigate(`/work/${item.id}`, { state: { item } });
  };

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

  const status = item.status as StatusType | undefined;
  const statusConfig = status ? STATUS_CONFIG[status] : null;

  return (
    <div
      className={`
        flex flex-col
        text-center
        cursor-pointer
        ${containerClassName}
      `}
      onClick={handleClick}
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

        {/* Bandeirinha de status no canto superior esquerdo */}
        {statusConfig && (
          <div
              className={`
              absolute left-1 top-0
              h-6 w-3
              ${statusConfig.bgClass}
              `}
          />
          )}
      </div>

      <div className="mt-1 flex flex-col gap-0.5">
        {item.rating !== undefined && renderStars(item.rating)}
        <span
          className="text-[0.8rem] font-medium leading-tight truncate"
          title={item.title}
        >
          {item.title}
        </span>
      </div>
    </div>
  );
};

export default ItemThumb;