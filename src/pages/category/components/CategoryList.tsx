import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoryApi,
} from '../../../api/modules';
import { useModal } from '../../../hooks/useModal';
import Button from '../../../components/ui/button/Button';
import { MoreDotIcon, PlusIcon } from '../../../icons';
import { Dropdown } from '../../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../../components/ui/dropdown/DropdownItem';
import { Modal } from '../../../components/ui/modal';
import InputUpload from '../../../components/form/input/InputUpload';
import { uploadFileApi } from '../../../api/modules/upload';
import Alert from '../../../components/ui/alert/Alert';
import BasePagination from '../../../components/pagination/BasePagination';
import { formatDate } from '../../../common/utils/dateUtils';
import { appSettings } from '../../../api/axios/config';
import { ICategory } from '../models/category.interface';

export default function CategoryList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [toastSucess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  const [newCategory, setNewCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    getCategory();
  }, []);

  const toggleDropdown = (cateId: string) => {
    setOpenMenuId((prev) => (prev === cateId ? null : cateId));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const getCategory = async () => {
    const categoryReponse = await getCategoryApi(currentPage);

    const { page, totalDocs, totalPages, docs } = categoryReponse;

    setCurrentPage(page);
    setTotalDocs(totalDocs);
    setTotalPages(totalPages);
    setCategories(docs);
  };

  useEffect(() => {
    getCategory();
  }, [currentPage]);

  const onAddCategory = async () => {
    try {
      if (!newCategory || !selectedFile) {
        setToastError('Vui lòng nhập tên danh mục và chọn ảnh!');
        return;
      }

      const uploadResponse = await uploadFileApi(selectedFile);
      const iconUrl = uploadResponse?.url;

      if (!iconUrl) {
        setToastError('Lỗi khi tải ảnh lên, vui lòng thử lại!');
        return;
      }

      await createCategoryApi(
        newCategory,
        `${appSettings.BASE_API_URL}${iconUrl}`
      );

      setToastSuccess('Thêm danh mục thành công!');
      await getCategory();
      closeModal();
    } catch (error) {
      console.error('Create category error:', error);
      setToastError('Thêm danh mục thất bại, vui lòng thử lại!');
    }
  };

  const onDeleteCategory = async (categoryId: string) => {
    try {
      const confirmDelete = window.confirm(
        'Bạn có chắc chắn muốn xóa danh mục này?'
      );
      if (!confirmDelete) return;

      await deleteCategoryApi(categoryId);

      setToastSuccess('Xóa danh mục thành công!');
      await getCategory();
      setToastSuccess('');
      setToastError('');
      closeModal();
    } catch (error) {
      console.error('Delete category error:', error);
      setToastError('Xóa danh mục thất bại, vui lòng thử lại!');
    }
  };

  useEffect(() => {
    if (toastSucess || toastError) {
      const timer = setTimeout(() => {
        setToastSuccess('');
        setToastError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastSucess, toastError]);

  return (
    <div>
      <Button
        onClick={openModal}
        className="mb-4"
        size="sm"
        variant="primary"
        endIcon={<PlusIcon />}
      >
        Thêm mới
      </Button>

      <div className="overflow-hidden rounded-t-xl border-t border-x border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Icon
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Thời gian cập nhật
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Thời gian tạo
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {categories?.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {category.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 flex justify-center text-theme-sm dark:text-gray-400">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(category.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(category.updatedAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <div className="relative inline-block">
                      <button
                        className="dropdown-toggle"
                        onClick={() => toggleDropdown(category._id)}
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                      </button>
                      <Dropdown
                        isOpen={openMenuId === category._id}
                        onClose={closeDropdown}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onItemClick={() => {
                            closeDropdown();
                            // onDeleteCategory(category._id);
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Chỉnh sửa
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={() => {
                            closeDropdown();
                            onDeleteCategory(category._id);
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Xóa
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginations */}

      <BasePagination
        page={currentPage}
        totalDocs={totalDocs}
        totalPages={totalPages}
        onPageChange={(page: number) => {
          setCurrentPage(page);
        }}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm danh mục
          </h5>
          <div className="mt-8">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400">
                Tên danh mục
              </label>
              <input
                type="input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400">
                Icon
              </label>
              <InputUpload
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onAddCategory}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-success-600 sm:w-auto"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </Modal>

      {toastSucess && (
        <Alert
          isVisible={!!toastSucess}
          variant={'success'}
          title={'Thành công'}
          message={toastSucess || 'Thêm thành công!'}
        />
      )}

      {toastError && (
        <Alert
          isVisible={!!toastError}
          variant={'error'}
          title={'Thất bại'}
          message={toastError || 'Thêm thất bại!'}
        />
      )}
    </div>
  );
}
