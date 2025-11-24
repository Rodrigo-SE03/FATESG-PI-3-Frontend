import type React from "react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;

  // 👇 novas
  usePortal?: boolean; // padrão: false
  portalContainer?: HTMLElement | null; // se não passar, vai pro body
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select options",
  usePortal = false,
  portalContainer,
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // container “normal”
  const dropdownRef = useRef<HTMLDivElement>(null);
  // menu no portal
  const portalMenuRef = useRef<HTMLDivElement>(null);
  // posição do menu quando for portal
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  // clique fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // modo normal
      if (!usePortal) {
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
          setIsOpen(false);
        }
        return;
      }

      // modo portal
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        portalMenuRef.current &&
        !portalMenuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, usePortal]);

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange?.(newSelected);
  };

  const measureForPortal = () => {
    if (!dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  const openDropdown = () => {
    if (usePortal) {
      measureForPortal();
    }
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next && usePortal) {
        measureForPortal();
      }
      return next;
    });
    setFocusedIndex(-1);
  };

  const handleSelect = (optionValue: string) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];
    updateSelection(newSelected);
  };

  const removeOption = (optionValue: string) => {
    updateSelection(selectedOptions.filter((v) => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    switch (e.key) {
      case "Enter":
        if (!isOpen) {
          openDropdown();
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        if (!isOpen) {
          openDropdown();
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
    }
  };

  // alvo do portal (só usado se usePortal = true)
  const portalTarget =
    typeof document !== "undefined"
      ? portalContainer ?? document.body
      : null;

  // render do menu normal (sem portal)
  const menu = (
    <div
      className="absolute left-0 z-40 w-full overflow-y-aut rounded-lg shadow-sm top-full max-h-select bg-light-bg-alt dark:bg-dark-bg-alt"
      onClick={(e) => e.stopPropagation()}
      role="listbox"
      aria-label={label}
    >
      {options.map((option, index) => {
        const isSelected = selectedOptions.includes(option.value);
        const isFocused = index === focusedIndex;

        return (
          <div
            key={option.value}
            className={`hover:bg-primary/5 w-full cursor-pointer rounded-t border-b border-light-border dark:border-dark-border z-40 ${
              isFocused ? "bg-primary/5" : ""
            } ${isSelected ? "bg-primary/10" : ""}`}
            onClick={() => handleSelect(option.value)}
            role="option"
            aria-selected={isSelected}
          >
            <div className="relative flex w-full items-center p-2 pl-2 z-40">
              <div className="mx-2 leading-6 text-light-text dark:text-dark-text z-40">
                {option.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // render do menu em portal
  const portalMenu =
    isOpen &&
    portalTarget &&
    createPortal(
      <div
        ref={portalMenuRef}
        className="z-[9999] max-h-60 overflow-y-auto  bg-light-bg-alt dark:bg-dark-bg-alt rounded-lg shadow-sm border border-light-border dark:border-dark-border"
        style={{
          position: "absolute",
          top: menuPos.top,
          left: menuPos.left,
          width: menuPos.width,
        }}
        role="listbox"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.value);
          const isFocused = index === focusedIndex;

          return (
            <div
              key={option.value}
              className={`hover:bg-primary/5 w-full cursor-pointer border-b border-light-border dark:border-dark-border last:border-b-0 ${
                isFocused ? "bg-primary/5" : ""
              } ${isSelected ? "bg-primary/10" : ""}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={isSelected}
            >
              <div className="relative flex w-full items-center p-2 pl-2">
                <div className="mx-2 leading-6 text-light-text dark:text-dark-text">
                  {option.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>,
      portalTarget
    );

  return (
    <div className="w-full" ref={dropdownRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-light-text dark:text-dark-text"
        id={`${label}-label`}
      >
        {label}
      </label>

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            className="w-full"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={`${label}-label`}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
          >
            <div
              className={`mb-2 flex min-h-11 rounded-lg border border-light-border py-1.5 pl-3 pr-3 shadow-theme-xs outline-hidden transition focus:border-brand-300 focus:shadow-focus-ring dark:border-dark-border dark:bg-dark-bg-alt dark:focus:border-brand-300 ${
                disabled
                  ? "opacity-50 cursor-not-allowed bg-light-bg-alt dark:bg-dark-bg"
                  : "cursor-pointer"
              }`}
            >
              <div className="flex flex-wrap flex-auto gap-2">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((value) => {
                    const text =
                      options.find((opt) => opt.value === value)?.text || value;
                    return (
                      <div
                        key={value}
                        className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-dark-bg-alt/5 py-1 pl-2.5 pr-2 text-sm text-light-text hover:border-light-border dark:bg-light-bg-alt/5 dark:text-dark-text dark:hover:border-dark-border"
                      >
                        <span className="flex-initial max-w-full">{text}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) removeOption(value);
                          }}
                          disabled={disabled}
                          className="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400 disabled:cursor-not-allowed"
                          aria-label={`Remove ${text}`}
                        >
                          <svg
                            className="fill-current"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full p-1 pr-2 text-sm text-light-text/30 dark:text-dark-text/30 pointer-events-none">
                    {placeholder}
                  </div>
                )}
              </div>
              <div className="flex items-center self-start py-1 pl-1 pr-1 w-7">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                  disabled={disabled}
                  className="w-5 h-5 text-gray-700 outline-hidden cursor-pointer focus:outline-hidden dark:text-gray-400 disabled:cursor-not-allowed"
                >
                  <svg
                    className={`stroke-current transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* menu inline (padrão) */}
          {isOpen && !usePortal && menu}
        </div>
      </div>

      {/* menu em portal (opcional) */}
      {usePortal && portalMenu}
    </div>
  );
};

export default MultiSelect;