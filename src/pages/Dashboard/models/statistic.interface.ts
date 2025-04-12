export interface ITotal {
  customer: {
    totalCustomers: number;
    customerChange: number;
  };
  order: {
    totalOrders: number;
    orderChange: number;
  };
}

export type OrderStatsByStore = {
  _id: string;
  storeName: string;
  storeAddress: string;
  totalOrders: number;
  totalRevenue: number;
  percentage?: number;
};

export interface ISummary {
  totals: ITotal;
  orderStatsByStore: OrderStatsByStore[];
}

export type MonthlyOrderData = {
  month: number;
  totalOrders: number;
  totalRevenue: number;
};

export type OrderCountResponse = {
  year: number;
  monthlyData: MonthlyOrderData[];
};
