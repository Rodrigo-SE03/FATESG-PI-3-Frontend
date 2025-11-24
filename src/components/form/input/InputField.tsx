import type React from "react";
import type { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
    // 👇 novos
  required?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  fullWidth?: boolean;            
  inputRef?: React.Ref<HTMLInputElement>;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyDown,
  autoFocus=false,
  className = "",
  min,
  max,
  maxLength,
  step,
  disabled = false,
  success = false,
  error = false,
  required = false,
  hint,
  style,
  fullWidth = true,
  inputRef,
  inputMode ="text"
}) => {
  const isDate = type === "date";
  let inputClasses =
    `h-11 ${fullWidth ? "w-full" : ""} rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-light-text/30 focus:outline-hidden focus:ring-3 dark:bg-dark-bg-alt dark:text-dark-text dark:placeholder:text-dark-text/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-light-text/80 border-light-border focus:border-brand-300 focus:ring-brand-500/20 dark:border-dark-border dark:text-dark-text/80  dark:focus:border-brand-800`;
  }

  if (!isDate) {
    inputClasses = `appearance-none ${inputClasses}`;
  }

  return (
    <div className="relative">
      <input
        inputMode={inputMode}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        maxLength={maxLength}
        step={step}
        disabled={disabled}
        className={`
          ${inputClasses}
          pr-10
          [&::-webkit-calendar-picker-indicator]:opacity-0
          [&::-webkit-calendar-picker-indicator]:absolute
          [&::-webkit-calendar-picker-indicator]:right-3
          [&::-webkit-calendar-picker-indicator]:h-full
          [&::-webkit-calendar-picker-indicator]:w-6
          [&::-webkit-calendar-picker-indicator]:cursor-pointer
        `}
        
        ref={inputRef}
        required={required}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        autoFocus={autoFocus}
        style={style} 
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
      {type === "date" && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {/* claro */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-gray-400 dark:hidden"
          >
            <path d="M8 3v2" />
            <path d="M16 3v2" />
            <path d="M4 9h16" />
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="M8 13h2" />
          </svg>

          {/* dark */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden h-4 w-4 text-white/70 dark:block"
          >
            <path d="M8 3v2" />
            <path d="M16 3v2" />
            <path d="M4 9h16" />
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="M8 13h2" />
          </svg>
        </span>
      )}

    </div>
  );
};

export default Input;
