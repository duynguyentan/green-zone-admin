import { Navigate, Outlet } from 'react-router';
import StorageService from '../../common/utils/localStorage';

const PrivateRoute = () => {
  const token = StorageService.getAccessToken();

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
