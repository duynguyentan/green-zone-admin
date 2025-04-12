import { VoucherList } from '.';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

export default function VoucherPage() {
  return (
    <>
      <PageMeta title="Ưu đãi | GreenZone" description="" />
      <PageBreadcrumb pageTitle="Ưu đãi" />
      <VoucherList />
    </>
  );
}
