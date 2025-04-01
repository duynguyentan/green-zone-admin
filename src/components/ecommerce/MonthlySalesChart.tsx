import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import { getOrderCountApi } from '../../api/modules';
import { MonthlyOrderData } from '../../pages/Dashboard/models/statistic.interface';
import { toVNDFormat } from '../../common/utils/money';

export default function MonthlySalesChart() {
  const currentYear = new Date().getFullYear();
  const [yearSelected, setYearSelected] = useState(currentYear);
  const [orderCount, setOrderCount] = useState<MonthlyOrderData[]>([]);

  useEffect(() => {
    getOrderCount();
  }, [yearSelected]);

  const getOrderCount = async () => {
    const orderCount = await getOrderCountApi(yearSelected);

    setOrderCount(orderCount.monthlyData);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearSelected(Number(e.target.value));
  };

  const options: ApexOptions = {
    colors: ['#12b76a'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      labels: {
        formatter: (value: number) => toVNDFormat(value), // Định dạng tiền tệ
      },
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${toVNDFormat(val)}`,
      },
    },
  };
  const series = [
    {
      name: 'Bán',
      data: orderCount.map(({ totalRevenue }) => totalRevenue),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="w-full flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Doanh số hàng tháng theo năm
        </h3>
        <select
          value={yearSelected}
          onChange={handleYearChange}
          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {orderCount?.length && (
            <Chart options={options} series={series} type="bar" height={180} />
          )}
        </div>
      </div>
    </div>
  );
}
