import EcommerceMetrics from '../../components/ecommerce/EcommerceMetrics';
import MonthlySalesChart from '../../components/ecommerce/MonthlySalesChart';
import RecentOrders from '../../components/ecommerce/RecentOrders';
import DemographicCard from '../../components/ecommerce/DemographicCard';
import PageMeta from '../../components/common/PageMeta';
import { useEffect, useState } from 'react';
import { getSummaryApi } from '../../api/modules';
import { OrderStatsByStore, ITotal } from './models/statistic.interface';

export default function Home() {
  const [totals, setTotals] = useState<ITotal>({
    customer: { totalCustomers: 0, customerChange: 0 },
    order: { totalOrders: 0, orderChange: 0 },
  });
  const [orderStatsByStore, setOrderStatsByStore] = useState<
    OrderStatsByStore[]
  >([]);

  const getSummary = async () => {
    const summaryRespon = await getSummaryApi();

    setTotals(summaryRespon.totals);
    setOrderStatsByStore(summaryRespon.orderStatsByStore);
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <>
      <PageMeta title="Dashboard | GreenZone" description="" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics totals={totals} />

          <MonthlySalesChart />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard orderStatsByStore={orderStatsByStore} />
        </div>

        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
