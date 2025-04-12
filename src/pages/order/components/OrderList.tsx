import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import BasePagination from '../../../components/pagination/BasePagination';
import { formatDate } from '../../../common/utils/dateUtils';
import { IOrder } from '../models/order.interface';
import {
  getOrderStatusColor,
  OrderStatusLabel,
} from '../models/orderStatus.interface';
import { toVNDFormat } from '../../../common/utils/money';
import Badge from '../../../components/ui/badge/Badge';
import Select from '../../../components/form/Select';
import { getStoreApi, getOrderApi } from '../../../api/modules';
import { IStore } from '../../store/models/store.interface';
import SearchInput from '../../../components/form/input/SearchInput';
import OrderDetail from './OrderDetail';
import { extractAddress } from '../../../common/utils/truncateText';
import DatePicker from '../../../components/form/input/DatePicker';

interface OrderListProps {
  setOrderCount: (count: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({ setOrderCount }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [stores, setStores] = useState<IStore[]>([]);
  const [storeSelected, setStoreSelected] = useState<string | null>(null);
  const [statusSelected, setStatusSelected] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [orderSelected, setOrderSelected] = useState<string>('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    getOrder();
    getStore();
  }, []);

  useEffect(() => {
    getOrder();
  }, [currentPage, storeSelected, statusSelected, search, startDate, endDate]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getStore = async () => {
    const storeResponse = await getStoreApi(1);
    const { docs } = storeResponse;

    setStores(docs);
  };

  const getOrder = async () => {
    const orderResponse = await getOrderApi(
      currentPage,
      storeSelected,
      statusSelected,
      search,
      startDate,
      endDate
    );
    const { page, totalDocs, totalPages, docs } = orderResponse;

    setCurrentPage(page);
    setTotalDocs(totalDocs);
    setTotalPages(totalPages);
    setOrders(docs);
    setOrderCount(totalDocs);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 grid grid-cols-2 gap-10">
          <SearchInput
            placeholder="Nhập mã đơn, thông tin khách hàng, nhân viên..."
            onSearch={(value) => setSearch(value)}
          />
        </div>

        <div className="mb-4 flex justify-center items-center">
          <div className="w-full me-10">
            <Select
              placeholder="Lọc cửa hàng: Tất cả"
              options={stores.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
              onChange={(value) => setStoreSelected(value)}
            />
          </div>
          <div className="w-full">
            <Select
              placeholder="Lọc trạng thái: Tất cả"
              options={Object.entries(OrderStatusLabel).map(([key, label]) => ({
                label: label,
                value: key,
              }))}
              onChange={(value) => setStatusSelected(value)}
            />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full me-10">
            <DatePicker
              value={startDate}
              onChange={(value) => setStartDate(value)}
              placeholder="Đơn hàng: Từ ngày"
            />
          </div>
          <div className="w-full">
            <DatePicker
              value={endDate}
              onChange={(value) => setEndDate(value)}
              placeholder="Đơn hàng: Đến ngày"
            />
          </div>
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
                  className="px-4 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Mã đơn hàng
                </TableCell>

                <TableCell
                  isHeader
                  className="px-4 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Khách hàng
                </TableCell>

                <TableCell
                  isHeader
                  className="px-4 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Cửa hàng
                </TableCell>

                <TableCell
                  isHeader
                  className="px-4 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Trạng thái
                </TableCell>

                <TableCell
                  isHeader
                  className="px-4 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tổng đơn hàng
                </TableCell>

                <TableCell
                  isHeader
                  className="px-4 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Ngày tạo đơn
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders?.map((order) => (
                <TableRow
                  key={order._id}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setOrderSelected(order._id)}
                >
                  <TableCell className="px-3 py-3 text-gray-700 font-medium text-center text-theme-sm dark:text-gray-400">
                    #{order._id.slice(0, 2)}...{order._id.slice(-4)}
                  </TableCell>

                  <TableCell className="px-3 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <span className="whitespace-nowrap font-medium">
                      {order.deliveryMethod === 'delivery'
                        ? `${order?.consigneeName} - ${order?.consigneePhone}`
                        : order?.owner?.phoneNumber
                        ? `${order?.owner?.firstName} ${order?.owner?.lastName} - ${order?.owner?.phoneNumber}`
                        : 'Khách vãng lai'}
                    </span>
                    <br />

                    <span className="text-theme-xs">
                      {extractAddress(order?.shippingAddress) || ''}
                    </span>
                  </TableCell>

                  <TableCell className="px-3 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <span className="font-sm">{order.store.name}</span>
                  </TableCell>

                  <TableCell className="px-3 py-3 text-center text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={getOrderStatusColor(order.status)}>
                      {OrderStatusLabel[order.status]}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-3 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {toVNDFormat(order.totalPrice.toString())}
                  </TableCell>

                  <TableCell className="px-3 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(order.createdAt)}
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

      <OrderDetail
        isOpen={!!orderSelected}
        onClose={() => setOrderSelected('')}
        orderId={orderSelected}
      />
    </div>
  );
};

export default OrderList;
