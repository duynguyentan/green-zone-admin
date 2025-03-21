import { ISummary } from '../../../pages/Dashboard/models/statistic.interface';
import { IStore } from '../../../pages/store/models/store.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getSummaryApi = (): Promise<ISummary> =>
  axios.get(`${appSettings.V1}/statistic/summary`);
