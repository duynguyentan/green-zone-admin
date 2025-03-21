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

export interface IOrderByProvince {
  orderCount: number;
  percentage: number;
  province: string;
}

export interface ISummary {
  totals: ITotal;
  monthlySales: number[];
  customerByProvince: IOrderByProvince[];
}
