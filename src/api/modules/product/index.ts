import { ITopping } from '../../../pages/topping/components/ToppingList';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getToppingApi = (): Promise<ITopping[]> =>
  axios.get(`${appSettings.V1}/topping/all`);

export const createToppingApi = (name: string, extraPrice: string) =>
  axios.post(`${appSettings.V1}/topping/create`, {
    name,
    extraPrice: parseInt(extraPrice),
  });

export const deleteToppingApi = (toppingId: string) =>
  axios.delete(`${appSettings.V1}/topping/${toppingId}`);
