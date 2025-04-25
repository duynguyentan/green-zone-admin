import { PaginationResult } from '../../../common/interfaces/pagination.interface';
import { ICategory } from '../../../pages/category/models/category.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getCategoryApi = (
  page: number
): Promise<PaginationResult<ICategory>> =>
  axios.get(`${appSettings.V1}/category/all?page=${page.toString()}`);

export const createCategoryApi = (name: string, icon: string) =>
  axios.post(`${appSettings.V1}/category/create`, { name, icon });

export const editCategoryApi = (
  categoryId: string,
  name: string,
  icon: string | undefined
) => {
  const data: Record<string, string> = { name };
  if (icon) data.icon = icon;

  return axios.put(`${appSettings.V1}/category/${categoryId}`, data);
};

export const deleteCategoryApi = (categoryId: string) =>
  axios.delete(`${appSettings.V1}/category/${categoryId}`);
