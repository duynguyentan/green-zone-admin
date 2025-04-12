import {
  ILatLong,
  ISearchAddress,
} from '../../../pages/store/models/location.interface';
import axios from 'axios';
import { appSettings } from '../../axios/config';

// export const getProvinceApi = (): Promise<IProvince[]> =>
//   axios.get(`${appSettings.V1}/location/province/all`);

// export const getDistrictApi = (provinceCode: string): Promise<IDistrict> =>
//   axios.get(`${appSettings.V1}/location/province/${provinceCode}/district`);

// export const getWardApi = (districtCode: string): Promise<IWard> =>
//   axios.get(`${appSettings.V1}/location/district/${districtCode}/ward`);

export const searchAddressApi = async (
  keyword: string
): Promise<ISearchAddress> => {
  return axios
    .get(
      `${appSettings.GOONG_IO_URL}/Place/AutoComplete?api_key=${appSettings.GOONG_API_KEY}&input=${keyword}`
    )
    .then((response) => response.data)
    .catch((error) => console.log('GoongIo address error: ', error));
};

export const getLatLongApi = async (placeId: string): Promise<ILatLong> => {
  return axios
    .get(`${appSettings.GOONG_IO_URL}/Place/Detail`, {
      params: {
        place_id: placeId,
        api_key: appSettings.GOONG_API_KEY,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.log('GoongIo address error: ', error));
};
