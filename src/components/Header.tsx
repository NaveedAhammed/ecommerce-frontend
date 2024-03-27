import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import { GoPerson } from "react-icons/go";
import useUserContext from "../hooks/useUserContext";
import Input from "./Input";
import { FaCartShopping } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { UserContextType } from "../context/UserContext";
import { useState } from "react";

const activeLink = ({ isActive }: { isActive: boolean }) => {
	return `text-sm font-medium transition-colors hover:text-primary ${
		isActive ? "text-black" : "text-mutedForeground"
	}`;
};

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { userState } = useUserContext() as UserContextType;
	const navigate = useNavigate();
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
				</nav>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 w-[35rem]">
						<Input
							id="search"
							name="search"
							autoComplete="on"
							type="text"
							placeholder="Search here..."
						/>
						<Button size="default" varient="default">
							<IoSearch className="mr-2" />
							Search
						</Button>
					</div>
					<Button
						size="default"
						varient="ghost"
						onClick={() => navigate("/cart")}
					>
						<span className="mr-2">9</span>
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
								<div className="flex flex-col items-start absolute top-[120%] right-0 w-36 bg-white shadow-md rounded-md py-2">
									<Link
										to="/myProfile"
										className="py-2 px-4 hover:bg-secondary w-full text-start"
									>
										My Profile
									</Link>
									<Link
										to="/wishlist"
										className="py-2 px-4 hover:bg-secondary w-full text-start"
									>
										Wishlist
									</Link>
									<Link
										to="/orders"
										className="py-2 px-4 hover:bg-secondary w-full text-start"
									>
										Orders
									</Link>
									<div
										className="py-2 px-4 hover:bg-secondary w-full text-start"
										onClick={() => {}}
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
