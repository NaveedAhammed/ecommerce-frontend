export type UserType = {
	username: string;
	avatar?: string | undefined;
	accessToken: string;
	id: string;
};

export interface IProduct {
	title: string;
	description: string;
	price: number;
	stock: number;
	discount?: number;
	images: IImage[];
	numRating?: number;
	category?: ICategory;
	color?: IColor;
	size?: ISize;
	reviews: IReview[];
	featured: boolean;
}

export interface IImage {
	_id: string;
	url: string;
}

export interface IReview {
	userId: string;
	username: string;
	numRating: number;
	comment: string;
}

export interface ICategory {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface IColor {
	_id: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
}

export interface ISize {
	_id: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
}
