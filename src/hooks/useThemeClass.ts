import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function useThemeClass(): Theme {
  const getTheme = (): Theme =>
    document.documentElement.classList.contains("dark") ? "dark" : "light";

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "light";
    return getTheme();
  });

  useEffect(() => {
    // Reage a mudanças na classe do html (<html class="dark">)
    const mo = new MutationObserver(() => setTheme(getTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Opcional: sincroniza se o template mexe no localStorage("theme")
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
        setTheme(e.newValue as Theme);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return theme;
}