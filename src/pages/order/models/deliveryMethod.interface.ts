export enum DeliveryMethod {
  PICKUP = 'pickup', // Mang đi
  DELIVERY = 'delivery', // Giao hàng
}

export const DeliveryMethodLabel: Record<DeliveryMethod, string> = {
  [DeliveryMethod.PICKUP]: 'Tự đến lấy hàng',
  [DeliveryMethod.DELIVERY]: 'Giao hàng tận nơi',
};


