export type UserType = {
	_id: string;
	username: string;
	avatar?: string | undefined;
	accessToken: string;
	wishlistIds: string[];
};

export interface IBillboard {
	_id: string;
	title: string;
	category: IParentCategory;
	imageUrl: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface IProduct {
	_id: string;
	title: string;
	description: string;
	price: number;
	stock: number;
	discount: number;
	images: IImage[];
	numRating?: number;
	category: IChildCategory;
	color?: IColor;
	unit?: IUnit;
	reviews: IReview[];
	featured: boolean;
	createdAt: string;
	updatedAt: string;
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

export interface IChildCategory {
	_id: string;
	name: string;
	parentCategory: IParentCategory;
	createdAt: string;
	updatedAt: string;
}

export interface IParentCategory {
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

export interface IUnit {
	_id: string;
	name: string;
	value: string;
	shortHand?: string;
	createdAt: string;
	updatedAt: string;
}
