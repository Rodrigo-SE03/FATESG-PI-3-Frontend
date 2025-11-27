import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";

// importe os mesmos itens da sidebar
import { navItems, othersItems } from "./AppSidebar";
import type { NavItem } from "./AppSidebar";

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toggleMobileSidebar } = useSidebar();

  const isActive = useCallback(
    (path?: string) => (path ? location.pathname === path : false),
    [location.pathname]
  );

  const primaryItems: NavItem[] = navItems;
  const otherItems: NavItem[] = othersItems;

  const renderFooterItem = (item: NavItem) => {
    // ação: tema
    if (item.action === "toggleTheme") {
      return (
        <button
          key={item.name}
          type="button"
          onClick={toggleTheme}
          className="
            flex flex-col items-center justify-center
            gap-1 text-xs shrink-0
          "
        >
          <span className="w-6 h-6 flex items-center justify-center">
            {theme === "dark" ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </span>
        </button>
      );
    }

    // item normal com path
    if (item.path) {
      return (
        <Link
          key={item.name}
          to={item.path}
          className="
            flex flex-col items-center justify-center
            gap-1 text-xs shrink-0
          "
        >
          <span
            className={`
              w-6 h-6 flex items-center justify-center
              ${
                isActive(item.path)
                  ? "text-brand-500"
                  : "text-light-muted dark:text-dark-muted"
              }
            `}
          >
            {item.icon}
          </span>
        </Link>
      );
    }

    return null;
  };

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        w-full
        flex items-center gap-2
        bg-light-bg/95 dark:bg-dark-bg/95
        border-t border-light-border dark:border-dark-border
        backdrop-blur
        px-3 py-2
        lg:hidden
        overflow-x-hidden
      "
    >
      {/* Botão para abrir o menu lateral mobile (drawer) */}
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="
          flex flex-col items-center justify-center
          gap-1 text-xs shrink-0
        "
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Área de navegação: principais (scroll) | divisor | others fixo */}
      <div className="flex-1 flex items-center min-w-0">
        {/* Grupo principal com scroll horizontal */}
        <div className="flex-1 overflow-x-auto no-scrollbar min-w-0">
          {/* TODO - Trocar o justify-evenly por justify-start quando tiver mais páginas */}
          <div className="flex items-center justify-evenly gap-4 px-2 whitespace-nowrap">
            {primaryItems.map(renderFooterItem)}
          </div>
        </div>

        {/* Divisor vertical */}
        {/* <div className="h-8 w-px bg-light-border dark:bg-dark-border mx-2 shrink-0" /> */}

        {/* Grupo Others fixo à direita, sem scroll */}
        {/* <div className="flex items-center gap-3 shrink-0">
          {otherItems.map(renderFooterItem)}
        </div> */}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
