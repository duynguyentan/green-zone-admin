import { useEffect, useRef, useState } from 'react';

interface SearchResultInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  results: { description: string; place_id: string }[]; // Nhận danh sách từ cha
  onSelect: (placeId: string, description: string) => void; // Callback khi chọn địa chỉ
  delay?: number;
}

const SearchResultInput: React.FC<SearchResultInputProps> = ({
  placeholder = 'Search...',
  onSearch,
  results,
  onSelect,
  delay = 800,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query) setIsOpen(false);

    if (query !== debouncedQuery) {
      const handler = setTimeout(() => {
        setDebouncedQuery(query);
      }, delay);
      return () => clearTimeout(handler);
    }
  }, [query, delay]);

  useEffect(() => {
    onSearch(debouncedQuery); // Gửi query lên cha để gọi API
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    if (!results?.length) return;

    setIsOpen(query.length > 0 && results.length > 0);
  }, [results]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (placeId: string, description: string) => {
    setQuery(description); // Cập nhật input nhưng không ảnh hưởng debounce
    setIsOpen(false);
    onSelect(placeId, description);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-11 w-full appearance-none focus-visible:outline-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-500 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
      />
      {isOpen && results?.length && (
        <ul className="absolute left-0 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {results?.map((item) => (
            <li
              key={item.place_id}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-green-100 dark:text-white dark:hover:bg-green-700"
              onClick={() => handleSelect(item.place_id, item.description)}
            >
              {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultInput;
