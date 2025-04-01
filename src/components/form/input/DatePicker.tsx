import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import { CalenderIcon, XIcon } from '../../../icons';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  options?: Record<string, any>;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Chọn ngày',
  options = {},
}) => {
  const [selectedDate, setSelectedDate] = useState(value);

  const handleDateChange = (selectedDates: Date[]) => {
    const formattedDate = selectedDates[0]?.toLocaleDateString('en-CA') || '';
    
    setSelectedDate(formattedDate);
    onChange(formattedDate);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Chặn sự kiện click mở Flatpickr
    setSelectedDate('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <Flatpickr
        value={selectedDate}
        onChange={handleDateChange}
        options={{ dateFormat: 'Y-m-d', ...options }}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs 
          placeholder:text-gray-500 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 
          dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 
          focus:border-success-300 focus:ring-success-500/20 dark:border-gray-700 dark:focus:border-success-800"
      />

      {selectedDate ? (
        <button
          onClick={handleClearDate}
          className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 dark:text-gray-400"
        >
          <XIcon className="size-6" />
        </button>
      ) : (
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      )}
    </div>
  );
};

export default DatePicker;
