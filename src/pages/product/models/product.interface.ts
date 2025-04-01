import { IBaseResponse } from '../../../common/interfaces/reponse.interface';

export enum VariantSize {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L',
  EXTRA_LARGE = 'XL',
}

export interface ICreateProduct {
  name: string;
  description: string;
  image: string;
  categoryIds: string[];
}

export interface IProduct extends IBaseResponse {
  name: string;
  description: string;
  image: string;
  sellingPrice?: number;
}

export interface IVariant extends IBaseResponse {
  size: string;
  sellingPrice: number;
  product: IProduct;
}

export interface ITopping extends IBaseResponse {
  name: string;
  extraPrice: string;
}

export interface IProductDetail extends IBaseResponse {
  name: string;
  description: string;
  image: string;
  sellingPrice?: number;
  variant: IVariant[];
  topping: ITopping[];
}
