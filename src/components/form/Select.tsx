import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../../icons';

interface Option {
  value: string | null;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string | null) => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  defaultValue = null,
}) => {
  const allOption = { _id: 'all', label: 'Tất cả', value: null };
  const finalOptions = [allOption, ...options];

  const [selectedValue, setSelectedValue] = useState<string | null>(
    defaultValue
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || null;
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false); // Đóng dropdown khi chọn
  };

  return (
    <div className="relative w-full">
      <select
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-500 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800 ${
          selectedValue
            ? 'text-gray-800 dark:text-white/90'
            : 'text-gray-500 dark:text-gray-500'
        } ${className}`}
        value={selectedValue ?? ''}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-500"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {finalOptions.map((option) => (
          <option
            key={option.value}
            value={option.value ?? ''}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-500"
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Chevron Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>
    </div>
  );
};

export default Select;
