import {
  IVoucher,
  ICreateVoucher,
} from '../../../pages/voucher/models/voucher.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getAllVoucherApi = (): Promise<IVoucher[]> =>
  axios.get(`${appSettings.V1}/voucher/all`);

export const createVoucherApi = (
  payload: ICreateVoucher
): Promise<IVoucher[]> =>
  axios.post(`${appSettings.V1}/voucher/create`, payload);

export const updateVoucherApi = (voucherId: string, payload: ICreateVoucher) =>
  axios.put(`${appSettings.V1}/voucher/${voucherId}`, payload);

export const deleteVoucherApi = (voucherId: string) =>
  axios.delete(`${appSettings.V1}/voucher/${voucherId}`);
