import {
  IDistrict,
  IProvince,
  IWard,
} from '../../../pages/store/models/location.interface';
import { IStore } from '../../../pages/store/models/store.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getProvinceApi = (): Promise<IProvince[]> =>
  axios.get(`${appSettings.V1}/location/province/all`);

export const getDistrictApi = (provinceCode: string): Promise<IDistrict> =>
  axios.get(`${appSettings.V1}/location/province/${provinceCode}/district`);

export const getWardApi = (districtCode: string): Promise<IWard> =>
  axios.get(`${appSettings.V1}/location/district/${districtCode}/ward`);
