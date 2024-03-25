import { useEffect } from "react";
import { privateAxios } from "../utils/axios";
import useRefreshToken from "./useRefreshToken";
import useUserContext from "./useUserContext";

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { user } = useUserContext();

	useEffect(() => {
		const requestIntercept = privateAxios.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers[
						"Authorization"
					] = `Bearer ${user?.accessToken}`;
				}
				return config;
			},
			(err) => {
				Promise.reject(err);
			}
		);

		const responseInercept = privateAxios.interceptors.response.use(
			(res) => res,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers[
						"Authorization"
					] = `Bearer ${newAccessToken}`;
					return privateAxios(prevRequest);
				}
				// if (error?.response?.status === 401 && !prevRequest?.sent) {
				// 	setUser(null);
				// }
				return Promise.reject(error);
			}
		);

		return () => {
			privateAxios.interceptors.response.eject(responseInercept);
			privateAxios.interceptors.request.eject(requestIntercept);
		};
	}, [refresh, user]);

	return privateAxios;
};

export default useAxiosPrivate;
