import { createContext, useState } from "react";
import { CartItem, UserType } from "../types";

export type UserContextType = {
	userState: UserType | null;
	setUserState: React.Dispatch<React.SetStateAction<UserType | null>>;
	setWishlistIds: (wishlistIds: string[]) => void;
	setCart: (cart: CartItem[]) => void;
	removeWishlistId: (wishlistId: string) => void;
	removeCartItem: (cartItemId: string) => void;
};

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userState, setUserState] = useState<UserType | null>(null);

	const setWishlistIds = (wishlistIds: string[]) => {
		setUserState((prev) => {
			if (prev) {
				return {
					...prev,
					wishlistIds,
				};
			}
			return null;
		});
	};

	const removeWishlistId = (wishlistId: string) => {
		setUserState((prev) => {
			if (prev) {
				return {
					...prev,
					wishlistIds: prev.wishlistIds.filter(
						(id) => id !== wishlistId
					),
				};
			}
			return null;
		});
	};

	const removeCartItem = (cartItemId: string) => {
		setUserState((prev) => {
			if (prev) {
				return {
					...prev,
					cart: prev.cart.filter((item) => item._id !== cartItemId),
				};
			}
			return null;
		});
	};

	const setCart = (cart: CartItem[]) => {
		setUserState((prev) => {
			if (prev) {
				return {
					...prev,
					cart,
				};
			}
			return null;
		});
	};

	return (
		<UserContext.Provider
			value={{
				userState,
				setUserState,
				setWishlistIds,
				setCart,
				removeCartItem,
				removeWishlistId,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const UserContext = createContext<UserContextType | null>(null);
