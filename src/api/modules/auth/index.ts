import { ICurrentUser } from '../../../common/interfaces/currentUser.interface';
import axios from '../../axios';

export const signInApi = (phoneNumber: string, password: string) =>
  axios.post(`/auth/login`, { phoneNumber, password });

export const getProfileApi = (): Promise<ICurrentUser> =>
  axios.get('auth/profile');
