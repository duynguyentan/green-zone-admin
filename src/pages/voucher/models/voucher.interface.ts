import { IBaseResponse } from '../../../common/interfaces/reponse.interface';

export interface ICreateVoucher {
  name: string;
  image: string;
  description?: string;
  code: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
}

export interface IVoucher extends IBaseResponse {
  name: string;
  image: string;
  description?: string;
  code: string;
  discountType: string;
  voucherType: string;
  value: number;
  startDate: Date;
  endDate: Date;
}
