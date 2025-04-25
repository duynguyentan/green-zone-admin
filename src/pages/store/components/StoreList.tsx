import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  createStoreApi,
  deleteStoreApi,
  editStoreApi,
  getStoreApi,
} from '../../../api/modules';
import { useModal } from '../../../hooks/useModal';
import Button from '../../../components/ui/button/Button';
import { MoreDotIcon, PlusIcon } from '../../../icons';
import { Dropdown } from '../../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../../components/ui/dropdown/DropdownItem';
import { Modal } from '../../../components/ui/modal';
import { uploadMultipleFilesApi } from '../../../api/modules/upload';
import Alert from '../../../components/ui/alert/Alert';
import { formatDate } from '../../../common/utils/dateUtils';
import { IStore } from '../models/store.interface';
import StoreDetail from './StoreDetail';
import BasePagination from '../../../components/pagination/BasePagination';
import { getLatLongApi, searchAddressApi } from '../../../api/modules/address';
import InputMultipleUpload from '../../../components/form/input/InputMultipleUpload';
import { appSettings } from '../../../api/axios/config';
import SearchResultInput from '../../../components/form/input/SearchResultInput';

export default function StoreList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stores, setStore] = useState<IStore[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailSelected, setDetailSelected] = useState<IStore | null>(null);

  const {
    isOpen: isModalAddOpen,
    openModal: openModalAdd,
    closeModal: closeModalAdd,
  } = useModal();

  const {
    isOpen: isModalEditOpen,
    openModal: openModalEdit,
    closeModal: closeModalEdit,
  } = useModal();

  const {
    isOpen: isModalDeleteOpen,
    openModal: openModalDelete,
    closeModal: closeModalDelete,
  } = useModal();

  const [toastSucess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  const [search, setSearch] = useState('');
  const [addressesResult, setAddressesResult] = useState<
    { description: string; place_id: string }[]
  >([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const defaultFormData = {
    name: '',
    phoneNumber: '',
    selectedFiles: [] as File[],
    address: {
      description: '',
      place_id: '',
    },
    openTime: '',
    closeTime: '',
  };
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    getListStore();
  }, []);

  useEffect(() => {
    if (search) onSearchAddress();
  }, [search]);

  const onSearchAddress = async () => {
    const addressRes = await searchAddressApi(search);
    setAddressesResult(addressRes.predictions);
  };

  const getListStore = async () => {
    const storeReponse = await getStoreApi(currentPage);

    const { page, totalDocs, totalPages, docs } = storeReponse;

    setCurrentPage(page);
    setStore(docs);
    setTotalDocs(totalDocs);
    setTotalPages(totalPages);
  };

  const onAddStore = async () => {
    const { name, phoneNumber, selectedFiles, address, openTime, closeTime } =
      formData;

    try {
      if (!name || !phoneNumber || !address.place_id) {
        setToastError('Thông tin sản phẩm chưa đầy đủ');
        return;
      }

      const uploadResponse = await uploadMultipleFilesApi(selectedFiles);
      if (!uploadResponse || !uploadResponse.urls.length) {
        setToastError('Tải ảnh lên thất bại');
        return;
      }

      const imagesUrls = uploadResponse.urls.map(
        (url) => appSettings.BASE_API_URL + url
      );
      const { result } = await getLatLongApi(address?.place_id);

      await createStoreApi({
        name,
        phoneNumber,
        images: imagesUrls,
        address: address.description,
        latitude: result.geometry.location.lat.toString(),
        longitude: result.geometry.location.lng.toString(),
        openTime,
        closeTime,
      });

      getListStore();
      setToastSuccess('Thêm cửa hàng thành công!');
      closeModalAdd();
    } catch (error) {
      console.error('Create store error:', error);
    }
  };

  const onEditStore = async () => {
    if (!selectedId) return;

    const { name, phoneNumber, selectedFiles, address, openTime, closeTime } =
      formData;

    try {
      if (!name || !phoneNumber || !address.place_id) {
        setToastError('Thông tin sản phẩm chưa đầy đủ');
        return;
      }

      const uploadResponse = await uploadMultipleFilesApi(selectedFiles);
      if (!uploadResponse || !uploadResponse.urls.length) {
        setToastError('Tải ảnh lên thất bại');
        return;
      }

      const imagesUrls = uploadResponse.urls.map(
        (url) => appSettings.BASE_API_URL + url
      );
      const { result } = await getLatLongApi(address?.place_id);

      await editStoreApi(selectedId, {
        name,
        phoneNumber,
        images: imagesUrls,
        address: address.description,
        latitude: result.geometry.location.lat.toString(),
        longitude: result.geometry.location.lng.toString(),
        openTime,
        closeTime,
      });

      getListStore();
      setToastSuccess('Chỉnh sửa thông cửa hàng thành công!');
      closeModalEdit();
      setSelectedId(null);
    } catch (error) {
      console.error('Create store error:', error);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const onDeleteStore = async () => {
    if (!selectedId) return;

    try {
      await deleteStoreApi(selectedId);

      setToastSuccess('Xóa cửa hàng thành công!');
      getListStore();
      closeModalDelete();
      setSelectedId(null);
    } catch (error) {
      console.error('Delete store error:', error);
      setToastError('Xóa cửa hàng thất bại, vui lòng thử lại!');
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
        onClick={openModalAdd}
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
                  Tên cửa hàng
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
                  Số điện thoại
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Địa chỉ
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
              {stores?.map((store) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setDetailSelected(store)}
                  key={store._id}
                >
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {store.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 flex justify-center text-theme-sm dark:text-gray-400">
                    <img
                      src={store.images[0]}
                      alt={store.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {store.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {store.specificAddress}
                    <br />
                    {store.ward} - {store.district} - {store.province}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(store.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <div className="relative inline-block">
                      <button
                        className="dropdown-toggle"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleDropdown(store._id);
                        }}
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                      </button>
                      <Dropdown
                        isOpen={openMenuId === store._id}
                        onClose={closeDropdown}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            setFormData({
                              name: store.name,
                              phoneNumber: store.phoneNumber,
                              selectedFiles: [],
                              address: {
                                description: store.specificAddress,
                                place_id: '',
                              },
                              openTime: store.openTime,
                              closeTime: store.closeTime,
                            });

                            setSelectedId(store._id);
                            openModalEdit();
                            closeDropdown();
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Chỉnh sửa
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            setSelectedId(store._id);
                            openModalDelete();
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
        isOpen={isModalAddOpen}
        onClose={closeModalAdd}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm cửa hàng
          </h5>
          <div className="mt-4">
            <div className="mb-3">
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <SearchResultInput
                  placeholder="Nhập địa chỉ"
                  onSearch={setSearch}
                  results={addressesResult}
                  onSelect={(placeId: string, description: string) => {
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        description,
                        place_id: placeId,
                      },
                    });
                  }}
                />
              </div>

              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên cửa hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="input"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Hình ảnh sản phẩm <span className="text-red-500">*</span>
              </label>

              <InputMultipleUpload
                selectedFiles={formData.selectedFiles}
                onFilesSelect={(files: File[]) =>
                  setFormData({ ...formData, selectedFiles: files })
                }
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Thời gian mở / đóng cửa (hh:mm:ss AM/PM)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  step="1"
                  value={formData.openTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openTime: e.target.value })
                  }
                  placeholder="hh:mm:ss AM/PM"
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
                <input
                  type="time"
                  step="1"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closeTime: e.target.value })
                  }
                  placeholder="hh:mm:ss AM/PM"
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModalAdd}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onAddStore}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalEditOpen}
        onClose={closeModalEdit}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Chỉnh sửa cửa hàng
          </h5>
          <div className="mt-4">
            <div className="mb-3">
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <SearchResultInput
                  placeholder="Nhập địa chỉ"
                  onSearch={setSearch}
                  results={addressesResult}
                  onSelect={(placeId: string, description: string) => {
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        description,
                        place_id: placeId,
                      },
                    });
                  }}
                />
              </div>

              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên cửa hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="input"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Hình ảnh sản phẩm <span className="text-red-500">*</span>
              </label>

              <InputMultipleUpload
                selectedFiles={formData.selectedFiles}
                onFilesSelect={(files: File[]) =>
                  setFormData({ ...formData, selectedFiles: files })
                }
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Thời gian mở / đóng cửa (hh:mm:ss AM/PM)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  step="1"
                  value={formData.openTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openTime: e.target.value })
                  }
                  placeholder="hh:mm:ss AM/PM"
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
                <input
                  type="time"
                  step="1"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closeTime: e.target.value })
                  }
                  placeholder="hh:mm:ss AM/PM"
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModalEdit}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onEditStore}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalDeleteOpen}
        onClose={closeModalDelete}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Bạn có chắc chắn muốn xóa không?
          </h5>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModalDelete}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onDeleteStore}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-success-600 sm:w-auto"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>

      <StoreDetail
        isOpen={!!detailSelected}
        onClose={() => setDetailSelected(null)}
        store={detailSelected}
      />

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
