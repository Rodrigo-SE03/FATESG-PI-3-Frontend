import React, { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import clsx from "clsx";

type ToastColor = "success" | "warning" | "info" | "error";
const closingTimeout = 5000;

export type ToastData = {
  open: boolean;
  title: string;
  message: string;
  color: "success" | "error" | "info";
};

type ToastProps = {
  title: string;
  message: string;
  color?: ToastColor;
  showIcon?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  open: boolean;
  onClose: () => void;
};

const colorStyles: Record<ToastColor, string> = {
  success:
    "border-emerald-500/70 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100",
  warning:
    "border-amber-500/70 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100",
  info:
    "border-sky-500/70 bg-sky-50 text-sky-900 dark:bg-sky-900/20 dark:text-sky-100",
  error:
    "border-rose-500/70 bg-rose-50 text-rose-900 dark:bg-rose-900/20 dark:text-rose-100",
};

const Toast: React.FC<ToastProps> = ({
  title,
  message,
  color = "info",
  showIcon = true,
  icon: Icon,
  open,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, closingTimeout);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!isMounted) return null;

  const IconToRender = Icon ?? Info;

  return (
    <div
      className={clsx(
        "fixed z-99999",
        // Mobile: topo da tela, quase full width
        "top-4 inset-x-4",
        // Desktop: canto superior direito
        "md:inset-x-auto md:right-4 md:left-auto",
        "transition-all duration-200",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2",
      )}
    >
      <div
        className={clsx(
          "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg",
          "backdrop-blur-md",
          colorStyles[color],
        )}
      >
        {showIcon && (
          <div className="mt-0.5">
            <IconToRender className="h-5 w-5" aria-hidden="true" />
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-snug opacity-90">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-2 rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Toast;