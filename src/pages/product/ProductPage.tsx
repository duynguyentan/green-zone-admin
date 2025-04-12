import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import ProductList from './components/ProductList';

export default function ProductPage() {
  return (
    <>
      <PageMeta title="Sản phẩm | GreenZone" description="" />
      <PageBreadcrumb pageTitle="Sản phẩm" />
      <ProductList />
    </>
  );
}
