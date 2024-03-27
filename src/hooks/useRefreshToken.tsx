import { UserContextType } from "../context/UserContext";
import { privateAxios } from "../utils/axios";
import useUserContext from "./useUserContext";

const useRefreshToken = () => {
	const { setUser } = useUserContext() as UserContextType;

	const refresh = async () => {
		const res = (await privateAxios.get("/refresh")).data;
		console.log(res);
		const { user: userData, accessToken } = res.data;
		setUser({
			username: userData.username,
			avatar: userData?.avatar,
			accessToken,
			_id: userData.id,
			wishlistIds: userData?.wishlistIds,
		});
		return res.data.accessToken;
	};

	return refresh;
};

export default useRefreshToken;
