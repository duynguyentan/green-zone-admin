import { IBaseResponse } from '../../../common/interfaces/reponse.interface';

export interface ICreateVoucher {
  name: string;
  image?: string;
  description?: string;
  code: string;
  discountType: string;
  voucherType: string;
  requiredPoints?: number;
  value: number;
  status: string;
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
  requiredPoints?: number;
  value: number;
  status: string;
  startDate: Date;
  endDate: Date;
}
