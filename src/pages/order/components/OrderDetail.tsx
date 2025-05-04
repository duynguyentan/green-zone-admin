import React, { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/modal';
import { getOrderByIdApi } from '../../../api/modules';
import { IOrderDetail } from '../models/orderDetail.interface';
import Badge from '../../../components/ui/badge/Badge';
import {
  getOrderStatusColor,
  OrderStatus,
  OrderStatusLabel,
} from '../models/orderStatus.interface';
import { toVNDFormat } from '../../../common/utils/money';
import {
  DeliveryMethod,
  DeliveryMethodLabel,
} from '../models/deliveryMethod.interface';
import { PaymentMethodLabel } from '../models/paymentMethod.interface';
import {
  LocationIcon,
  PaymentMethodIcon,
  PaymentStatusIcon,
  ShippingMethodIcon,
  UserIcon,
} from '../../../icons';

interface OrderDetailProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  isOpen,
  onClose,
  orderId,
}) => {
  const [orderDetail, setOrderDetail] = useState<IOrderDetail>();

  useEffect(() => {
    if (orderId) {
      getOrderDetail();
    }
  }, [orderId]);

  const getOrderDetail = async () => {
    const detailReponse = await getOrderByIdApi(orderId);
    setOrderDetail(detailReponse);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[900px] p-6 lg:p-10"
      showCloseButton={false}
    >
      {orderDetail && (
        <div className="flex flex-col">
          {/* Order ID */}
          <div className="mb-4 py-2 flex justify-between border-b border-gray-300 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
            <h5> #{orderDetail?._id}</h5>
            <Badge size="sm" color={getOrderStatusColor(orderDetail.status)}>
              {OrderStatusLabel[orderDetail.status]}
            </Badge>
          </div>

          {/* Store */}
          <h6 className="mb-2 font-semibold text-gray-700 dark:text-gray-400">
            Cửa hàng
          </h6>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {orderDetail?.store?.name && (
              <div className="p-3 flex items-center gap-4 border border-gray-300 rounded-xl">
                <div className="w-12 h-12 overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    src={
                      orderDetail.store.images[0] ||
                      '../../../../public/images/logo/admin-logo.png'
                    }
                    alt={orderDetail.store.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {orderDetail.store.name}
                  </span>
                  <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                    {orderDetail.store.phoneNumber}
                  </span>
                  <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                    {orderDetail.store.address}
                  </span>
                </div>
              </div>
            )}

            {orderDetail?.creator.phoneNumber && (
              <div className="p-3 flex items-center gap-4 border border-gray-300 rounded-xl">
                <div className="w-12 h-12 overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    width={48}
                    height={48}
                    src={
                      orderDetail.creator.avatar ||
                      '../../../../public/images/logo/admin-logo.png'
                    }
                    alt={`${orderDetail.creator.avatar}`}
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {orderDetail.creator.firstName}{' '}
                    {orderDetail.creator.lastName}
                  </span>
                  <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                    {orderDetail.creator.phoneNumber}
                  </span>
                  <span className="block text-warning-600 text-theme-xs dark:text-gray-400 font-semibold">
                    Nhân viên tạo đơn
                  </span>
                </div>
              </div>
            )}

            {orderDetail?.shipper?.phoneNumber && (
              <div className="p-3 flex items-center gap-4 border border-gray-300 rounded-xl">
                <div className="w-12 h-12 overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    width={48}
                    height={48}
                    src={
                      orderDetail?.shipper.avatar ||
                      '../../../../public/images/logo/admin-logo.png'
                    }
                    alt={`${orderDetail?.shipper.avatar}`}
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {orderDetail?.shipper.firstName}{' '}
                    {orderDetail?.shipper.lastName}
                  </span>
                  <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                    {orderDetail?.shipper.phoneNumber}
                  </span>
                  <span className="block text-blue-light-500 text-theme-xs dark:text-gray-400 font-semibold">
                    Nhân viên giao hàng
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Order Detail*/}
          <div className="mb-4">
            <h6 className="mb-2 font-semibold text-gray-700 dark:text-gray-400">
              Sản phẩm
            </h6>
            <div className="grid grid-cols-2 gap-4 p-3 space-y-4 border  border-gray-300 rounded-xl">
              {orderDetail.orderItems.map((item) => (
                <div
                  key={item.product?._id}
                  className="m-0 flex items-start gap-3"
                >
                  {/* Ảnh sản phẩm */}
                  <div className="w-12 h-12 overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={item.product?.image ?? '/placeholder.jpg'}
                      alt={item.product?.name ?? 'Sản phẩm'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 text-sm">
                    <span className="block font-medium text-gray-800 dark:text-white/90">
                      {item.product?.name} - {item.product.size}
                    </span>
                    <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                      {item.quantity} x {toVNDFormat(item.price)}
                    </span>

                    {/* Danh sách topping (nếu có) */}
                    {item?.toppingItems?.length &&
                      item?.toppingItems[0]?._id && (
                        <div className="mt-1 space-y-1">
                          {item.toppingItems.map((topping) => (
                            <div
                              key={topping._id}
                              className="flex justify-between text-gray-600 dark:text-gray-400 text-theme-xs"
                            >
                              <span>• {topping.name}</span>
                              <span>
                                {topping.quantity} x{' '}
                                {toVNDFormat(topping.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <h6 className="mb-2 font-semibold text-gray-700 dark:text-gray-400">
                Thông tin nhận hàng
              </h6>

              {/* Customer */}
              <div className="">
                <div className="flex gap-2">
                  <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-1">
                    <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-600 dark:text-gray-400">
                      <UserIcon />
                      Khách hàng:
                    </h6>

                    <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {orderDetail?.deliveryMethod === 'delivery' ? (
                        <div className="flex">
                          <span className="text-sm font-medium">
                            {orderDetail?.consigneeName}
                          </span>
                          <span> - </span>
                          <span className="text-sm font-medium">
                            {orderDetail?.consigneePhone}
                          </span>
                        </div>
                      ) : orderDetail?.owner ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {orderDetail?.owner?.firstName}{' '}
                            {orderDetail?.owner?.lastName}
                          </span>
                          <span> - </span>
                          <span>{orderDetail?.owner?.phoneNumber}</span>
                        </div>
                      ) : (
                        'Khách vãng lai'
                      )}
                    </span>
                  </div>
                </div>

                {orderDetail?.shippingAddress && (
                  <div className="flex text-gray-600 dark:text-gray-400 gap-2 mb-1">
                    <h6 className="whitespace-nowrap flex items-center gap-1 text-xs leading-normal text-gray-600 dark:text-gray-400">
                      <LocationIcon />
                      Địa chỉ:
                    </h6>
                    <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {orderDetail?.shippingAddress}
                    </span>
                  </div>
                )}

                <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-1">
                  <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-600 dark:text-gray-400">
                    <PaymentMethodIcon />
                    Phương thức thanh toán:
                  </h6>

                  <span className="text-xs font-medium text-gray-800 dark:text-white/90">
                    {PaymentMethodLabel[orderDetail.paymentMethod]}
                  </span>
                </div>

                <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-1">
                  <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-600 dark:text-gray-400">
                    <PaymentStatusIcon />
                    Trạng thái thanh toán:
                  </h6>

                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {orderDetail.status === OrderStatus.COMPLETED ||
                    (orderDetail.paymentMethod === 'online' &&
                      orderDetail.status !== OrderStatus.AWAITING_PAYMENT) ||
                    orderDetail.deliveryMethod === 'pickup' ? (
                      <Badge size="sm" color="success">
                        Đã thanh toán
                      </Badge>
                    ) : (
                      <Badge size="sm" color="error">
                        Chưa thanh toán
                      </Badge>
                    )}
                  </span>
                </div>

                <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2">
                  <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-600 dark:text-gray-400">
                    <ShippingMethodIcon />
                    Phương thức giao hàng:
                  </h6>

                  <span
                    className={`text-xs font-medium dark:text-white/90 ${
                      orderDetail.deliveryMethod === DeliveryMethod.PICKUP
                        ? 'text-green-500'
                        : 'text-blue-500'
                    }`}
                  >
                    {DeliveryMethodLabel[orderDetail.deliveryMethod]}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h6 className="mb-2 font-semibold text-gray-700 dark:text-gray-400">
                Tổng cộng
              </h6>

              <div>
                <div className="flex items-center justify-between text-gray-600 font-semibold dark:text-gray-400 gap-2 mb-1">
                  <h6 className="flex items-center  gap-1 text-xs leading-normal text-gray-700 dark:text-gray-400">
                    Thành tiền:
                  </h6>

                  <span className="text-sm font-medium text-green-600 dark:text-white/90">
                    {toVNDFormat(orderDetail.totalPrice)}
                  </span>
                </div>

                {orderDetail.voucher && (
                  <div className="flex items-center  justify-between text-gray-600 font-semibold dark:text-gray-400 gap-2 mb-1">
                    <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-700 dark:text-gray-400">
                      Voucher:
                    </h6>

                    <span className="text-sm font-medium text-blue-500 dark:text-white/90">
                      {orderDetail.voucher.code}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between  text-gray-600 font-semibold dark:text-gray-400 gap-2 mb-1">
                  <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-700 dark:text-gray-400">
                    Phí giao hàng:
                  </h6>

                  <span className="text-sm font-medium text-orange-500 dark:text-white/90">
                    {toVNDFormat(orderDetail.shippingFee)}
                  </span>
                </div>

                <div className="flex items-center  justify-between text-gray-600 font-semibold dark:text-gray-400 gap-2">
                  <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-700 dark:text-gray-400">
                    Tổng đơn hàng:
                  </h6>

                  <span className="text-base text-red-500 font-semibold dark:text-white/90">
                    {toVNDFormat(orderDetail.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OrderDetail;
