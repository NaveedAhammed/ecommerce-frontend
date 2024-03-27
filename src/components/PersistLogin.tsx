import { useEffect, useState } from "react";
import useUserContext from "../hooks/useUserContext";
import useRefreshToken from "../hooks/useRefreshToken";
import Loader from "./Loader";
import { Outlet } from "react-router-dom";
import { UserContextType } from "../context/UserContext";

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const refresh = useRefreshToken();
	const { userState } = useUserContext() as UserContextType;
	const isLoggedIn = localStorage.getItem("isLoggedIn");

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				setIsLoading(true);
				await refresh();
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		};

		isLoggedIn &&
			isLoggedIn === "true" &&
			!userState?.accessToken &&
			verifyRefreshToken();
	}, [userState, refresh, isLoggedIn]);

	return (
		<div className="w-full min-h-[100vh] flex items-center justify-center">
			{isLoading ? (
				<Loader width="5rem" height="5rem" color="black" />
			) : (
				<Outlet />
			)}
		</div>
	);
};

export default PersistLogin;
