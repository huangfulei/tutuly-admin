import { IImage } from "./IImage";
export interface IProductOverview {
  id?: string;
  name: string;
  priority: number;
  status: string;
  mainImage?: IImage;
  rating?: number;
  labels?: { [index: string]: string };
  description: string;
  details?: IDetail[];
  variants: IVariant[];
}

export interface IVariant {
  id?: string;
  name: string;
  price: number;
  stock: number;
  images?: IImage[];
}

export interface IDetail {
  title: string;
  detail: string;
}
