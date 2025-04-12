import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { formatDate } from '../../../common/utils/dateUtils';
import {
  DollarLineIcon,
  LockIcon,
  TimeIcon,
  VoucherIcon,
} from '../../../icons';
import { IVoucher } from '../models/voucher.interface';

interface VoucherDetailProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: IVoucher | null;
}

const VoucherDetail: React.FC<VoucherDetailProps> = ({
  isOpen,
  onClose,
  voucher,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] py-12 px-6 lg:px-6"
      showCloseButton={false}
    >
      {voucher && (
        <div className="flex flex-col gap-6">
          {/* Order ID */}
          <div className="flex  text-sm gap-x-2 font-semibold text-gray-800 dark:text-white/90 text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
            <span className="">Ưu đãi:</span> <span>{voucher.name}</span>
          </div>

          <div className="w-[140px] h-[140px]">
            <img
              src={voucher.image}
              alt="grid"
              className="border border-gray-200 rounded-xl dark:border-gray-800 w-full h-full object-cover"
            />
          </div>

          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <VoucherIcon />
                Chi tiết:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {voucher.description}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <LockIcon />
                Loại voucher:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {voucher.voucherType === 'global'
                  ? 'Toàn bộ hệ thống'
                  : 'Điểm seed'}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <LockIcon />
                Mã giảm giá:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {voucher.code}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <LockIcon />
                Loại giảm giá:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {voucher.discountType === 'percentage'
                  ? 'Phần trăm'
                  : 'Giá trị cố định'}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <DollarLineIcon />
                Giá trị:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {voucher.value}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Ngày bắt đầu:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(voucher.startDate)}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Ngày kết thúc:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(voucher.endDate)}
              </span>
            </div>

            <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2">
              <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                <TimeIcon />
                Thời gian tạo:
              </h6>

              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(voucher.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VoucherDetail;
