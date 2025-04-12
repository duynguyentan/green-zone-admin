import { useCallback } from 'react';
import { UploadIcon } from '../../../icons';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {}

const DropzoneComponent: React.FC<DropzoneProps> = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    // Handle file uploads here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': [],
      'image/svg+xml': [],
    },
  });

  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-success-500 dark:border-gray-700 rounded-xl hover:border-success-500">
      <div
        {...getRootProps()}
        className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? 'border-success-500 bg-gray-100 dark:bg-gray-800'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }
      `}
        id="demo-upload"
      >
        {/* Hidden Input */}
        <input {...getInputProps()} />

        <div className="dz-message flex flex-col items-center m-0!">
          {/* Icon Container */}
          <div className="mb-[22px] flex justify-center">
            <div className="flex h-[45px] w-[45px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <UploadIcon />
            </div>
          </div>

          {/* Text Content */}
          <h4 className="mb-3 font-semibold text-gray-800 text-theme-sm dark:text-white/90">
            {isDragActive ? 'Thả Tập Tin Vào Đây' : 'Kéo & Thả Tập Tin Vào Đây'}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default DropzoneComponent;
