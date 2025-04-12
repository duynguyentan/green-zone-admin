import { ToppingList } from '.';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

export default function CategoryPage() {
  return (
    <>
      <PageMeta title="Topping | GreenZone" description="" />
      <PageBreadcrumb pageTitle="Topping" />
      <ToppingList />
    </>
  );
}
