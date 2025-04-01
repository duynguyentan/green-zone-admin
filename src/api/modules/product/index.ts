import { PaginationResult } from '../../../common/interfaces/pagination.interface';
import {
  ICreateProduct,
  IProduct,
  IProductDetail,
  ITopping,
} from '../../../pages/product/models/product.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getToppingApi = (): Promise<ITopping[]> =>
  axios.get(`${appSettings.V1}/topping/all`);

export const createToppingApi = (name: string, extraPrice: string) =>
  axios.post(`${appSettings.V1}/topping/create`, {
    name,
    extraPrice: parseInt(extraPrice),
  });

export const deleteToppingApi = (toppingId: string) =>
  axios.delete(`${appSettings.V1}/topping/${toppingId}`);

export const getAllProductApi = (
  page: number,
  limit?: number | null,
  search?: string | null,
  categoryId?: string | null
): Promise<PaginationResult<IProduct>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  if (limit) params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (categoryId) params.append('categoryId', categoryId);

  return axios.get(`${appSettings.V1}/product/admin/all?${params.toString()}`);
};

export const getProductByIdApi = (productId: string): Promise<IProductDetail> =>
  axios.get(`${appSettings.V1}/product/${productId}`);

export const createProductApi = (
  payload: ICreateProduct
): Promise<{ _id: string; message: string }> =>
  axios.post(`${appSettings.V1}/product/create`, payload);

export const deleteProductApi = (productId: string) =>
  axios.delete(`${appSettings.V1}/product/${productId}`);

export const createVariantApi = (
  productId: string,
  payload: { size: string; sellingPrice: number }
) =>
  axios.post(`${appSettings.V1}/product/${productId}/variant/create`, payload);

export const addToppingApi = (productId: string, toppingIds: string[]) =>
  axios.post(`${appSettings.V1}/product/${productId}/toppings/create`, {
    toppingIds,
  });
