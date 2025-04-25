import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { IStore } from '../models/store.interface';
import { formatDate } from '../../../common/utils/dateUtils';
import { LocationIcon, PhoneIcon, TimeIcon } from '../../../icons';

interface StoreDetailProps {
  isOpen: boolean;
  onClose: () => void;
  store: IStore | null;
}

const StoreDetail: React.FC<StoreDetailProps> = ({
  isOpen,
  onClose,
  store,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] py-12 px-6 lg:px-6"
      showCloseButton={false}
    >
      {store && (
        <div className="flex flex-col gap-6">
          {/* Order ID */}
          <div className="flex  text-sm gap-x-2 font-semibold text-gray-800 dark:text-white/90 text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
            <span className="">Cửa hàng:</span> <span>{store.name}</span>
          </div>

          {store.images.length && (
            <div className="p-5 flex gap-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              {store.images.map((img, index) => (
                <div key={index} className="w-[140px] h-[140px]">
                  <img
                    src={img}
                    alt="grid"
                    className="border border-gray-200 rounded-xl dark:border-gray-800 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Thời gian mở / đóng cửa:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {store.openTime} - {store.closeTime}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <PhoneIcon />
                Số điện thoại liên hệ:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {store.phoneNumber}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <LocationIcon />
                Địa chỉ:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {store.address}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Thời gian tạo:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(store.createdAt)}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Thời gian cập nhật:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(store.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StoreDetail;
