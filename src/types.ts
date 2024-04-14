export type UserType = {
	_id: string;
	username: string;
	email: string;
	phone?: number;
	avatar?: string;
	gender?: string;
	accessToken: string;
	wishlistIds: string[];
	cart: CartItem[];
	shippingAddresses: IShippingInfo[];
};

export interface IShippingInfo {
	_id?: string;
	name: string;
	locality: string;
	address: string;
	city: string;
	state: IState;
	pincode: number;
	phone: number;
	alternatePhone?: number;
	addressType: string;
}

export interface IState {
	id: string;
	name: string;
}

export type CartItem = {
	_id: string;
	productId: string;
	quantity: number;
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
	brand: string;
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
	userId: UserType;
	numRating: number;
	comment: string;
	postedAt: string;
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
