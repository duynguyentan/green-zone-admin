import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { getCustomerApi } from '../../../api/modules';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/ui/modal';
import Alert from '../../../components/ui/alert/Alert';
import { formatDate } from '../../../common/utils/dateUtils';
import BasePagination from '../../../components/pagination/BasePagination';
import CustomerDetail from './CustomerDetail';
import { ICurrentUser } from '../../../common/interfaces/currentUser.interface';

export default function CustomerList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [customers, setCustomers] = useState<ICurrentUser[]>([]);

  const { isOpen, closeModal } = useModal();

  const [toast, setToast] = useState('');
  const [detailSelected, setDetailSelected] = useState<ICurrentUser | null>(
    null
  );

  useEffect(() => {
    getCustomer();
  }, [currentPage]);

  const getCustomer = async () => {
    const customerReponse = await getCustomerApi(currentPage);

    const { page, totalDocs, totalPages, docs } = customerReponse;

    setCurrentPage(page);
    setCustomers(docs);
    setTotalDocs(totalDocs);
    setTotalPages(totalPages);
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
                  Tên khách hàng
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
                  Mã khách hàng
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
              {customers?.map((customer) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setDetailSelected(customer)}
                  key={customer._id}
                >
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {customer.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {customer.code}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(customer.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(customer.updatedAt)}
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
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Chỉnh sửa thông tin khách hàng
          </h5>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              // onClick={onAddEmployee}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </Modal>

      <CustomerDetail
        isOpen={!!detailSelected}
        onClose={() => setDetailSelected(null)}
        customer={detailSelected}
      />

      {toast && (
        <Alert
          isVisible={!!toast}
          variant={'success'}
          title={'Thành công'}
          message={toast || 'Thêm nhân viên thành công!'}
        />
      )}
    </div>
  );
}
