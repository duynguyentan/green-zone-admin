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

export const deleteCategoryApi = (categoryId: string) =>
  axios.delete(`${appSettings.V1}/category/${categoryId}`);
