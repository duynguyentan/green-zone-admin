import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { UploadIcon, XIcon } from '../../../icons';

interface InputUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

function InputUpload({ selectedFile, onFileSelect }: InputUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Chỉ hỗ trợ ảnh PNG hoặc JPEG.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File quá lớn! Vui lòng chọn ảnh dưới 2MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div
      className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-success-500 dark:border-gray-700 rounded-xl hover:border-success-500 block"
      onClick={() => fileInputRef.current?.click()}
      role="button"
      aria-label="Upload file"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="rounded-xl border-dashed border-gray-300 p-2 lg:p-5 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 flex flex-col items-center">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mb-2 w-16 h-16 object-cover rounded-lg"
            />
            <button
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full shadow-md"
              aria-label="Remove file"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="mb-[8px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <UploadIcon />
          </div>
        )}
        <h4 className="font-semibold text-gray-800 text-xs dark:text-white/90">
          {selectedFile ? selectedFile.name : 'Nhấn để chọn tập tin'}
        </h4>
      </div>
    </div>
  );
}

export default InputUpload;
