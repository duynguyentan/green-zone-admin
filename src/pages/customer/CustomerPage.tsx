import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import CustomerList from './components/CustomerList';

export default function CustomerPage() {
  return (
    <>
      <PageMeta title="Khách hàng | GreenZone" description="" />
      <PageBreadcrumb pageTitle="Khách hàng" />
      <CustomerList />
    </>
  );
}
