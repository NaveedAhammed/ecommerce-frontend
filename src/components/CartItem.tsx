import { currencyFormatter } from "../utils/currencyFormat";
import multiColor from "../assets/multiColor.svg";
import Button from "./Button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IProduct } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import useUserContext from "../hooks/useUserContext";
import { UserContextType } from "../context/UserContext";
import axios from "axios";
import { CartItemType } from "../pages/Cart";
import { Link } from "react-router-dom";

const CartItem: React.FC<{
	product: IProduct;
	quantityNum: number;
	cartItemId: string;
	setCartHook: React.Dispatch<React.SetStateAction<CartItemType[]>>;
	className?: string;
}> = ({ product, quantityNum, cartItemId, setCartHook, className }) => {
	const { setCart } = useUserContext() as UserContextType;

	const axiosPrivate = useAxiosPrivate();

	const handleCartItemQuantity = (type: string) => {
		const formData = new FormData();
		const quantitytemp = type === "inc" ? 1 : -1;
		formData.append("quantity", `${quantityNum + quantitytemp}`);
		const res = axiosPrivate.post(`/user/cart/${product._id}`, formData);
		toast.promise(res, {
			loading: "Please wait...",
			success: (res) => {
				setCart(res.data.data.user?.cart);
				setCartHook((prev) => {
					const updatedCart = prev.map((item) => {
						if (item._id === cartItemId) {
							return {
								...item,
								quantity: quantityNum + quantitytemp,
							};
						}
						return item;
					});
					return updatedCart;
				});
				return res.data.message;
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

	const handleDeleteCartItem = () => {
		const res = axiosPrivate.delete(`/user/cart/${product._id}`);
		toast.promise(res, {
			loading: "Removing cart item...",
			success: (res) => {
				setCart(res.data.data.user?.cart);
				setCartHook((prev) =>
					prev.filter((it) => it._id !== cartItemId)
				);
				return res.data.message;
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
		<div className={`w-full border-b py-4 ${className ? className : ""}`}>
			<div className="flex gap-4 px-4">
				<Link
					to={`/product/${product._id}`}
					className="w-[16%] h-40 border rounded-md overflow-hidden"
				>
					<img
						src={product.images[0].url}
						alt={product.title}
						className="w-full h-full object-contain"
					/>
				</Link>
				<div className="flex flex-col justify-between">
					<Link
						to={`/product/${product._id}`}
						className="font-medium hover:underline cursor-pointer"
					>
						{product.title.slice(0, 90)}...
					</Link>
					<div className="flex items-center gap-2">
						{product.discount > 0 && (
							<span className="line-through text-sm text-mutedForeground">
								{
									currencyFormatter
										.format(product.price * quantityNum)
										.split(".")[0]
								}
							</span>
						)}
						<span className="text-lg font-bold">
							{
								currencyFormatter
									.format(
										(product.price *
											quantityNum *
											(100 - product.discount)) /
											100
									)
									.split(".")[0]
							}
						</span>
						{product.discount > 0 && (
							<span className="bg-blue/20 text-[10px] text-blue px-[6px] py-[2px] rounded-md">
								{product.discount}%
							</span>
						)}
						<div className="flex items-center gap-1 text-sm">
							<span>Brand:</span>
							<span className="text-mutedForeground font-semibold">
								{product.brand}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-6 text-sm">
						<div className="flex items-center gap-2">
							<span className="text-mutedForeground">
								Category:
							</span>
							<span>{product.category.name}</span>
						</div>
						{product?.unit && (
							<div className="flex items-center gap-2">
								<span className="text-mutedForeground">
									{product.unit.name}
								</span>
								<span>{product.unit.value}</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<span className="text-mutedForeground">Color:</span>
							<div
								className={`w-6 h-6 rounded-full border`}
								style={{
									backgroundColor: `${product?.color?.value}`,
								}}
							>
								{product.color &&
									product.color.value === "multiColor" && (
										<img
											src={multiColor}
											alt=""
											className="object-fill"
										/>
									)}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Button
							varient="outline"
							size="icon"
							onClick={() => handleCartItemQuantity("dec")}
							disabled={quantityNum === 1}
						>
							<FaMinus />
						</Button>
						<span>{quantityNum}</span>
						<Button
							varient="outline"
							size="icon"
							onClick={() => handleCartItemQuantity("inc")}
							disabled={quantityNum >= 6}
						>
							<FaPlus />
						</Button>
						<Button
							varient="destructive"
							size="sm"
							className="w-fit text-xs"
							onClick={handleDeleteCartItem}
						>
							Remove
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
