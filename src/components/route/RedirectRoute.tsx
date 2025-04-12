import { Navigate, Outlet } from 'react-router';
import StorageService from '../../common/utils/localStorage';

const RedirectRoute = () => {
  const token = StorageService.getAccessToken();

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default RedirectRoute;
