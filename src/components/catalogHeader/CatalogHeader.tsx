import React from "react";
import Button from "../ui/button/Button";
import { CirclePlus, Search, SlidersHorizontal } from "lucide-react";
import Input from "../form/input/InputField";
import type { ChangeEvent } from "react";
import { useSidebar } from "../../context/SidebarContext";

interface CatalogHeaderProps {
  title: string;
  onAdd?: () => void;
  onFilter?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  title,
  onAdd,
  onFilter,
  searchValue,
  onSearchChange,
}) => {
  const { isExpanded } = useSidebar();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-20 h-header-height gap-2 ${isExpanded ? "lg:left-sidebar-expanded-width" : "lg:left-sidebar-collapsed-width"}
        flex items-center justify-between
        px-4 transition-all duration-300 ease-in-out
        bg-light-bg-alt/80 dark:bg-dark-bg-alt/80 backdrop-blur-sm
      `}
    >
      {/* Esquerda: título da página */}
      <h1 className="header-text">
        {title}
      </h1>

      {/* Direita: botões de ações */}
      <div className="flex flex-row items-center justify-end gap-1">
        {onSearchChange && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-light-text dark:text-dark-text" />
            <Input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Buscar..."
              className="pl-7 pr-2 py-1 min-w-[150px] h-[35px]"
            />
          </div>
        )}
        <Button
          className="w-8"
          variant="icon"
          startIcon={<CirclePlus size={18} />}
          aria-label="Adicionar"
          onClick={onAdd}
        />
        <Button
          variant="icon"
          startIcon={<SlidersHorizontal size={18} />}
          aria-label="Filtrar"
          onClick={onFilter}
          className="w-8"
        />
      </div>
    </header>
  );
};

export default CatalogHeader;