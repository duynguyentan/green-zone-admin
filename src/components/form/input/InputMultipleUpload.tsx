import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { UploadIcon, XIcon } from '../../../icons';

interface InputMultipleUploadProps {
  selectedFiles: File[];
  onFilesSelect: (files: File[]) => void;
}

function InputMultipleUpload({
  selectedFiles,
  onFilesSelect,
}: InputMultipleUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(urls);

      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [selectedFiles]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const validFiles = files.filter(
      (file) =>
        ['image/png', 'image/jpeg'].includes(file.type) &&
        file.size <= 2 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      alert('Chỉ hỗ trợ ảnh PNG hoặc JPEG dưới 2MB.');
    }

    onFilesSelect([...selectedFiles, ...validFiles]);
  };

  const handleClear = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onFilesSelect(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div
      className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-success-500 dark:border-gray-700 rounded-xl hover:border-success-500 block"
      onClick={() => fileInputRef.current?.click()}
      role="button"
      aria-label="Upload files"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="rounded-xl border-dashed border-gray-300 p-4 lg:p-5 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 flex flex-col items-center">
        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => handleClear(index, e)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full shadow-md"
                  aria-label="Remove file"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-[8px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <UploadIcon />
          </div>
        )}
        <h4 className="font-semibold text-gray-800 text-xs dark:text-white/90">
          {selectedFiles.length > 0
            ? `${selectedFiles.length} tập tin đã chọn`
            : 'Chọn tập tin (có thể thêm nhiều)'}
        </h4>
      </div>
    </div>
  );
}

export default InputMultipleUpload;
