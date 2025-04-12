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
import { IVoucher } from '../models/voucher.interface';
import InputUpload from '../../../components/form/input/InputUpload';
import TextArea from '../../../components/form/input/TextArea';
import DatePicker from '../../../components/form/input/DatePicker';
import { appSettings } from '../../../api/axios/config';

export default function VoucherList() {
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [detailSelected, setDetailSelected] = useState<IVoucher | null>(null);

  const [toastSucess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  const [newVoucherName, setNewVoucherName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [voucherDes, setVoucherDesc] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountValue, setDiscoundValue] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    getVoucher();
  }, []);

  const getVoucher = async () => {
    const voucherReponse = await getAllVoucherApi();
    setVouchers(voucherReponse);
  };

  const onAddVoucher = async () => {
    try {
      if (!newVoucherName || !selectedFile) {
        setToastError('Vui lòng nhập tên voucher và chọn ảnh!');
        return;
      }

      // Upload ảnh và kiểm tra lỗi
      const uploadResponse = await uploadFileApi(selectedFile);
      if (!uploadResponse || !uploadResponse.url) {
        setToastError('Upload ảnh thất bại. Vui lòng thử lại!');
        return;
      }

      // Chuyển đổi dữ liệu hợp lệ
      const discount = parseInt(discountValue);
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
        name: newVoucherName,
        image: `${appSettings.BASE_API_URL}${uploadResponse.url}`,
        description: voucherDes,
        code: voucherCode,
        discountType: 'percentage',
        discountValue: discount,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });

      setToastSuccess('Thêm voucher thành công!');
      getVoucher();
      closeModal();
    } catch (error) {
      console.error('Create voucher error:', error);
      setToastError('Lỗi khi tạo voucher. Vui lòng thử lại!');
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const onDeleteVoucher = async (voucherId: string) => {
    try {
      const confirmDelete = window.confirm(
        'Bạn có chắc chắn muốn xóa voucher này?'
      );
      if (!confirmDelete) return;

      await deleteVoucherApi(voucherId);

      setToastSuccess('Xóa voucher thành công!');
      getVoucher();
    } catch (error) {
      console.error('Lỗi khi xóa voucher:', error);
      setToastError('Xóa voucher thất bại. Vui lòng thử lại!');
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
          setNewVoucherName('');
          setSelectedFile(null);
          setVoucherDesc('');
          setVoucherCode('');
          setDiscoundValue('');
          setStartDate('');
          setEndDate('');

          openModal();
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
                      : 'Điểm seed'}
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
                            closeDropdown();
                            // onDeleteStore(voucher._id);
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Chỉnh sửa
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            onDeleteVoucher(voucher._id);
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
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm voucher
          </h5>
          <div className="mt-4">
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên
              </label>
              <input
                type="input"
                value={newVoucherName}
                onChange={(e) => setNewVoucherName(e.target.value)}
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Hình ảnh:
              </label>

              <InputUpload
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            </div>

            <div className="mb-3">
              <TextArea
                rows={3}
                value={voucherDes}
                error
                onChange={(value) => setVoucherDesc(value)}
              />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mã giảm giá
                </label>
                <input
                  type="input"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Trị giá
                </label>
                <input
                  type="input"
                  value={discountValue}
                  onChange={(e) => setDiscoundValue(e.target.value)}
                  className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
                />
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <DatePicker
                value={startDate}
                onChange={(value) => setStartDate(value)}
                placeholder="Ngày bắt đầu"
              />
              <DatePicker
                value={endDate}
                onChange={(value) => setEndDate(value)}
                placeholder=" Ngày kết thúc"
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
              onClick={onAddVoucher}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Thêm mới
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
