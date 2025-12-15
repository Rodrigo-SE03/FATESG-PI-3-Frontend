import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode; // Button text or content
  size?: "sm" | "md" | "none"; // Button size
  variant?: "primary" | "outline" | "icon" | "none"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: "submit" | "button"
  customPadding?: string; // Custom padding class
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  customPadding,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
    none: "",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "primary-button-colors rounded-lg shadow-theme-xs disabled:bg-brand-300",
    outline:
      "outline-button-colors",
    icon:
      "bg-transparent text-light-text rounded-lg dark:text-dark-text hover:text-light-text/80 dark:hover:text-dark-text/80",
    none:
      "",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition ${className} ${
        customPadding ? customPadding : sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
