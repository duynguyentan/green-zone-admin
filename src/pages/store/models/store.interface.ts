import { IBaseResponse } from '../../../common/interfaces/reponse.interface';

export interface IStore extends IBaseResponse {
  name: string;
  phoneNumber: string;
  images: string[];
  openTime: string;
  closeTime: string;
  specificAddress: string;
  ward: string;
  district: string;
  province: string;
  latitude: string;
  longitude: string;
}
