export enum OrderStatus {
  AWAITING_PAYMENT = 'awaitingPayment', // Chờ thanh toán
  PENDING_CONFIRMATION = 'pendingConfirmation', // Chờ xác nhận đơn
  PROCESSING = 'processing', // Thực hiện đơn
  READY_FOR_PICKUP = 'readyForPickup', // Đã làm xong đơn, sẵn sàng giao
  SHIPPING_ORDER = 'shippingOrder', // Giao đơn hàng
  COMPLETED = 'completed', // Hoàn tất
  CANCELLED = 'cancelled', // Đã hủy
  FAILED_DELIVERY = 'failedDelivery', // Giao hàng thất bại
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.AWAITING_PAYMENT]: 'Chờ thanh toán',
  [OrderStatus.PENDING_CONFIRMATION]: 'Chờ xác nhận đơn',
  [OrderStatus.PROCESSING]: 'Thực hiện đơn',
  [OrderStatus.READY_FOR_PICKUP]: 'Đơn hàng sẵn sàng',
  [OrderStatus.SHIPPING_ORDER]: 'Đang giao hàng',
  [OrderStatus.COMPLETED]: 'Hoàn tất',
  [OrderStatus.CANCELLED]: 'Đã hủy',
  [OrderStatus.FAILED_DELIVERY]: 'Giao hàng thất bại',
};

export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return 'success';
    case OrderStatus.CANCELLED:
      return 'error';
    case OrderStatus.FAILED_DELIVERY:
      return 'error';
    case OrderStatus.AWAITING_PAYMENT:
      return 'warning';
    case OrderStatus.PENDING_CONFIRMATION:
      return 'warning';

    default:
      return 'info';
  }
};
