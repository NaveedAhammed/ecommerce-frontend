import { createContext, useState } from "react";
import { UserType } from "../types";

export type UserContextType = {
	userState: UserType | null;
	setUser: (user: UserType | null) => void;
	addWishlistId: (productId: string) => void;
	removeWishlistId: (productId: string) => void;
};

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userState, setUserState] = useState<UserType | null>(null);

	const setUser = (user: UserType | null) => {
		setUserState(user);
	};

	const addWishlistId = (productId: string) => {
		setUserState((prev) => {
			if (prev) {
				return {
					...prev,
					wishlistIds: [...prev.wishlistIds, productId],
				};
			}
			return null;
		});
	};

	const removeWishlistId = (productId: string) => {
		setUserState((prev) => {
			if (prev) {
				return {
					...prev,
					wishlistIds: prev.wishlistIds.filter(
						(id) => id !== productId
					),
				};
			}
			return null;
		});
	};

	return (
		<UserContext.Provider
			value={{
				userState,
				setUser,
				addWishlistId,
				removeWishlistId,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const UserContext = createContext<UserContextType | null>(null);
