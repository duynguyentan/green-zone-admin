import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox';
import Button from '../ui/button/Button';
import Alert from '../ui/alert/Alert';
import { signInApi } from '../../api/modules';
import StorageService from '../../common/utils/localStorage';

export default function SignInForm() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onSignIn = async () => {
    if (!phoneNumber || !password) {
      setIsVisible(true);
      setError('Vui lòng nhập thông tin');
      return;
    }

    setError('');
    setIsVisible(false);

    try {
      const loginRes = await signInApi(phoneNumber, password);
      if (loginRes.user.roles[0].name !== 'admin') {
        setError('Tài khoản không có quyền truy cập');
        setIsVisible(true);
        return;
      }

      StorageService.setAccessToken(loginRes.token.accessToken.token);

      navigate('/', { replace: true });
    } catch (error) {
      setError('Số điện thoại hoặc mật khẩu không đúng');
      setIsVisible(true);
    }
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Quay lại Dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập số điện thoại và mật khẩu để đăng nhập!
            </p>
          </div>
          <div>
            <div className="space-y-6">
              <div>
                <Label>
                  Số điện thoại <span className="text-error-500">*</span>{' '}
                </Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div>
                <Label>
                  Mật khẩu <span className="text-error-500">*</span>{' '}
                </Label>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu của bạn"
                    onKeyDown={(e) => e.key === 'Enter' && onSignIn()}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Lưu thông tin đăng nhập
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-success-500 hover:text-success-600 dark:text-success-400"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button className="w-full" size="sm" onClick={onSignIn}>
                Đăng nhập
              </Button>
            </div>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {''}
                <Link
                  to="/signup"
                  className="text-success-500 hover:text-success-600 dark:text-success-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
            {isVisible && (
              <Alert
                isVisible={isVisible}
                variant="error"
                title="Thông tin đăng nhập không chính xác"
                message={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
