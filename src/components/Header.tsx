import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import { GoPerson } from "react-icons/go";
import useUserContext from "../hooks/useUserContext";
import Input from "./Input";
import { FaCartShopping } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { UserContextType } from "../context/UserContext";
import { useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import axios from "axios";

const activeLink = ({ isActive }: { isActive: boolean }) => {
	return `text-sm font-medium transition-colors hover:text-primary ${
		isActive ? "text-black" : "text-mutedForeground"
	}`;
};

interface ISearch {
	searchQuery: string;
}

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { userState, setUserState } = useUserContext() as UserContextType;
	const navigate = useNavigate();
	const methods = useForm<ISearch>();
	const axiosPrivate = useAxiosPrivate();

	const menuRef = useRef<HTMLDivElement>(null);

	const onSubmit: SubmitHandler<ISearch> = (formData: ISearch) => {
		if (!formData.searchQuery) return;
		navigate(`/products?search=${formData.searchQuery}`);
	};

	const handleLogout = () => {
		const res = axiosPrivate.post("/logout");
		toast.promise(res, {
			loading: `Logging out...`,
			success: (res) => {
				setUserState(null);
				localStorage.setItem("isLoggedIn", "false");
				return toast.success(res.data.message);
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

	useEffect(() => {
		const handler = (e) => {
			if (!menuRef.current?.contains(e.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);

		return () => {
			document.removeEventListener("mousedown", handler);
		};
	}, []);

	return (
		<header className="w-full border-b py-3 sticky top-0 left-0 z-[99] bg-background">
			<div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
				<nav className="flex items-center gap-4">
					<Link
						to="/"
						className="text-2xl font-bold tracking-tight mr-4"
					>
						Ecommerce Store
					</Link>
					<NavLink to="/" className={activeLink}>
						Home
					</NavLink>
					<NavLink to="/products" className={activeLink}>
						Products
					</NavLink>
					<NavLink to="/myProfile/wishlist" className={activeLink}>
						Wishlist
					</NavLink>
				</nav>
				<div className="flex items-center gap-4">
					<div className="w-[35rem]">
						<FormProvider {...methods}>
							<form
								className="w-full flex items-center gap-2"
								onSubmit={methods.handleSubmit(onSubmit)}
							>
								<Input
									id="searchQuery"
									name="searchQuery"
									autoComplete="on"
									type="text"
									placeholder="Search here..."
								/>
								<Button
									size="default"
									varient="default"
									type="submit"
								>
									<IoSearch className="mr-2" />
									Search
								</Button>
							</form>
						</FormProvider>
					</div>
					<Button
						size="default"
						varient="ghost"
						onClick={() => navigate("/cart")}
					>
						<span className="mr-2">{userState?.cart.length}</span>
						<FaCartShopping />
					</Button>
					{!userState && (
						<Button
							onClick={() => navigate("/login")}
							size="sm"
							varient="link"
						>
							Login
						</Button>
					)}
					{userState && (
						<Button
							varient="outline"
							size="icon"
							className="relative"
							onClick={() => setIsMenuOpen((prev) => !prev)}
						>
							{userState?.avatar && (
								<div>
									<img
										src={userState?.avatar}
										alt={userState.username}
										className="w-full h-full rounded-[999px]"
									/>
								</div>
							)}
							{!userState?.avatar && (
								<GoPerson className="rounded-[999px]" />
							)}
							{isMenuOpen && (
								<div
									className="flex flex-col items-start absolute top-[120%] right-0 w-36 bg-white shadow-md rounded-md py-2"
									ref={menuRef}
								>
									<Link
										to="/myProfile"
										className="py-2 px-4 hover:bg-secondary w-full text-start"
									>
										My Profile
									</Link>
									<Link
										to="/myProfile/wishlist"
										className="py-2 px-4 hover:bg-secondary w-full text-start"
									>
										Wishlist
									</Link>
									<Link
										to="/myProfile/orders"
										className="py-2 px-4 hover:bg-secondary w-full text-start"
									>
										Orders
									</Link>
									<div
										className="py-2 px-4 hover:bg-secondary w-full text-start"
										onClick={handleLogout}
									>
										Logout
									</div>
								</div>
							)}
						</Button>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
