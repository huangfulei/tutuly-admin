import { RawDraftContentState } from "draft-js";

import { IImage } from "./IImage";
export interface IProductOverview {
	id?: string;
	name: string;
	priority: number;
	status: string;
	price: number;
	mainImage?: IImage;
	rating: number;
	labels: string[];
	categories: { lvl0: string; lvl1: string; lvl2: string };
	description: RawDraftContentState;
	details?: IDetail[];
	variants: IVariant[];
}

export interface IVariant {
	id?: string;
	name: string;
	price: number;
	stock: number;
	onSalePrice?: { id: string; value: number | string };
	images?: IImage[];
}

export interface IDetail {
	title: string;
	detail: RawDraftContentState;
}
