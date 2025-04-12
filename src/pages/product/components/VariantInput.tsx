import { useState, useEffect } from 'react';
import { PlusIcon, TrashBinIcon } from '../../../icons';

interface Variant {
  id: number;
  name: string;
  price: string;
}

export default function VariantInput({
  setVariant,
}: {
  setVariant: (variants: { size: string; sellingPrice: number }[]) => void;
}) {
  const [variants, setVariants] = useState<Variant[]>([
    { id: Date.now(), name: '', price: '' },
  ]);

  // Cập nhật state bên ngoài mỗi khi variants thay đổi
  useEffect(() => {
    setVariant(
      variants.map((v) => ({ size: v.name, sellingPrice: Number(v.price) }))
    );
  }, [variants, setVariant]);

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: '', price: '' }]);
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  const handleChange = (id: number, field: 'name' | 'price', value: string) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  return (
    <div className="space-y-3 w-full">
      {variants.map((variant) => (
        <div key={variant.id} className="flex gap-2 items-center">
          {/* Input Tên Size */}
          <input
            type="text"
            value={variant.name}
            onChange={(e) => handleChange(variant.id, 'name', e.target.value)}
            placeholder="Tên size"
            className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
          />

          {/* Input Giá */}
          <input
            type="number"
            value={variant.price}
            onChange={(e) => handleChange(variant.id, 'price', e.target.value)}
            placeholder="Giá"
            className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
          />

          {/* Button Xóa */}
          {variants.length > 1 && (
            <button
              onClick={() => removeVariant(variant.id)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <TrashBinIcon />
            </button>
          )}
        </div>
      ))}

      {/* Button Thêm */}
      <button
        onClick={addVariant}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-gray-700"
      >
        Thêm biến thể <PlusIcon />
      </button>
    </div>
  );
}
