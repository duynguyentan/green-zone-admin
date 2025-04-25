import { IBaseResponse } from '../../../common/interfaces/reponse.interface';

export interface IStore extends IBaseResponse {
  name: string;
  phoneNumber: string;
  images: string[];
  openTime: string;
  closeTime: string;
  address: string;
  latitude: string;
  longitude: string;
}

export interface ICreateStore {
  name: string;
  phoneNumber: string;
  images: string[];
  openTime: string;
  closeTime: string;
  address: string;
  latitude: string;
  longitude: string;
}
