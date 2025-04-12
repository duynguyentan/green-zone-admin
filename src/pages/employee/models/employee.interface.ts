import { IBaseResponse } from '../../../common/interfaces/reponse.interface';
import { IStore } from '../../store/models/store.interface';

export interface IEmployee extends IBaseResponse {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  dateOfBirth?: Date;
  gender?: string;
  avatar: string;
  verifyPhoneNumber?: boolean;
  verifyMail?: boolean;
  workingStore: IStore;
}

export interface ICreateEmoployee {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatar: string;
  workingStore: string;
}

export interface IUpdateEmoployee {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatar: string;
  workingStore: string;
}
