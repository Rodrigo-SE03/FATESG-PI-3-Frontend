import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import clsx from "clsx";

type TabId = string;

export type TabItem = {
  id: TabId;
  label: string;
  disabled?: boolean;
};

type TabsContextValue = {
  activeTabId: TabId;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs.Panel deve ser usado dentro de <Tabs>.");
  }
  return ctx;
}

type TabsProps = {
  tabs: TabItem[];
  defaultTabId?: TabId;
  value?: TabId;
  onTabChange?: (id: TabId) => void;
  className?: string;
  children: ReactNode;
};

const TabsRoot: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onTabChange,
  className,
  children,
  value,
}) => {
  const initialId = useMemo(() => {
    if (defaultTabId && tabs.some((t) => t.id === defaultTabId)) {
      return defaultTabId;
    }
    return tabs[0]?.id;
  }, [defaultTabId, tabs]);

  const [internalActiveTabId, setInternalActiveTabId] =
    useState<TabId | undefined>(initialId);

  const isControlled = value !== undefined;
  const activeTabId = isControlled ? (value as TabId) : (internalActiveTabId as TabId);

  const handleChange = (id: TabId) => {
    if (!isControlled) {
      setInternalActiveTabId(id);
    }
    onTabChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTabId }}>
      <div className={`w-full ${className}`}>
        {/* Header das tabs */}
        <div className="inline-flex gap-1 rounded-xl bg-light-bg/60 dark:bg-dark-bg/60 p-1 border border-light-border dark:border-dark-border">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => !tab.disabled && handleChange(tab.id)}
                className={clsx(
                  "px-3 py-1.5 text-theme-xs sm:text-theme-sm rounded-lg transition-all",
                  "border border-transparent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70",
                  tab.disabled &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent",
                  isActive
                    ? "bg-button-primary dark:bg-brand-primary text-dark-text dark:text-dark-text border-brand-200 dark:border-brand-800 shadow-sm"
                    : "text-light-text/70 dark:text-dark-text/70 hover:bg-light-bg/80 hover:dark:bg-dark-bg/80"
              )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo das tabs */}
        <div className="mt-3">
          {children}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

type TabsPanelProps = {
  tabId: TabId;
  children: ReactNode;
  className?: string;
};

const TabsPanel: React.FC<TabsPanelProps> = ({ tabId, children, className }) => {
  const { activeTabId } = useTabsContext();

  if (activeTabId !== tabId) return null;

  return <div className={className}>{children}</div>;
};

// export com “namespace”
export const Tabs = Object.assign(TabsRoot, {
  Panel: TabsPanel,
});
