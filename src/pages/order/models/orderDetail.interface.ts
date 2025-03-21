import { ICurrentUser } from '../../../common/interfaces/currentUser.interface';
import { IBaseResponse } from '../../../common/interfaces/reponse.interface';
import { DeliveryMethod } from './deliveryMethod.interface';
import { OrderStatus } from './orderStatus.interface';
import { PaymentMethod } from './paymentMethod.interface copy';

interface IProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  sellingPrice: number;
  size: string;
}

interface IToppingItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrderItem {
  price: number;
  product: IProduct;
  quantity: number;
  toppingItems?: IToppingItem[];
}

export interface IShippingAddress {
  consigneeName: string;
  consigneePhone: string;
  district: string;
  province: string;
  specificAddress: string;
  ward: string;
}

interface IStore {
  name: string;
  phoneNumber: string;
  district: string;
  province: string;
  specificAddress: string;
  ward: string;
  latitude: string;
  longitude: string;
  images: string[];
}

interface IEmployee {
  avatar: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface IVoucher {
  _id: string;
  // Các thông tin khác của voucher nếu có
}

export interface IOrderDetail extends IBaseResponse {
  deliveryMethod: DeliveryMethod;
  fulfillmentDateTime: string;
  note: string;
  shippingFee: number;
  status: OrderStatus;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  owner: {
    avatar: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  shipper: IEmployee;
  creator: IEmployee;
  store: IStore;
  totalPrice: number;
  voucher: IVoucher;
  orderItems: IOrderItem[];
}
