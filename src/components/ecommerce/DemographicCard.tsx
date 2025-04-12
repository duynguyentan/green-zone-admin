import { OrderStatsByStore } from '../../pages/Dashboard/models/statistic.interface';
import { toVNDFormat } from '../../common/utils/money';

export default function DemographicCard({
  orderStatsByStore,
}: {
  orderStatsByStore: OrderStatsByStore[];
}) {
  const totalOrdersAllStores = orderStatsByStore.reduce(
    (sum, store) => sum + store.totalOrders,
    0
  );

  const updatedStats = orderStatsByStore.map((store) => ({
    ...store,
    percentage:
      totalOrdersAllStores > 0
        ? ((store.totalOrders / totalOrdersAllStores) * 100).toFixed(2) + '%'
        : '0%',
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Phân khúc đơn hàng
          </h3>
          {/* <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Lượng đơn hàng trên toàn quốc
          </p> */}
        </div>
        {/* <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div> */}
      </div>
      {/* <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <VietnamMap  />
      </div> */}

      <div className="space-y-5">
        {updatedStats.map((item) => (
          <div key={item._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {item.storeName}
                </p>
                <span className="block text-green-500 font-semibold text-theme-xs dark:text-green-400">
                  {item.totalOrders} đơn hàng
                </span>
                <span className="block text-orange-500 font-semibold text-theme-xs dark:text-yellow-400">
                  {toVNDFormat(item.totalRevenue)} tổng doanh thu
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-success-500 text-xs font-medium text-white"
                  style={{ width: parseFloat(item.percentage) }}
                ></div>
              </div>
              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {item.percentage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
