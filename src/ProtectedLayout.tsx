import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUserContext from "./hooks/useUserContext";
import { UserContextType } from "./context/UserContext";

const ProtectedLayout = () => {
	const { userState } = useUserContext() as UserContextType;
	const location = useLocation();
	if (!userState) {
		return (
			<Navigate
				to={`/login?redirect=${location.pathname}`}
				replace
				state={{ redirect: location }}
			/>
		);
	}
	return <Outlet />;
};

export default ProtectedLayout;
