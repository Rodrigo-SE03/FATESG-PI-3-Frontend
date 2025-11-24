import { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  required?: boolean;

  // 👇 nova
  value?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  required = false,
  value,
}) => {
  // se vier "value", a gente respeita; senão usa o interno
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  // quando defaultValue mudar, atualiza o interno (só pra caso não-controlado)
  useEffect(() => {
    if (value === undefined) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (value === undefined) {
      // não-controlado
      setSelectedValue(v);
    }
    onChange(v);
  };

  const currentValue = value !== undefined ? value : selectedValue;

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-light-border bg-light-bg-alt dark:bg-dark-bg-alt px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-dark-border dark:text-dark-text dark:placeholder:text-dark-text/30 dark:focus:border-brand-800 ${
        currentValue
          ? "text-light-text dark:text-dark-text"
          : "text-light-text/50 dark:text-dark-text/50"
      } ${className}`}
      value={currentValue}
      onChange={handleChange}
      required={required}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;