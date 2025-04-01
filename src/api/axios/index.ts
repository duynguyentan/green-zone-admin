import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
// import throttle from 'lodash/throttle';
import { appSettings } from './config';
import StorageService from '../../common/utils/localStorage';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: appSettings.BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔄 Refresh Token API
// const sendRefreshToken = async () => {
//   try {
//     const refreshToken = getRefreshToken();
//     if (!refreshToken) {
//       logout();
//       return;
//     }

//     const response = await axios.post(AUTH_ENDPOINT.REFRESH_TOKEN, { refreshToken });

//     if (response.data?.accessToken) {
//       setToken(response.data.accessToken);
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${response.data.accessToken}`;
//     } else {
//       logout();
//     }
//   } catch (error) {
//     logout();
//   }
// };

// // 🚀 Throttle Refresh Token (Giới hạn gọi API tránh spam)
// const throttledRefresh = throttle(sendRefreshToken, 10000, {
//   leading: true,
//   trailing: false,
// });

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = StorageService.getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response?.data?.data || {},

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      StorageService.onLogout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
