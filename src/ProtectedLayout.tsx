import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUserContext from "./hooks/useUserContext";

const ProtectedLayout = () => {
	const { user } = useUserContext();
	const location = useLocation();
	const redirect =
		location.pathname === "/" ? "/" : location.pathname.replace("/", "");
	if (!user) {
		return <Navigate to={`/login?redirect=${redirect}`} />;
	}
	return <Outlet />;
};

export default ProtectedLayout;
