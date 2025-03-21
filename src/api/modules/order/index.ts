import { PaginationResult } from '../../../common/interfaces/pagination.interface';
import { IOrder } from '../../../pages/order/models/order.interface';
import { IOrderDetail } from '../../../pages/order/models/orderDetail.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getOrderApi = (
  page: number,
  storeId?: string | null,
  status?: string | null,
  search?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  limit?: number | null,
): Promise<PaginationResult<IOrder>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  if (storeId) params.append('storeId', storeId);
  if (limit) params.append('limit', limit.toString());
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return axios.get(`${appSettings.V1}/order/all?${params.toString()}`);
};

export const getOrderByIdApi = (orderId: string): Promise<IOrderDetail> =>
  axios.get(`${appSettings.V1}/order/${orderId}`);
