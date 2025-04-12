import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import StoreList from './components/StoreList';

export default function ProductPage() {
  return (
    <>
      <PageMeta title="Cửa hàng | GreenZone" description="" />
      <PageBreadcrumb pageTitle="Cửa hàng" />
      <StoreList />
    </>
  );
}
