import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import clsx from "clsx";
import AppHeader from "./AppHeader";
import MobileBottomNav from "./MobileBottomNav";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const isOpen = isExpanded || isHovered;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      {/* Sidebar fixa na esquerda */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-40",
          "transition-[width] duration-300 ease-in-out",
          "overflow-hidden",
          // mobile: ocupa tela quando aberta, some quando fechada
          isMobileOpen ? "w-[290px]" : "w-0",
          // desktop: sempre visível, só muda largura
          "lg:w-auto", // permite sobrescrever abaixo
          isOpen ? "lg:w-[290px]" : "lg:w-[90px]"
        )}
        style={{ willChange: "width" }}
      >
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Conteúdo principal deslocado pela largura da sidebar */}
      <div
        className={clsx(
          "min-h-screen flex flex-col",
          "transition-[margin-left] duration-300 ease-in-out",
          "ml-0",
          isOpen ? "lg:ml-[290px]" : "lg:ml-[90px]"
        )}
        style={{ willChange: "margin-left" }}
      >
        {/* <AppHeader /> */}
        <main className="flex-1">
          <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-4xl) md:p-6 md:pb-6">
            <Outlet />
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;