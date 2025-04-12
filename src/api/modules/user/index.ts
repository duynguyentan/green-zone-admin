import { ICurrentUser } from '../../../common/interfaces/currentUser.interface';
import { PaginationResult } from '../../../common/interfaces/pagination.interface';
import {
  ICreateEmoployee,
  IEmployee,
  IUpdateEmoployee,
} from '../../../pages/employee/models/employee.interface';
import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const getEmployeeApi = (
  page: number,
  storeId?: string | null,
  search?: string | null
): Promise<PaginationResult<IEmployee>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  if (storeId) params.append('storeId', storeId);
  if (search) params.append('search', search);

  return axios.get(`${appSettings.V1}/employee/all?${params.toString()}`);
};

export const createEmployeeApi = (
  payload: ICreateEmoployee
): Promise<IEmployee> =>
  axios.post(`${appSettings.V1}/employee/create`, payload);

export const updateEmployeeApi = (
  employeeId: string,
  payload: IUpdateEmoployee
) => axios.put(`${appSettings.V1}/employee/${employeeId}`, payload);

export const updateEmployeePasswordApi = (
  phoneNumber: string,
  newPassword: string
) =>
  axios.patch(`${appSettings.V1}/employee/change-password`, {
    phoneNumber,
    newPassword,
  });

export const deleteEmployeeApi = (employeeId: string): Promise<IEmployee> =>
  axios.delete(`${appSettings.V1}/employee/${employeeId}`);

export const getCustomerApi = (
  page: number
): Promise<PaginationResult<ICurrentUser>> =>
  axios.get(`${appSettings.V1}/user/all?page=${page}`);
