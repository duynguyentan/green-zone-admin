import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { useModal } from '../../../hooks/useModal';
import Button from '../../../components/ui/button/Button';
import { MoreDotIcon, PlusIcon } from '../../../icons';
import { Dropdown } from '../../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../../components/ui/dropdown/DropdownItem';
import { Modal } from '../../../components/ui/modal';
import { uploadFileApi } from '../../../api/modules/upload';
import Alert from '../../../components/ui/alert/Alert';
import { formatDate } from '../../../common/utils/dateUtils';
import BasePagination from '../../../components/pagination/BasePagination';
import { IProduct, ITopping } from '../models/product.interface';
import {
  addToppingApi,
  createProductApi,
  createVariantApi,
  deleteProductApi,
  getAllProductApi,
  getCategoryApi,
  getToppingApi,
} from '../../../api/modules';
import ProductDetail from './ProductDetail';
import { toVNDFormat } from '../../../common/utils/money';
import InputUpload from '../../../components/form/input/InputUpload';
import Select from '../../../components/form/Select';
import { ICategory } from '../../category/models/category.interface';
import SearchInput from '../../../components/form/input/SearchInput';
import TextArea from '../../../components/form/input/TextArea';
import MultiSelect from '../../../components/form/MultiSelect';
import { appSettings } from '../../../api/axios/config';
import VariantInput from './VariantInput';

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [toppings, setToppings] = useState<ITopping[]>([]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [toastSucess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  const [search, setSearch] = useState<string>('');
  const [detailSelected, setDetailSelected] = useState<string | null>(null);
  const [categorySelected, setCategorySelected] = useState<string | null>(null);

  const [newProductName, setNewProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [variants, setVariants] = useState<
    { size: string; sellingPrice: number }[]
  >([]);
  const [toppingIds, setToppingIds] = useState<string[]>([]);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getProduct();
  }, [currentPage, categorySelected, search]);

  const getCategory = async () => {
    const categoryReponse = await getCategoryApi(1);
    const toppingReponse = await getToppingApi();

    const { docs } = categoryReponse;

    setCategories(docs);
    setToppings(toppingReponse);
  };

  const getProduct = async () => {
    const productReponse = await getAllProductApi(
      currentPage,
      null,
      search,
      categorySelected
    );

    const { page, totalDocs, totalPages, docs } = productReponse;

    setCurrentPage(page);
    setProducts(docs);
    setTotalDocs(totalDocs);
    setTotalPages(totalPages);
  };

  const onAddproduct = async () => {
    try {
      if (!newProductName || !selectedFile || !categoryIds.length) {
        setToastError('Thông tin sản phẩm chưa đầy đủ');
        return;
      }

      const uploadResponse = await uploadFileApi(selectedFile);
      if (!uploadResponse || !uploadResponse.url) {
        setToastError('Tải ảnh lên thất bại');
        return;
      }

      const newProductRes = await createProductApi({
        name: newProductName,
        description: productDesc,
        image: appSettings.BASE_API_URL + uploadResponse.url,
        categoryIds,
      });

      if (!newProductRes || !newProductRes._id) {
        setToastError('Tạo sản phẩm thất bại');
        return;
      }

      await Promise.all(
        variants.map((variant) => createVariantApi(newProductRes._id, variant))
      );

      if (toppingIds.length) {
        await addToppingApi(newProductRes._id, toppingIds);
      }

      setToastSuccess('Thêm sản phẩm thành công!');
      await getProduct();
      closeModal();
    } catch (error) {
      console.error('Create product error:', error);
      setToastError('Đã có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const onDeleteProduct = async (productId: string) => {
    try {
      const confirmDelete = window.confirm(
        'Bạn có chắc chắn muốn xóa sản phẩm này?'
      );
      if (!confirmDelete) return;

      await deleteProductApi(productId);

      setToastSuccess('Xóa sản phẩm thành công!');
      await getProduct();
    } catch (error) {
      console.error('Delete product error:', error);
      setToastError('Xóa sản phẩm thất bại, vui lòng thử lại!');
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

      <div className="mb-4 grid grid-cols-2 gap-10">
        <SearchInput
          placeholder="Nhập tên sản phẩm..."
          onSearch={(value) => setSearch(value)}
        />
        <div className="w-full me-10">
          <Select
            placeholder="Lọc danh mục: Tất cả"
            options={categories.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
            onChange={(value) => setCategorySelected(value)}
          />
        </div>
      </div>

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
                  Tên sản phẩm
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Hình ảnh
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Giá bán
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Thời gian tạo
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Thời gian cập nhật
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products?.map((product) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setDetailSelected(product._id)}
                  key={product._id}
                >
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {product.name}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 flex justify-center text-theme-sm dark:text-gray-400">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {toVNDFormat(product?.sellingPrice || '') ??
                      'Chưa có biến thể'}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(product.createdAt)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(product.updatedAt)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <div className="relative inline-block">
                      <button
                        className="dropdown-toggle"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleDropdown(product._id);
                        }}
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                      </button>
                      <Dropdown
                        isOpen={openMenuId === product._id}
                        onClose={closeDropdown}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            closeDropdown();
                            // onDeleteProduct(product._id);
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Chỉnh sửa
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            onDeleteProduct(product._id);
                            closeDropdown();
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
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-146">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm sản phẩm
          </h5>
          <div className="mt-4">
            <div className="mb-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên sản phẩm
              </label>
              <input
                type="input"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>

            <div className="mb-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Mô tả
              </label>
              <TextArea
                rows={3}
                value={productDesc}
                error
                onChange={(value) => setProductDesc(value)}
              />
            </div>

            <div className="mb-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ảnh
              </label>
              <InputUpload
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            </div>

            <div className="mb-2">
              <MultiSelect
                label="Danh mục"
                options={categories.map((item) => ({
                  text: item.name,
                  value: item._id,
                }))}
                onChange={(values) => setCategoryIds(values)}
              />
            </div>

            <div className="mb-2">
              <MultiSelect
                label="Topping"
                options={toppings.map((item) => ({
                  text: item.name,
                  value: item._id,
                }))}
                onChange={(values) => setToppingIds(values)}
              />
            </div>

            <div className="mb-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Size
              </label>
              <VariantInput setVariant={setVariants} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onAddproduct}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </Modal>

      <ProductDetail
        isOpen={!!detailSelected}
        onClose={() => setDetailSelected(null)}
        productId={detailSelected}
      />

      {toastSucess && (
        <Alert
          isVisible={!!toastSucess}
          variant={'success'}
          title={'Thành công'}
          message={toastSucess || 'Sản phẩm đã được thêm thành công!'}
        />
      )}

      {toastError && (
        <Alert
          isVisible={!!toastError}
          variant={'error'}
          title={'Thất bại'}
          message={toastError || 'Thêm sản phẩm thất bại!'}
        />
      )}
    </div>
  );
}
