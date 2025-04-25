import { IBaseResponse } from '../../../common/interfaces/reponse.interface';
import { IOrderItem } from './orderDetail.interface';
import { OrderStatus } from './orderStatus.interface';

export interface IOrder extends IBaseResponse {
  deliveryMethod: string;
  fulfillmentDateTime: Date;
  status: OrderStatus;
  note?: string;
  totalPrice: number;
  shippingFee?: number;
  transactionId?: string;
  paymentMethod: string;
  owner: {
    firstName?: string;
    lastName: string;
    phoneNumber: string;
  };
  consigneeName?: string;
  consigneePhone?: string;
  shippingAddress?: string;
  shipper?: string | null;
  creator?: string | null;
  store: {
    name: string;
    address: string;
  };
  voucher?: string | null;
  orderItems: IOrderItem[];
}
