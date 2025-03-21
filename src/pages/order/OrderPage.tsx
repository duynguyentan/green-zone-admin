import { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import OrderList from './components/OrderList';

export default function OrderPage() {
  const [orderCount, setOrderCount] = useState(0);

  return (
    <>
      <PageMeta
        title={`Đơn hàng${orderCount ? ` (${orderCount})` : ''} | GreenZone`}
        description=""
      />
      <PageBreadcrumb pageTitle="Đơn hàng" />
      <OrderList setOrderCount={setOrderCount} />
    </>
  );
}
