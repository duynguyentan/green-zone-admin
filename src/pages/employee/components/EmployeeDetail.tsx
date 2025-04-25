import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { formatDate } from '../../../common/utils/dateUtils';
import {
  LocationIcon,
  MailIcon,
  PhoneIcon,
  TimeIcon,
  UserCircleIcon,
} from '../../../icons';
import { IEmployee } from '../models/employee.interface';
import { getGenderLabel } from '../models/gender.interface';

interface StoreDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: IEmployee | null;
}

const StoreDetail: React.FC<StoreDetailProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] py-12 px-6 lg:px-6"
      showCloseButton={false}
    >
      {employee && (
        <div className="flex flex-col gap-6">
          {/* Order ID */}
          <div className="flex  text-sm gap-x-2 font-semibold text-gray-800 dark:text-white/90 text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
            <span className="">Nhân viên:</span>{' '}
            <span>
              {employee.firstName} {employee.lastName}
            </span>
          </div>

          {employee?.avatar && (
            <div className="p-5 flex gap-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div key={employee.avatar} className="w-[140px] h-[140px]">
                <img
                  src={employee.avatar}
                  alt="grid"
                  className="border border-gray-200 rounded-xl dark:border-gray-800 w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <PhoneIcon />
                Số điện thoại
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {employee.phoneNumber}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <UserCircleIcon />
                Giới tính:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getGenderLabel(employee.gender || '')}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <MailIcon />
                Email:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {employee.email}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <LocationIcon />
                Cửa hàng làm việc:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {employee.workingStore.address}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Thời gian tạo:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(employee.createdAt)}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Thời gian cập nhật:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(employee.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StoreDetail;
