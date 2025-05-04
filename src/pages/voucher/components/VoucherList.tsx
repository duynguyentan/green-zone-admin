import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  createVoucherApi,
  deleteVoucherApi,
  getAllVoucherApi,
  updateVoucherApi,
  uploadFileApi,
} from '../../../api/modules';
import { useModal } from '../../../hooks/useModal';
import Button from '../../../components/ui/button/Button';
import { MoreDotIcon, PlusIcon } from '../../../icons';
import { Dropdown } from '../../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../../components/ui/dropdown/DropdownItem';
import { Modal } from '../../../components/ui/modal';
import Alert from '../../../components/ui/alert/Alert';
import { formatDate } from '../../../common/utils/dateUtils';
import VoucherDetail from './VoucherDetail';
import { ICreateVoucher, IVoucher } from '../models/voucher.interface';
import InputUpload from '../../../components/form/input/InputUpload';
import TextArea from '../../../components/form/input/TextArea';
import DatePicker from '../../../components/form/input/DatePicker';
import { appSettings } from '../../../api/axios/config';
import Select from '../../../components/form/Select';

export default function VoucherList() {
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailSelected, setDetailSelected] = useState<IVoucher | null>(null);

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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const defaultFormData = {
    name: '',
    selectedFile: null as File | null,
    description: '',
    code: '',
    voucherType: '',
    discountType: '',
    requiredPoints: '',
    value: '',
    status: '',
    startDate: '',
    endDate: '',
  };
  const [formData, setFormData] = useState(defaultFormData);

  const [toastSucess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  useEffect(() => {
    getVoucher();
  }, []);

  const getVoucher = async () => {
    const voucherReponse = await getAllVoucherApi();
    setVouchers(voucherReponse);
  };

  const onAddVoucher = async () => {
    const {
      name,
      selectedFile,
      description,
      code,
      voucherType,
      discountType,
      requiredPoints,
      value,
      startDate,
      endDate,
    } = formData;

    try {
      if (!name || !selectedFile) {
        setToastError('Vui lòng nhập tên voucher và chọn ảnh!');
        return;
      }

      const uploadResponse = await uploadFileApi(selectedFile);
      if (!uploadResponse || !uploadResponse.url) {
        setToastError('Upload ảnh thất bại. Vui lòng thử lại!');
        return;
      }

      const discount = parseInt(value);
      if (isNaN(discount) || discount < 0) {
        setToastError('Giá trị giảm giá không hợp lệ!');
        return;
      }

      // Kiểm tra ngày hợp lệ
      if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
        setToastError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!');
        return;
      }

      await createVoucherApi({
        name,
        image: `${appSettings.BASE_API_URL}${uploadResponse.url}`,
        description,
        code,
        discountType,
        voucherType,
        requiredPoints:
          voucherType === 'seed' ? parseInt(requiredPoints) : undefined,
        value: discount,
        status: 'active',
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });

      setToastSuccess('Thêm voucher thành công!');
      getVoucher();
      closeModalAdd();
    } catch (error) {
      console.error('Create voucher error:', error);
      setToastError('Lỗi khi tạo voucher. Vui lòng thử lại!');
    }
  };

  const onEditVoucher = async () => {
    if (!selectedId) return;

    const {
      name,
      selectedFile,
      description,
      code,
      voucherType,
      discountType,
      requiredPoints,
      value,
      status,
      startDate,
      endDate,
    } = formData;

    try {
      if (
        !name ||
        !code ||
        !voucherType ||
        !discountType ||
        !value ||
        !status ||
        !startDate ||
        !endDate
      ) {
        setToastError('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      let image: string | undefined = undefined;

      if (selectedFile) {
        const fileResponse = await uploadFileApi(selectedFile);

        if (!fileResponse?.url) {
          setToastError('Vui lòng chọn ảnh đại diện!');
          return;
        }

        image = appSettings.BASE_API_URL + fileResponse.url;
      }

      const discount = parseInt(value);
      if (isNaN(discount) || discount < 0) {
        setToastError('Giá trị giảm giá không hợp lệ!');
        return;
      }

      // Kiểm tra ngày hợp lệ
      if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
        setToastError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!');
        return;
      }

      const payload = {
        name,
        description,
        code,
        discountType,
        voucherType,
        requiredPoints:
          voucherType === 'seed' ? parseInt(requiredPoints) : undefined,
        value: discount,
        status,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      } as ICreateVoucher;

      if (image) {
        payload.image = image;
      }

      await updateVoucherApi(selectedId, payload);

      setToastSuccess('Chỉnh sửa voucher thành công!');
      getVoucher();
      setSelectedId(null);
      closeModalEdit();
    } catch (error) {
      console.error('Create voucher error:', error);
      setToastError('Lỗi khi chỉnh sửa voucher. Vui lòng thử lại!');
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const onDeleteVoucher = async () => {
    if (!selectedId) return;

    try {
      await deleteVoucherApi(selectedId);

      setToastSuccess('Xóa voucher thành công!');
      getVoucher();
      setSelectedId(null);
      closeModalDelete();
    } catch (error: any) {
      console.error('Lỗi khi xóa voucher:', error);
      setToastError(error.message);
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
          setFormData(defaultFormData);

          openModalAdd();
        }}
        className="mb-4"
        size="sm"
        variant="primary"
        endIcon={<PlusIcon />}
      >
        Thêm mới
      </Button>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                  Hình ảnh
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Mã giảm giá
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Loại voucher
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Ngày bắt đầu
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Ngày kết thúc
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {vouchers?.map((voucher) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setDetailSelected(voucher)}
                  key={voucher._id}
                >
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {voucher.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 flex justify-center text-theme-sm dark:text-gray-400">
                    <img
                      src={voucher.image}
                      alt={voucher.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {voucher.code}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {voucher.voucherType === 'global'
                      ? 'Toàn bộ hệ thống'
                      : 'Đổi điểm Seed'}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(voucher.startDate)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(voucher.endDate)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <div className="relative inline-block">
                      <button
                        className="dropdown-toggle"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleDropdown(voucher._id);
                        }}
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                      </button>
                      <Dropdown
                        isOpen={openMenuId === voucher._id}
                        onClose={closeDropdown}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();

                            setFormData({
                              name: voucher.name,
                              selectedFile: null,
                              description: voucher.description || '',
                              code: voucher.code,
                              voucherType: voucher.voucherType,
                              discountType: voucher.discountType,
                              requiredPoints:
                                voucher.requiredPoints?.toString() || '',
                              value: voucher.value.toString(),
                              status: voucher.status,
                              startDate: new Date(
                                voucher.startDate
                              ).toISOString(),
                              endDate: new Date(voucher.endDate).toISOString(),
                            });

                            setSelectedId(voucher._id);
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

                            setSelectedId(voucher._id);
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

      <Modal
        isOpen={isModalAddOpen}
        onClose={closeModalAdd}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-146">
          <h5 className="mb-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm voucher
          </h5>
          <div className="mt-4">
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên voucher
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
                Hình ảnh:
              </label>

              <InputUpload
                selectedFile={formData.selectedFile}
                onFileSelect={(file) =>
                  setFormData({ ...formData, selectedFile: file })
                }
              />
            </div>

            <div className="mb-3">
              <TextArea
                rows={3}
                error
                value={formData.description}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    description: value,
                  })
                }
              />
            </div>

            <div className="flex mb-3 gap-2">
              <div className="w-full ">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Loại voucher
                </label>
                <Select
                  placeholder="Loại voucher"
                  options={[
                    {
                      label: 'Toàn bộ cửa hàng',
                      value: 'global',
                    },
                    {
                      label: 'Đổi điểm seed',
                      value: 'seed',
                    },
                  ].map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  onChange={(value) =>
                    setFormData({ ...formData, voucherType: value || '' })
                  }
                />
              </div>
              <div className="w-full ">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Loại giảm giá
                </label>
                <Select
                  placeholder="Loại voucher"
                  options={[
                    {
                      label: 'Giá trị cố định',
                      value: 'fixedAmount',
                    },
                    {
                      label: 'Phần trăm',
                      value: 'percentage',
                    },
                  ].map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  onChange={(value) =>
                    setFormData({ ...formData, discountType: value || '' })
                  }
                />
              </div>
            </div>

            {formData.voucherType === 'seed' && (
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Số điểm cần đổi
                </label>
                <input
                  type="input"
                  value={formData.requiredPoints}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredPoints: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            )}

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mã giảm giá
                </label>
                <input
                  type="input"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Trị giá
                </label>
                <input
                  type="input"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            </div>

            <div className="flex mb-3 gap-2">
              <div className="w-full ">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày bắt đầu
                </label>
                <DatePicker
                  value={formData.startDate}
                  onChange={(value) =>
                    setFormData({ ...formData, startDate: value })
                  }
                  placeholder="Ngày bắt đầu"
                />
              </div>
              <div className="w-full ">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày bắt đầu
                </label>
                <DatePicker
                  value={formData.endDate}
                  onChange={(value) =>
                    setFormData({ ...formData, endDate: value })
                  }
                  placeholder=" Ngày kết thúc"
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
              onClick={onAddVoucher}
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
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-146">
          <h5 className="mb-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Chỉnh sửa voucher
          </h5>
          <div className="mt-4">
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên voucher
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
                Hình ảnh:
              </label>

              <InputUpload
                selectedFile={formData.selectedFile}
                onFileSelect={(file) =>
                  setFormData({ ...formData, selectedFile: file })
                }
              />
            </div>

            <div className="mb-3">
              <TextArea
                rows={3}
                error
                value={formData.description}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    description: value,
                  })
                }
              />
            </div>

            <div className="flex mb-3 gap-2">
              <div className="w-full ">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Loại voucher
                </label>
                <Select
                  defaultValue={formData.voucherType}
                  placeholder="Loại voucher"
                  options={[
                    {
                      label: 'Toàn bộ cửa hàng',
                      value: 'global',
                    },
                    {
                      label: 'Đổi điểm seed',
                      value: 'seed',
                    },
                  ].map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  onChange={(value) =>
                    setFormData({ ...formData, voucherType: value || '' })
                  }
                />
              </div>
              <div className="w-full ">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Loại giảm giá
                </label>
                <Select
                  defaultValue={formData.discountType}
                  placeholder="Loại voucher"
                  options={[
                    {
                      label: 'Giá trị cố định',
                      value: 'fixedAmount',
                    },
                    {
                      label: 'Phần trăm',
                      value: 'percentage',
                    },
                  ].map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  onChange={(value) =>
                    setFormData({ ...formData, discountType: value || '' })
                  }
                />
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="w-full ">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Trạng thái
                </label>
                <Select
                  defaultValue={formData.status}
                  placeholder="Trạng thái"
                  options={[
                    {
                      label: 'Đang hoạt động',
                      value: 'active',
                    },
                    {
                      label: 'Ngưng hoạt động',
                      value: 'inactive',
                    },
                  ].map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  onChange={(value) =>
                    setFormData({ ...formData, status: value || '' })
                  }
                />
              </div>

              {formData.voucherType === 'seed' && (
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Số điểm cần đổi
                  </label>
                  <input
                    type="input"
                    value={formData.requiredPoints}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requiredPoints: e.target.value,
                      })
                    }
                    className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                  />
                </div>
              )}
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mã giảm giá
                </label>
                <input
                  type="input"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Trị giá
                </label>
                <input
                  type="input"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            </div>

            <div className="flex mb-3 gap-2">
              <div className="w-full ">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày bắt đầu
                </label>
                <DatePicker
                  value={formData.startDate}
                  onChange={(value) =>
                    setFormData({ ...formData, startDate: value })
                  }
                  placeholder="Ngày bắt đầu"
                />
              </div>
              <div className="w-full ">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày bắt đầu
                </label>
                <DatePicker
                  value={formData.endDate}
                  onChange={(value) =>
                    setFormData({ ...formData, endDate: value })
                  }
                  placeholder=" Ngày kết thúc"
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
              onClick={onEditVoucher}
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
              onClick={onDeleteVoucher}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-success-600 sm:w-auto"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>

      <VoucherDetail
        isOpen={!!detailSelected}
        onClose={() => setDetailSelected(null)}
        voucher={detailSelected}
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
