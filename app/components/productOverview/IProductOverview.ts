import { ILabel } from "../labels/ILabel";

export interface IProductOverview {
  id?: string;
  name: string;
  priority: number;
  status: string;
  mainImage?: IImage;
  rating?: number;
  labels?: any[];
  description: string;
  details?: IDetail[];
  variants: IVariant[];
}

export interface IVariant {
  name: string;
  price: number;
  stock: number;
  images?: IImage[];
}

export interface IDetail {
  title: string;
  detail: string;
}

export interface IImage {
  name: string;
  src: string;
  alt: string;
}
