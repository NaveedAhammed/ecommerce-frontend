import { useEffect, useState } from "react";
import Button from "../components/Button";
import CartItem from "../components/CartItem";
import { currencyFormatter } from "../utils/currencyFormat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from "../components/Loader";
import { IProduct } from "../types";
import { errorHandler } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";

export type CartItemType = {
	_id: string;
	productId: IProduct;
	quantity: number;
};

const Cart = () => {
	const [cart, setCart] = useState<CartItemType[]>([]);
	const axiosPrivate = useAxiosPrivate();
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const totalAmount = cart
		.map((item) => item.productId.price * item.quantity)
		.reduce((prev, acc) => prev + acc, 0);
	const totalDiscount =
		cart
			.map(
				(item) =>
					item.productId.price *
					item.productId.discount *
					item.quantity
			)
			.reduce((prev, acc) => prev + acc, 0) / 100;

	useEffect(() => {
		const getCartItems = () => {
			setIsLoading(true);
			axiosPrivate
				.get(`/products/cart`)
				.then((res) => {
					setCart(res.data.data.cart);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		getCartItems();
	}, [axiosPrivate]);

	if (isLoading) {
		return (
			<div className="w-full h-[90vh] flex items-center justify-center">
				<Loader color="black" height="5rem" width="5rem" />
			</div>
		);
	}

	const handleCheckout = () => {
		navigate("/checkout");
	};

	return (
		<div className="w-full flex gap-12 py-4 relative">
			<div className="w-[70%] shadow-md border rounded-md h-fit pb-4">
				<h1 className="text-lg p-4 border-b uppercase font-semibold text-mutedForeground">
					Cart items ({cart.length})
				</h1>
				{cart.map((item, i) => (
					<CartItem
						key={item._id}
						product={item.productId}
						quantityNum={item.quantity}
						cartItemId={item._id}
						setCartHook={setCart}
						className={`${
							i === cart.length - 1 ? "border-b-0" : ""
						}`}
					/>
				))}
			</div>
			<div className="w-[30%] shadow-md border rounded-md sticky top-[80px] h-fit left-0 flex flex-col pb-4">
				<h2 className="text-lg p-4 border-b uppercase font-semibold text-mutedForeground">
					Price Details
				</h2>
				<div className="flex flex-col gap-4 p-6">
					<div className="flex items-center justify-between">
						<span>
							Price ({cart.length}{" "}
							{cart.length > 1 ? "items" : "item"})
						</span>
						<span>
							{
								currencyFormatter
									.format(totalAmount)
									.split(".")[0]
							}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span>Discount</span>
						<span className="text-successForground">
							-
							{
								currencyFormatter
									.format(totalDiscount)
									.split(".")[0]
							}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span>Delivery Charges</span>
						<div className="flex items-center gap-1">
							<span className="text-mutedForeground line-through">
								{currencyFormatter.format(180).split(".")[0]}
							</span>
							<span className="text-successForground">Free</span>
						</div>
					</div>
					<div className="flex items-center justify-between py-6 border-t-2 border-b-2 border-dashed mt-4">
						<span className="text-lg font-semibold">
							Total Amount
						</span>
						<span className="text-lg font-semibold">
							{
								currencyFormatter
									.format(totalAmount - totalDiscount)
									.split(".")[0]
							}
						</span>
					</div>
					<div className="text-successForground font-semibold">
						You will save{" "}
						{currencyFormatter.format(totalDiscount).split(".")[0]}{" "}
						on this order
					</div>
				</div>
				<div className="p-4 w-full">
					<Button
						varient="default"
						size="lg"
						className="w-full"
						onClick={handleCheckout}
					>
						Checkout
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Cart;
