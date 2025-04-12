import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import EmployeeList from './components/EmployeeList';

export default function ProductPage() {
  return (
    <>
      <PageMeta title="Nhân viên | GreenZone" description="" />
      <PageBreadcrumb pageTitle="Nhân viên" />
      <EmployeeList />
    </>
  );
}
