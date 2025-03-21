import { IBaseResponse } from './reponse.interface';

export interface Role {
  _id: string;
  name: string;
}

export interface ICurrentUser extends IBaseResponse {
  phoneNumber: string;
  firstName?: string;
  lastName: string;
  email?: string | null;
  dateOfBirth?: string | null;
  gender: 'Male' | 'Female' | 'Other' | string;
  avatar?: string | null;
  verifyPhoneNumber: boolean;
  verifyMail: boolean;
  code: string;
  roles: Role[];
  permissions: string[];
}
