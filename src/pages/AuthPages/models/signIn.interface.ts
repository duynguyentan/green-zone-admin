import { ICurrentUser } from '../../../common/interfaces/currentUser.interface';

export interface ISignIn {
  token: {
    accessToken: {
      expiresIn: string;
      token: string;
    };
    refreshToken: {
      expiresIn: string;
      token: string;
    };
  };
  user: ICurrentUser;
}
