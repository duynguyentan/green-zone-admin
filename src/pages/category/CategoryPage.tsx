import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import CategoryList from './components/CategoryList';

export default function CategoryPage() {
  return (
    <>
      <PageMeta title="Danh mục | GreenZone" description="" />
      <PageBreadcrumb pageTitle="Danh mục" />
      <CategoryList />
    </>
  );
}
