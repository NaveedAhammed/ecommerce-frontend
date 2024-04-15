import { Suspense } from "react";
import Loader from "../components/Loader";
import { NavLink, Outlet } from "react-router-dom";
import useUserContext from "../hooks/useUserContext";
import { UserContextType } from "../context/UserContext";
import profile from "../assets/profile.webp";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import axios from "axios";

const activeLink = ({ isActive }: { isActive: boolean }) => {
	return `text-[14px] font-medium transition-colors hover:text-primary py-3 px-6 w-full ${
		isActive ? "text-black bg-secondary" : "text-mutedForeground"
	}`;
};

const Profile = () => {
	const { userState, setUserState } = useUserContext() as UserContextType;
	const profilePicture = userState?.avatar ? userState.avatar : profile;

	const axiosPrivate = useAxiosPrivate();

	const handleLogout = () => {
		const res = axiosPrivate.post("/logout");
		toast.promise(res, {
			loading: `Logging out...`,
			success: () => {
				setUserState(null);
				localStorage.setItem("isLoggedIn", "false");
				return "Logged out!";
			},
			error: (err) => {
				if (axios.isAxiosError<{ message: string }>(err)) {
					if (!err?.response) {
						return "Something went wrong";
					} else {
						return `${err.response?.data?.message}`;
					}
				}
				return "Unexpected error!";
			},
		});
	};

	return (
		<div className="w-full max-w-[1400px] mx-auto h-full flex gap-10 relative py-2">
			<div className="w-[20%] border shadow-md rounded-md sticky top-[80px] h-fit left-0 py-2">
				<div className="flex items-center gap-4 w-full p-4 border-b">
					<img
						src={profilePicture}
						alt={userState?.username}
						className="w-14 h-14 rounded-full object-cover border"
					/>
					<div className="flex flex-col">
						<span className="text-xs">Hello,</span>
						<span className="text-lg font-semibold">
							{userState?.username}
						</span>
					</div>
				</div>
				<nav className="flex flex-col py-3 border-b">
					<NavLink to="/myProfile/info" className={activeLink}>
						My Info
					</NavLink>
					<NavLink to="/myProfile/addresses" className={activeLink}>
						Manage Addresses
					</NavLink>
					<NavLink to="/myProfile/orders" className={activeLink}>
						My Orders
					</NavLink>
					<NavLink to="/myProfile/wishlist" className={activeLink}>
						My Wishlist
					</NavLink>
				</nav>
				<div
					className="text-[14px] font-medium transition-colors hover:text-primary py-4 px-6 w-full cursor-pointer hover:bg-secondary mt-3"
					onClick={handleLogout}
				>
					<span>Logout</span>
				</div>
			</div>
			<Suspense
				fallback={
					<Loader
						width="3rem"
						height="3rem"
						color="black"
						className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
					/>
				}
			>
				<div className="w-[80%]">
					<Outlet />
				</div>
			</Suspense>
		</div>
	);
};

export default Profile;
