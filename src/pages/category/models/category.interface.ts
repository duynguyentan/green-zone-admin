import { IBaseResponse } from '../../../common/interfaces/reponse.interface';

export interface ICategory extends IBaseResponse {
  _id: string;
  name: string;
  icon: string;
}
