import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  createEmployeeApi,
  getEmployeeApi,
  getStoreApi,
  updateEmployeeApi,
  updateEmployeePasswordApi,
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
import { formatDate } from '../../../common/utils/dateUtils';
import BasePagination from '../../../components/pagination/BasePagination';
import { IEmployee } from '../models/employee.interface';
import EmployeeDetail from './EmployeeDetail';
import Select from '../../../components/form/Select';
import { IStore } from '../../store/models/store.interface';
import { appSettings } from '../../../api/axios/config';
import SearchInput from '../../../components/form/input/SearchInput';

export default function EmployeeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [stores, setStore] = useState<IStore[]>([]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailSelected, setDetailSelected] = useState<IEmployee | null>(null);

  const [search, setSearch] = useState<string>('');
  const [storeFilter, setStoreFilter] = useState<string | null>(null);

  const {
    isOpen: isModal1Open,
    openModal: openModal1,
    closeModal: closeModal1,
  } = useModal();
  const {
    isOpen: isModal2Open,
    openModal: openModal2,
    closeModal: closeModal2,
  } = useModal();

  const {
    isOpen: isModal3Open,
    openModal: openModal3,
    closeModal: closeModal3,
  } = useModal();

  const [toastSucess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    selectedFile: null as File | null,
    workingStore: '',
  });

  const [phoneUpdatePassword, setPhoneUpdatePassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    getStore();
  }, []);

  useEffect(() => {
    getEmployee();
  }, [currentPage, storeFilter, search]);

  const getEmployee = async () => {
    const employeeReponse = await getEmployeeApi(
      currentPage,
      storeFilter,
      search
    );

    const { page, totalDocs, totalPages, docs } = employeeReponse;

    setCurrentPage(page);
    setEmployees(docs);
    setTotalDocs(totalDocs);
    setTotalPages(totalPages);
  };

  const getStore = async () => {
    const storeReponse = await getStoreApi(currentPage);

    const { docs } = storeReponse;

    setStore(docs);
  };

  const onAddEmployee = async () => {
    try {
      const { phoneNumber, firstName, lastName, selectedFile, workingStore } =
        formData;

      if (
        !phoneNumber ||
        !firstName ||
        !lastName ||
        !selectedFile ||
        !workingStore
      ) {
        setToastError('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      const fileResponse = await uploadFileApi(selectedFile);

      if (!fileResponse?.url) {
        setToastError('Vui lòng chọn ảnh đại diện!');

        return;
      }

      await createEmployeeApi({
        phoneNumber,
        firstName,
        lastName,
        avatar: appSettings.BASE_API_URL + fileResponse.url,
        workingStore,
      });

      setToastSuccess('Thêm nhân viên thành công!');
      getEmployee();
      closeModal1();
    } catch (error) {
      setToastError('Thêm nhân viên thất bại, vui lòng thử lại!');
      console.error('Create Employee error:', error);
    }
  };

  const onEditEmployee = async () => {
    if (!selectedId) return;

    try {
      const { phoneNumber, firstName, lastName, selectedFile, workingStore } =
        formData;

      if (!phoneNumber || !firstName || !lastName || !workingStore) {
        setToastError('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      let avatarUrl: string | undefined = undefined;

      if (selectedFile) {
        const fileResponse = await uploadFileApi(selectedFile);

        if (!fileResponse?.url) {
          setToastError('Vui lòng chọn ảnh đại diện!');
          return;
        }

        avatarUrl = appSettings.BASE_API_URL + fileResponse.url;
      }

      const payload: any = {
        phoneNumber,
        firstName,
        lastName,
        workingStore,
      };

      if (avatarUrl) {
        payload.avatar = avatarUrl;
      }

      await updateEmployeeApi(selectedId, payload);

      setToastSuccess('Cập nhật thông tin nhân viên thành công!');
      getEmployee();
      closeModal3();
    } catch (error) {
      setToastError('Chỉnh sửa nhân viên thất bại, vui lòng thử lại!');
      console.error('Edit Employee error:', error);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const onUpdatePassword = async () => {
    try {
      await updateEmployeePasswordApi(phoneUpdatePassword, newPassword);

      setToastSuccess('Cập nhật mật khẩu thành công');
      closeModal2();
    } catch (error) {
      setToastError('Cập nhật mật khẩu thất bại, vui lòng thử lại!');
      console.log('update password error: ', error);
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
        onClick={() => {
          setFormData({
            phoneNumber: '',
            firstName: '',
            lastName: '',
            selectedFile: null,
            workingStore: '',
          });

          openModal1();
        }}
        className="mb-4"
        size="sm"
        variant="primary"
        endIcon={<PlusIcon />}
      >
        Thêm mới
      </Button>

      <div className="mb-4 grid grid-cols-2 gap-10">
        <SearchInput
          placeholder="Nhập tên, số điện thoại, chi nhánh làm việc ..."
          onSearch={(value) => setSearch(value)}
        />
        <Select
          placeholder="Lọc cửa hàng: Tất cả"
          options={stores.map((item) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(value) => setStoreFilter(value)}
        />
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
                  Tên nhân viên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Ảnh
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
                  Chi nhánh làm việc
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
              {employees?.map((employee) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setDetailSelected(employee)}
                  key={employee._id}
                >
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 flex justify-center text-theme-sm dark:text-gray-400">
                    <img
                      src={employee?.avatar || ''}
                      alt={employee?.avatar}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {employee.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {employee.workingStore.name} <br />
                    {employee.workingStore.address}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(employee.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <div className="relative inline-block">
                      <button
                        className="dropdown-toggle"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleDropdown(employee._id);
                        }}
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                      </button>
                      <Dropdown
                        isOpen={openMenuId === employee._id}
                        onClose={closeDropdown}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            setFormData({
                              phoneNumber: employee.phoneNumber,
                              firstName: employee.firstName || '',
                              lastName: employee.lastName || '',
                              selectedFile: null,
                              workingStore: employee.workingStore._id,
                            });

                            setSelectedId(employee._id);
                            openModal3();
                            closeDropdown();
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Chỉnh sửa
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            setPhoneUpdatePassword(employee.phoneNumber);
                            openModal2();
                            closeDropdown();
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Cập nhật mật khẩu
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
        isOpen={isModal1Open}
        onClose={closeModal1}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm nhân viên
          </h5>
          <div className="mt-8">
            <div className="mb-1.5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Số điện thoại
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
            <div className="grid grid-cols-2 gap-3 mb-1.5">
              <div>
                <label className=" block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Họ
                </label>
                <input
                  type="input"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tên
                </label>
                <input
                  type="input"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ảnh đại diện
              </label>
              <InputUpload
                selectedFile={formData.selectedFile}
                onFileSelect={(file) =>
                  setFormData({ ...formData, selectedFile: file })
                }
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Chi nhánh làm việc
              </label>
              <Select
                placeholder="Cửa hàng: Tất cả"
                options={stores.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                onChange={(value) =>
                  setFormData({ ...formData, workingStore: value || '' })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal1}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onAddEmployee}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModal2Open}
        onClose={closeModal2}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Chỉnh sửa mật khẩu đăng nhập
          </h5>
          <div className="mt-8">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Mật khẩu mới
            </label>
            <input
              type="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
            />
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal2}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onUpdatePassword}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModal3Open}
        onClose={closeModal3}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Cập nhật thông tin nhân viên
          </h5>
          <div className="mt-8">
            <div className="mb-1.5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Số điện thoại
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
            <div className="grid grid-cols-2 gap-3 mb-1.5">
              <div>
                <label className=" block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Họ
                </label>
                <input
                  type="input"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tên
                </label>
                <input
                  type="input"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ảnh đại diện
              </label>
              <InputUpload
                selectedFile={formData.selectedFile}
                onFileSelect={(file) =>
                  setFormData({ ...formData, selectedFile: file })
                }
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Chi nhánh làm việc
              </label>
              <Select
                defaultValue={formData.workingStore}
                placeholder="Cửa hàng: Tất cả"
                options={stores.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                onChange={(value) =>
                  setFormData({ ...formData, workingStore: value || '' })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal3}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onEditEmployee();
              }}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </Modal>

      <EmployeeDetail
        isOpen={!!detailSelected}
        onClose={() => setDetailSelected(null)}
        employee={detailSelected}
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
