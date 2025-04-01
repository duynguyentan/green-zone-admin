import { ICurrentUser } from '../../../common/interfaces/currentUser.interface';
import { ISignIn } from '../../../pages/AuthPages/models/signIn.interface';
import axios from '../../axios';

export const signInApi = (
  phoneNumber: string,
  password: string
): Promise<ISignIn> => axios.post(`/auth/login`, { phoneNumber, password });

export const getProfileApi = (): Promise<ICurrentUser> =>
  axios.get('auth/profile');
