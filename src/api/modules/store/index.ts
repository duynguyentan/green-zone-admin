import { PaginationResult } from '../../../common/interfaces/pagination.interface';
import {
  ICreateStore,
  IStore,
} from '../../../pages/store/models/store.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getStoreApi = (page: number): Promise<PaginationResult<IStore>> =>
  axios.get(`${appSettings.V1}/store/all?page=${page}`);

export const createStoreApi = (payload: ICreateStore) =>
  axios.post(`${appSettings.V1}/store/create`, payload);

export const deleteStoreApi = (storeId: string): Promise<IStore> =>
  axios.delete(`${appSettings.V1}/store/${storeId}`);
