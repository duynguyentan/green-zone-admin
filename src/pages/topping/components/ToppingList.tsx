import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  createToppingApi,
  deleteToppingApi,
  editToppingApi,
  getToppingApi,
} from '../../../api/modules';
import { useModal } from '../../../hooks/useModal';
import Button from '../../../components/ui/button/Button';
import { MoreDotIcon, PlusIcon } from '../../../icons';
import { Dropdown } from '../../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../../components/ui/dropdown/DropdownItem';
import { Modal } from '../../../components/ui/modal';
import Alert from '../../../components/ui/alert/Alert';
import { formatDate } from '../../../common/utils/dateUtils';
import { ITopping } from '../../product/models/product.interface';
import { toVNDFormat } from '../../../common/utils/money';

export default function ToppingList() {
  const [toppings, setToppings] = useState<ITopping[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const {
    isOpen: isModalAddOpen,
    openModal: openModalAdd,
    closeModal: closeModalAdd,
  } = useModal();
  const {
    isOpen: isModalEditOpen,
    openModal: openModalEdit,
    closeModal: closeModalEdit,
  } = useModal();

  const {
    isOpen: isModalDeleteOpen,
    openModal: openModalDelete,
    closeModal: closeModalDelete,
  } = useModal();

  const [toastSucess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    extraPrice: '',
  });

  useEffect(() => {
    getTopping();
  }, []);

  const toggleDropdown = (cateId: string) => {
    setOpenMenuId((prev) => (prev === cateId ? null : cateId));
  };

  const closeDropdown = () => {
    setOpenMenuId(null);
  };

  const getTopping = async () => {
    const toppingReponse = await getToppingApi();
    setToppings(toppingReponse);
  };

  const onAddTopping = async () => {
    try {
      const { name, extraPrice } = formData;

      if (!name || !extraPrice) {
        setToastError('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      await createToppingApi(name, extraPrice);

      getTopping();
      setToastSuccess('Thêm mới topping thành công!');
      closeModalAdd();
    } catch (error) {
      setToastError('Thêm topping thất bại, vui lòng thử lại!');
      console.error('Create topping error:', error);
    }
  };

  const onEditTopping = async () => {
    if (!selectedId) return;

    try {
      const { name, extraPrice } = formData;

      if (!name || !extraPrice) {
        setToastError('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      await editToppingApi(selectedId, name, extraPrice);

      getTopping();
      setToastSuccess('Chỉnh sửa topping thành công!');
      closeModalEdit();
      setSelectedId(null);
    } catch (error) {
      setToastError('Chỉnh sửa topping thất bại, vui lòng thử lại!');
      console.error('delete topping error:', error);
    }
  };

  const onDeleteTopping = async () => {
    if (!selectedId) return;

    try {
      await deleteToppingApi(selectedId);
      await getTopping();
      setToastSuccess('Xóa thành công');
      closeModalDelete();
      setSelectedId(null);
    } catch (error) {
      setToastError('Xóa topping thất bại, vui lòng thử lại!');
      console.error('Delete topping error:', error);
    }
  };

  useEffect(() => {
    if (toastSucess || toastError) {
      const timer = setTimeout(() => {
        setToastSuccess('');
        setToastError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastSucess, toastError]);

  return (
    <div>
      <Button
        onClick={openModalAdd}
        className="mb-4"
        size="sm"
        variant="primary"
        endIcon={<PlusIcon />}
      >
        Thêm mới
      </Button>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tên topping
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Giá bán
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Thời gian cập nhật
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-semibold text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Thời gian tạo
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {toppings?.map((topping) => (
                <TableRow key={topping._id}>
                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {topping.name}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {toVNDFormat(topping.extraPrice)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(topping.updatedAt)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    {formatDate(topping.createdAt)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-400">
                    <div className="relative inline-block">
                      <button
                        className="dropdown-toggle"
                        onClick={() => toggleDropdown(topping._id)}
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                      </button>
                      <Dropdown
                        isOpen={openMenuId === topping._id}
                        onClose={closeDropdown}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            setFormData({
                              name: topping.name,
                              extraPrice: topping.extraPrice,
                            });
                            setSelectedId(topping._id);
                            openModalEdit();
                            closeDropdown();
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Chỉnh sửa
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(event) => {
                            event.stopPropagation();
                            setSelectedId(topping._id);
                            openModalDelete();
                            closeDropdown();
                          }}
                          className="flex w-full font-normal text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Xóa
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={isModalAddOpen}
        onClose={closeModalAdd}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm topping
          </h5>
          <div className="mt-8">
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400">
                Tên topping
              </label>
              <input
                type="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400">
                Giá
              </label>
              <input
                type="input"
                value={formData.extraPrice}
                onChange={(e) =>
                  setFormData({ ...formData, extraPrice: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModalAdd}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onAddTopping}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-success-600 sm:w-auto"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalEditOpen}
        onClose={closeModalEdit}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Chỉnh sửa topping
          </h5>
          <div className="mt-8">
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400">
                Tên topping
              </label>
              <input
                type="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400">
                Giá
              </label>
              <input
                type="input"
                value={formData.extraPrice}
                onChange={(e) =>
                  setFormData({ ...formData, extraPrice: e.target.value })
                }
                className="dark:bg-dark-700 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModalEdit}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onEditTopping}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-success-600 sm:w-auto"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalDeleteOpen}
        onClose={closeModalDelete}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Bạn có chắc chắn muốn xóa không?
          </h5>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModalDelete}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={onDeleteTopping}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-success-600 sm:w-auto"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>

      {toastSucess && (
        <Alert
          isVisible={!!toastSucess}
          variant={'success'}
          title={'Thành công'}
          message={toastSucess || 'Thêm thành công!'}
        />
      )}

      {toastError && (
        <Alert
          isVisible={!!toastError}
          variant={'error'}
          title={'Thất bại'}
          message={toastError || 'Thêm thất bại!'}
        />
      )}
    </div>
  );
}
