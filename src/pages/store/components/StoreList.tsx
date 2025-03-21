import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { deleteStoreApi, getStoreApi } from '../../../api/modules';
import { useModal } from '../../../hooks/useModal';
import Button from '../../../components/ui/button/Button';
import { MoreDotIcon, PlusIcon } from '../../../icons';
import { Dropdown } from '../../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../../components/ui/dropdown/DropdownItem';
import { Modal } from '../../../components/ui/modal';
import {
  uploadFileApi,
  uploadMultipleFilesApi,
} from '../../../api/modules/upload';
import Alert from '../../../components/ui/alert/Alert';
import { formatDate } from '../../../common/utils/dateUtils';
import { IStore } from '../models/store.interface';
import StoreDetail from './StoreDetail';
import BasePagination from '../../../components/pagination/BasePagination';
import Select from '../../../components/form/Select';
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from '../../../api/modules/address';
import { IDistrict, IProvince } from '../models/location.interface';
import InputMultipleUpload from '../../../components/form/input/InputMultipleUpload';

export default function StoreList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stores, setStore] = useState<IStore[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [toast, setToast] = useState('');
  const [newstore, setNewstore] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detailSelected, setDetailSelected] = useState<IStore | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistrict] = useState<IProvince[]>([]);
  const [wards, setWards] = useState<IProvince[]>([]);
  const [provinceSelected, setProvinceSelected] = useState<string | null>(null);
  const [districtSelected, setDistrictSelected] = useState<string | null>(null);
  const [wardSelected, setWardSelected] = useState<string | null>(null);

  useEffect(() => {
    getStore();
    getProvince();
  }, []);

  const getStore = async () => {
    const storeReponse = await getStoreApi(currentPage);

    const { page, limit, totalDocs, totalPages, docs } = storeReponse;

    setCurrentPage(page);
    setStore(docs);
    setTotalDocs(totalDocs);
    setTotalPages(totalPages);
  };

  const getProvince = async () => {
    const provincesRes = await getProvinceApi();
    setProvinces(provincesRes);
  };

  const getDistrict = async (provinceCode: string) => {
    const districtRes = await getDistrictApi(provinceCode);
    setDistrict(districtRes.districts);
  };

  const getWard = async (districtCode: string) => {
    const wardRes = await getWardApi(districtCode);
    setWards(wardRes.wards);
  };

  const onAddstore = async () => {
    try {
      // if (!newstore || !selectedFiles) {
      //   setToast('Vui lòng nhập tên danh mục và chọn ảnh!');
      //   return;
      // }

      const uploadResponse = await uploadMultipleFilesApi(selectedFiles);
      console.log('uploadResponse: ', uploadResponse);

      // setToast('Thêm danh mục thành công!');
      // closeModal();
    } catch (error) {
      console.error('Create store error:', error);
    } finally {
      closeModal();
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const onDeleteStore = async (storeId: string) => {
    const deleteReponse = await deleteStoreApi(storeId);

    getStore();
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

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
                            closeDropdown();
                            // onDeleteStore(store._id);
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Chỉnh sửa
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            onDeleteStore(store._id);
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
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm cửa hàng
          </h5>
          <div className="mt-4">
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên cửa hàng
              </label>
              <input
                type="input"
                value={newstore}
                onChange={(e) => setNewstore(e.target.value)}
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Số điện thoại
              </label>
              <input
                type="input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Hình ảnh
              </label>

              <InputMultipleUpload
                selectedFiles={selectedFiles}
                onFilesSelect={setSelectedFiles}
              />
            </div>

            <div className="mb-3">
              <Select
                placeholder="Cửa hàng: Tỉnh / Thành phố"
                options={provinces.map((item) => ({
                  label: item.name,
                  value: item.code.toString(),
                }))}
                onChange={(value) => value && getDistrict(value)}
              />
            </div>

            <div className="mb-3">
              <Select
                placeholder="Cửa hàng: Quận / Huyện"
                options={districts.map((item) => ({
                  label: item.name,
                  value: item.code.toString(),
                }))}
                onChange={(value) => value && getWard(value)}
              />
            </div>

            <div className="mb-3">
              <Select
                placeholder="Cửa hàng: Xã / Phường"
                options={wards.map((item) => ({
                  label: item.name,
                  value: item.code.toString(),
                }))}
                onChange={(value) => setWardSelected(value)}
              />
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
              onClick={onAddstore}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </Modal>

      <StoreDetail
        isOpen={!!detailSelected}
        onClose={() => setDetailSelected(null)}
        store={detailSelected}
      />

      {toast && (
        <Alert
          isVisible={!!toast}
          variant={toast ? 'error' : 'success'}
          title={toast ? 'Thông tin danh mục không chính xác' : 'Thành công'}
          message={toast || 'Danh mục đã được thêm thành công!'}
        />
      )}
    </div>
  );
}
