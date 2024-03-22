import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import { GoPerson } from "react-icons/go";
import useUserContext from "../hooks/useUserContext";
import Input from "./Input";
import { FaCartShopping } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

const activeLink = ({ isActive }: { isActive: boolean }) => {
	return `text-sm font-medium transition-colors hover:text-primary ${
		isActive ? "text-black" : "text-mutedForeground"
	}`;
};

const Header = () => {
	const { user } = useUserContext();
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
					<NavLink to="/wishlist" className={activeLink}>
						Wishlist
					</NavLink>
					<NavLink to="/orders" className={activeLink}>
						Orders
					</NavLink>
				</nav>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 w-96">
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
					{!user && (
						<Button
							onClick={() => navigate("/login")}
							size="sm"
							varient="link"
						>
							Login
						</Button>
					)}
					{user && (
						<Button varient="outline" size="icon">
							{user?.avatar && (
								<img
									src={user.avatar}
									alt={user.username}
									className="w-full h-full rounded-[999px]"
								/>
							)}
							{!user?.avatar && (
								<GoPerson className="rounded-[999px]" />
							)}
						</Button>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
