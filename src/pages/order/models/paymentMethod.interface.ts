export enum PaymentMethod {
  ONLINE = 'online', // Chuyển khoản ngân hàng
  COD = 'cod', // Thanh toán bằng tiền mặt
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.ONLINE]: 'Chuyển khoản ngân hàng',
  [PaymentMethod.COD]: ' Thanh toán bằng tiền mặt',
};
