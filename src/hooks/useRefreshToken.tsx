import { AxiosError } from "axios";
import { UserContextType } from "../context/UserContext";
import { privateAxios } from "../utils/axios";
import useUserContext from "./useUserContext";

const useRefreshToken = () => {
	const { setUserState } = useUserContext() as UserContextType;

	const refresh = async () => {
		try {
			const res = (await privateAxios.get("/refresh")).data;
			const { user: userData, accessToken } = res.data;
			setUserState({
				username: userData.username,
				avatar: userData?.avatar,
				accessToken,
				_id: userData.id,
				wishlistIds: userData?.wishlistIds || [],
				email: userData?.email,
				phone: userData?.phone,
				gender: userData?.gender,
				cart: userData?.cart || [],
				shippingAddresses: userData?.shippingAddresses || [],
			});
			return res.data.accessToken;
		} catch (err) {
			const error = err as AxiosError;
			if (error?.response?.status === 401) {
				setUserState(null);
				localStorage.setItem("isLoggedIn", "false");
			}
		}
	};

	return refresh;
};

export default useRefreshToken;
