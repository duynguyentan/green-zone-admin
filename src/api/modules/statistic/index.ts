import {
  OrderCountResponse,
  ISummary,
} from '../../../pages/Dashboard/models/statistic.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getSummaryApi = (): Promise<ISummary> =>
  axios.get(`${appSettings.V1}/statistic/summary`);

export const getOrderCountApi = (year: number): Promise<OrderCountResponse> =>
  axios.get(`${appSettings.V1}/statistic/order-count?year=${year}`);
