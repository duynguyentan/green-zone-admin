import React, { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/modal';
import { formatDate } from '../../../common/utils/dateUtils';
import { TimeIcon } from '../../../icons';
import { IProductDetail } from '../models/product.interface';
import { getProductByIdApi } from '../../../api/modules';
import { toVNDFormat } from '../../../common/utils/money';

interface ProductDetailProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  isOpen,
  onClose,
  productId,
}) => {
  const [productDetail, setProductDetail] = useState<IProductDetail>();

  const getProductDetail = async () => {
    if (productId) {
      const productDetailRes = await getProductByIdApi(productId);
      setProductDetail(productDetailRes);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [productId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] py-12 px-6 lg:px-6"
      showCloseButton={false}
    >
      {productDetail && (
        <div className="flex flex-col gap-6">
          {/* Order ID */}
          <div className="flex  text-sm gap-x-2 font-semibold text-gray-800 dark:text-white/90 text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
            <span className="">{productDetail.name}</span>
          </div>

          <div className="flex gap-4 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="w-[140px] h-[140px]">
              <img
                src={productDetail.image}
                alt="grid"
                className="border border-gray-200 rounded-xl dark:border-gray-800 w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
                <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <TimeIcon />
                  Mô tả
                </h6>

                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {productDetail.description.slice(0, 20)}...
                  {productDetail.description.slice(-20)}
                </span>
              </div>

              <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2 mb-4">
                <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <TimeIcon />
                  Thời gian tạo:
                </h6>

                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDate(productDetail.createdAt)}
                </span>
              </div>

              <div className="flex items-center  text-gray-600 dark:text-gray-400 gap-2">
                <h6 className="flex items-center gap-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <TimeIcon />
                  Thời gian cập nhật:
                </h6>

                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDate(productDetail.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-5 border border-gray-300 rounded-xl">
            <div className="">
              <h6 className="mb-2 font-semibold text-gray-700 dark:text-gray-400">
                Size
              </h6>

              {productDetail.variant.map((variant) => (
                <div key={variant._id} className="flex items-center gap-2">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    • {variant.size}
                  </span>
                  <span> - </span>
                  <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                    {toVNDFormat(variant.sellingPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="">
              <h6 className="mb-2 font-semibold text-gray-700 dark:text-gray-400">
                Topping
              </h6>

              {productDetail.topping.length ? (
                <div>
                  {productDetail.topping.map((topping) => {
                    if (topping)
                      return (
                        <div
                          key={topping._id}
                          className="flex items-center gap-2"
                        >
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                            • {topping.name}
                          </span>
                          <span> - </span>
                          <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                            {toVNDFormat(topping.extraPrice)}
                          </span>
                        </div>
                      );
                  })}
                </div>
              ) : (
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Sản phẩm không có topping
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductDetail;
